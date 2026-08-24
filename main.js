const crypto = require('node:crypto');
const {
  ActionRowBuilder,
  ActivityType,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Client,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
  MessageFlags,
  ModalBuilder,
  Partials,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');

require('dotenv').config();

const config = require('./config');
const help = require('./help');

if (!config.token || !config.ownerId) {
  throw new Error('TOKEN and OWNER_ID must both be set in the environment.');
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction, Partials.User],
});

const pendingDrafts = new Map();

function makeReviewButtons(draftId, disabled = false) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`dm-send:${draftId}`)
      .setLabel('Send DM')
      .setStyle(ButtonStyle.Success)
      .setDisabled(disabled),
    new ButtonBuilder()
      .setCustomId(`dm-cancel:${draftId}`)
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabled),
  );
}

function makeConversationButtons(senderId, recipientId, acknowledged = false) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`dm-ack:${senderId}:${recipientId}`)
      .setLabel(acknowledged ? 'Acknowledged' : 'Acknowledge')
      .setStyle(acknowledged ? ButtonStyle.Success : ButtonStyle.Primary)
      .setDisabled(acknowledged),
    new ButtonBuilder()
      .setCustomId(`dm-reply:${senderId}:${recipientId}`)
      .setLabel('Reply')
      .setStyle(ButtonStyle.Secondary),
  );
}

function formatIncomingMessage(message) {
  const parts = [];

  if (message.content) parts.push(message.content);
  for (const attachment of message.attachments.values()) {
    parts.push(`[Attachment: ${attachment.name || 'file'}] ${attachment.url}`);
  }

  return parts.join('\n') || '[No text content]';
}

function truncate(text, maxLength = 1500) {
  return text.length <= maxLength ? text : `${text.slice(0, maxLength - 1)}…`;
}

function errorSummary(error) {
  if (error && typeof error === 'object' && 'code' in error) {
    return `Discord error code: ${error.code}`;
  }
  return 'Discord did not provide an error code.';
}

async function notifyUser(userId, messageOptions) {
  try {
    const user = await client.users.fetch(userId);
    const options = typeof messageOptions === 'string'
      ? { content: messageOptions }
      : messageOptions;

    await user.send({
      ...options,
      allowedMentions: { parse: [] },
    });
  } catch (error) {
    console.error(`Could not DM user ${userId}:`, error);
  }
}

function isAuthorizedUser(userId) {
  return config.authorizedUserIds.has(userId);
}

async function createDmReview(message, rawArguments) {
  const match = rawArguments.match(/^(?:<@!?(\d{17,20})>|(\d{17,20}))\s+([\s\S]+)$/);

  if (!match) {
    await message.reply(
      `Usage: \`${config.prefix}dm USER_ID your message here\`\n` +
        `You can also use a mention in place of \`USER_ID\`.`,
    );
    return;
  }

  const targetId = match[1] || match[2];
  const dmContent = match[3].trim();

  if (!dmContent || dmContent.length > 2000) {
    await message.reply('The DM must contain between 1 and 2,000 characters.');
    return;
  }

  let target;
  try {
    target = await client.users.fetch(targetId);
  } catch (error) {
    console.error('Could not find the DM target:', error);
    await message.reply('I could not find that Discord user. Double-check the user ID.');
    return;
  }

  const draftId = crypto.randomUUID();
  const embed = new EmbedBuilder()
    .setColor(0xf1c40f)
    .setTitle('Review this DM before sending')
    .addFields(
      { name: 'Recipient', value: `${target.tag} (${target.id})` },
      { name: 'Message', value: dmContent },
    )
    .setFooter({ text: `This draft expires in ${config.draftLifetimeMinutes} minutes.` });

  const reviewMessage = await message.reply({
    embeds: [embed],
    components: [makeReviewButtons(draftId)],
    allowedMentions: { parse: [] },
  });

  pendingDrafts.set(draftId, {
    content: dmContent,
    expiresAt: Date.now() + config.draftLifetimeMs,
    requesterId: message.author.id,
    reviewMessage,
    targetId: target.id,
    targetTag: target.tag,
  });

  const expiryTimer = setTimeout(async () => {
    const draft = pendingDrafts.get(draftId);
    if (!draft) return;

    pendingDrafts.delete(draftId);
    try {
      await draft.reviewMessage.edit({
        content: 'This DM draft expired without being sent.',
        embeds: [embed.setColor(0x95a5a6)],
        components: [makeReviewButtons(draftId, true)],
      });
    } catch (error) {
      console.error('Could not mark an expired draft:', error);
    }
  }, config.draftLifetimeMs);

  expiryTimer.unref();
}

function parseConversationButton(customId, expectedAction) {
  const parts = customId.split(':');
  if (parts[0] !== expectedAction) return null;

  // Supports acknowledgement buttons sent by the previous bot version.
  if (expectedAction === 'dm-ack' && parts.length === 2) {
    return { senderId: config.ownerId, recipientId: parts[1] };
  }

  if (parts.length !== 3) return null;
  return { senderId: parts[1], recipientId: parts[2] };
}

function validConversationParticipants(senderId, recipientId) {
  return /^\d{17,20}$/.test(senderId) && /^\d{17,20}$/.test(recipientId);
}

async function handleAcknowledgementButton(interaction) {
  const participants = parseConversationButton(interaction.customId, 'dm-ack');

  if (
    !participants ||
    !validConversationParticipants(participants.senderId, participants.recipientId) ||
    interaction.user.id !== participants.recipientId
  ) {
    await interaction.reply({
      content: 'Only the intended recipient can acknowledge this message.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  await interaction.deferUpdate();

  try {
    await interaction.message.edit({
      content: interaction.message.content,
      embeds: interaction.message.embeds,
      components: [
        makeConversationButtons(
          participants.senderId,
          participants.recipientId,
          true,
        ),
      ],
    });
  } catch (error) {
    console.error('Could not disable the acknowledgement button:', error);
  }

  await notifyUser(
    participants.senderId,
    `☑️ ${interaction.user.tag} (${interaction.user.id}) acknowledged your message.\n` +
      `Message ID: ${interaction.message.id}`,
  );
}

async function handleReplyButton(interaction) {
  const participants = parseConversationButton(interaction.customId, 'dm-reply');

  if (
    !participants ||
    !validConversationParticipants(participants.senderId, participants.recipientId) ||
    interaction.user.id !== participants.recipientId
  ) {
    await interaction.reply({
      content: 'Only the intended recipient can reply to this message.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const modal = new ModalBuilder()
    .setCustomId(
      `dm-reply-modal:${participants.senderId}:${participants.recipientId}:${interaction.message.id}`,
    )
    .setTitle('Reply to this message')
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('dm-reply-text')
          .setLabel('Your reply')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(1800),
      ),
    );

  await interaction.showModal(modal);
}

async function handleReplyModal(interaction) {
  const match = interaction.customId.match(
    /^dm-reply-modal:(\d{17,20}):(\d{17,20}):(\d{17,20})$/,
  );

  if (!match || interaction.user.id !== match[2]) {
    await interaction.reply({
      content: 'Only the intended recipient can submit this reply.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const targetId = match[1];
  const responderId = match[2];
  const originalMessageId = match[3];
  const replyText = interaction.fields.getTextInputValue('dm-reply-text').trim();

  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  if (!replyText) {
    await interaction.editReply('Your reply cannot be empty.');
    return;
  }

  try {
    const target = await client.users.fetch(targetId);
    await target.send({
      content:
        `📨 Reply from ${interaction.user.tag} (${responderId}):\n\n${replyText}\n\n` +
        `Replying to message ID: ${originalMessageId}`,
      components: [makeConversationButtons(responderId, targetId)],
      allowedMentions: { parse: [] },
    });

    await interaction.editReply(`✅ Reply sent successfully to ${target.tag}.`);
  } catch (error) {
    console.error('Could not send the button reply:', error);
    await interaction.editReply(
      `❌ The reply could not be sent. ${errorSummary(error)}`,
    );
  }
}

async function handleInteraction(interaction) {
  if (interaction.isModalSubmit() && interaction.customId.startsWith('dm-reply-modal:')) {
    await handleReplyModal(interaction);
    return;
  }

  if (!interaction.isButton()) return;

  if (interaction.customId.startsWith('dm-ack:')) {
    await handleAcknowledgementButton(interaction);
    return;
  }

  if (interaction.customId.startsWith('dm-reply:')) {
    await handleReplyButton(interaction);
    return;
  }

  if (!interaction.customId.startsWith('dm-send:') && !interaction.customId.startsWith('dm-cancel:')) {
    return;
  }

  if (!isAuthorizedUser(interaction.user.id)) {
    await interaction.reply({
      content: 'You are not authorized to approve or cancel DM drafts.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const [action, draftId] = interaction.customId.split(':');
  await interaction.deferUpdate();

  const draft = pendingDrafts.get(draftId);

  if (!draft || draft.requesterId !== interaction.user.id || draft.expiresAt <= Date.now()) {
    pendingDrafts.delete(draftId);
    await interaction.message.edit({
      content: 'This DM draft is no longer available.',
      embeds: interaction.message.embeds,
      components: [makeReviewButtons(draftId, true)],
    });
    return;
  }

  pendingDrafts.delete(draftId);
  await interaction.message.edit({
    embeds: interaction.message.embeds,
    components: [makeReviewButtons(draftId, true)],
  });

  if (action === 'dm-cancel') {
    await interaction.message.edit({
      content: 'DM cancelled. Nothing was sent.',
      embeds: interaction.message.embeds,
      components: [makeReviewButtons(draftId, true)],
    });
    return;
  }

  let sentMessage;
  try {
    const target = await client.users.fetch(draft.targetId);
    sentMessage = await target.send({
      content: draft.content,
      components: [makeConversationButtons(draft.requesterId, target.id)],
      allowedMentions: { parse: [] },
    });
  } catch (error) {
    console.error('Failed to send approved DM:', error);

    try {
      await interaction.message.edit({
        content: 'The DM could not be sent.',
        embeds: interaction.message.embeds,
        components: [makeReviewButtons(draftId, true)],
      });
    } catch (editError) {
      console.error('Could not update the failed DM review:', editError);
    }

    await notifyUser(
      draft.requesterId,
      `❌ DM to ${draft.targetTag} (${draft.targetId}) was unsuccessful. ` +
        `They may have DMs disabled or may have blocked the bot. ${errorSummary(error)}`,
    );
    return;
  }

  try {
    await interaction.message.edit({
      content: `Sent successfully to ${draft.targetTag}.`,
      embeds: interaction.message.embeds,
      components: [makeReviewButtons(draftId, true)],
    });
  } catch (error) {
    console.error('The DM sent, but the review message could not be updated:', error);
  }

  await notifyUser(
    draft.requesterId,
    `✅ DM sent successfully to ${draft.targetTag} (${draft.targetId}).\n` +
      `Message ID: ${sentMessage.id}`,
  );
}

function getConversationParticipants(message) {
  for (const row of message.components || []) {
    for (const component of row.components || []) {
      const customId = component.customId || component.data?.customId;
      if (!customId) continue;

      const participants =
        parseConversationButton(customId, 'dm-reply') ||
        parseConversationButton(customId, 'dm-ack');

      if (
        participants &&
        validConversationParticipants(participants.senderId, participants.recipientId)
      ) {
        return participants;
      }
    }
  }

  return null;
}

async function forwardDirectMessage(message) {
  let notificationTargetId = null;

  if (message.reference?.messageId) {
    try {
      const referencedMessage = await message.channel.messages.fetch(message.reference.messageId);
      const participants = getConversationParticipants(referencedMessage);

      if (participants?.recipientId === message.author.id) {
        notificationTargetId = participants.senderId;
      }
    } catch (error) {
      console.error('Could not resolve the referenced DM:', error);
    }
  }

  if (!notificationTargetId && message.author.id !== config.ownerId) {
    notificationTargetId = config.ownerId;
  }

  if (!notificationTargetId) return;

  const replyLabel = message.reference?.messageId
    ? `They replied to message ID ${message.reference.messageId}.`
    : 'They sent the bot a direct message.';

  await notifyUser(notificationTargetId, {
    content:
      `📩 DM received from ${message.author.tag} (${message.author.id}).\n` +
      `${replyLabel}\n\n${truncate(formatIncomingMessage(message))}`,
    components: [makeConversationButtons(message.author.id, notificationTargetId)],
  });
}

async function handleDirectMessage(message) {
  if (!message.content.startsWith(config.prefix)) {
    await forwardDirectMessage(message);
    return;
  }

  const withoutPrefix = message.content.slice(config.prefix.length).trim();
  const firstSpace = withoutPrefix.indexOf(' ');
  const command = (firstSpace === -1 ? withoutPrefix : withoutPrefix.slice(0, firstSpace)).toLowerCase();
  const rawArguments = firstSpace === -1 ? '' : withoutPrefix.slice(firstSpace + 1).trim();

  if (!isAuthorizedUser(message.author.id)) {
    if (command === 'dm') {
      await message.reply('You are not authorized to use the DM command.');
    } else {
      await forwardDirectMessage(message);
    }
    return;
  }

  if (command === 'dm') {
    await createDmReview(message, rawArguments);
  } else if (command === 'help') {
    const commandList = Object.entries(help)
      .map(([name, details]) => `\`${config.prefix}${details.format}\` — ${details.description}`)
      .join('\n');
    await message.reply(commandList);
  } else if (command === 'ping') {
    await message.reply('Pong! The bot is online.');
  }
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Systems online as ${readyClient.user.tag}!`);
  readyClient.user.setActivity('hacking a mainframe', { type: ActivityType.Playing });
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    await handleInteraction(interaction);
  } catch (error) {
    console.error('Interaction failed:', error);

    if (interaction.isRepliable() && !interaction.deferred && !interaction.replied) {
      try {
        await interaction.reply({
          content: 'Something went wrong while handling that interaction. Please try again.',
          flags: MessageFlags.Ephemeral,
        });
      } catch (replyError) {
        console.error('Could not report the button failure:', replyError);
      }
    }
  }
});

client.on(Events.MessageCreate, async (message) => {
  try {
    if (message.author.bot) return;

    if (message.channel.type === ChannelType.DM) {
      await handleDirectMessage(message);
      return;
    }

    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/\s+/);
    const command = args.shift()?.toLowerCase();

    if (command === 'help') {
      await message.channel.send(
        `DM me \`${config.prefix}dm USER_ID your message\` to create an owner-reviewed DM.`,
      );
    } else if (command === 'welcome') {
      await message.channel.send(
        "Welcome <@[user id]> to the official FBC Youth server! Please read our " +
          '<#752955457647149089> and <#752955583749161033>, then introduce yourself in ' +
          '<#752955636043743256>. Are you ready to steal the world\'s treasure and take their hearts? ' +
          "I believe that your life will change, so wake up, get up, and get out there. It's showtime!",
      );
    } else if (command === 'ping') {
      await message.author.send("Ain't no time like the present, whadaya need?");
    } else if (command === 'boost') {
      await message.channel.send('<@389558217035874308> has boosted the server!');
    } else if (command === 'boosted') {
      await message.channel.send(
        '<@389558217035874308> has boosted the server! FBC Youth has achieved **Level 1!**',
      );
    } else if (command === 'camp') {
      await message.channel.send('<@[channel id]>');
    }
  } catch (error) {
    console.error('Message handler failed:', error);
  }
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  try {
    if (user.bot) return;
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();

    if (reaction.message.channel.type !== ChannelType.DM) return;
    if (reaction.message.author?.id !== client.user.id) return;

    const participants = getConversationParticipants(reaction.message);
    if (!participants && user.id === config.ownerId) return;

    const notificationTargetId =
      participants?.recipientId === user.id
        ? participants.senderId
        : config.ownerId;
    const originalText = truncate(reaction.message.content || '[No text content]', 750);
    await notifyUser(
      notificationTargetId,
      `🔔 ${user.tag} (${user.id}) reacted ${reaction.emoji} to a bot DM.\n\n` +
        `Original message:\n${originalText}`,
    );
  } catch (error) {
    console.error('Reaction handler failed:', error);
  }
});

client.on(Events.GuildMemberAdd, async (guildMember) => {
  try {
    const welcomeRole = guildMember.guild.roles.cache.find(
      (role) => role.name === config.welcomeRoleName,
    );

    if (welcomeRole?.editable) await guildMember.roles.add(welcomeRole);

    const welcomeChannel = guildMember.guild.channels.cache.get(config.welcomeChannelId);
    if (welcomeChannel?.isTextBased()) {
      await welcomeChannel.send(
        `Welcome <@${guildMember.user.id}> to the official FBC Youth server! Please read our ` +
          '<#752955457647149089> and <#752955583749161033>, then introduce yourself in ' +
          '<#752955636043743256>. Are you ready to steal the world\'s treasure and take their hearts? ' +
          "I believe that your life will change, so wake up, get up, and get out there. It's showtime!",
      );
    }
  } catch (error) {
    console.error('Welcome flow failed:', error);
  }
});

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  try {
    const boostChannel = newMember.guild.channels.cache.get(config.boostChannelId);
    if (!boostChannel?.isTextBased()) return;

    if (!oldMember.premiumSince && newMember.premiumSince) {
      await boostChannel.send(`${newMember.user.tag} has boosted the server!`);
    } else if (oldMember.premiumSince && !newMember.premiumSince) {
      await boostChannel.send(`${newMember.user.tag} has unboosted the server!`);
    }
  } catch (error) {
    console.error('Boost update failed:', error);
  }
});

require('./server')();
client.login(config.token);
