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
  Partials,
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

async function notifyOwner(content) {
  try {
    const owner = await client.users.fetch(config.ownerId);
    await owner.send({ content, allowedMentions: { parse: [] } });
  } catch (error) {
    console.error('Could not DM the owner:', error);
  }
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
    ownerId: message.author.id,
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

async function handleReviewButton(interaction) {
  if (!interaction.isButton()) return;
  if (!interaction.customId.startsWith('dm-send:') && !interaction.customId.startsWith('dm-cancel:')) {
    return;
  }

  if (interaction.user.id !== config.ownerId) {
    await interaction.reply({
      content: 'Only the configured bot owner can approve or cancel this DM.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const [action, draftId] = interaction.customId.split(':');
  await interaction.deferUpdate();

  const draft = pendingDrafts.get(draftId);

  if (!draft || draft.ownerId !== interaction.user.id || draft.expiresAt <= Date.now()) {
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

    await notifyOwner(
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

  await notifyOwner(
    `✅ DM sent successfully to ${draft.targetTag} (${draft.targetId}).\n` +
      `Message ID: ${sentMessage.id}`,
  );
}

async function handleDirectMessage(message) {
  if (message.author.id !== config.ownerId) {
    const replyLabel = message.reference?.messageId
      ? `They replied to message ID ${message.reference.messageId}.`
      : 'They sent the bot a direct message.';

    await notifyOwner(
      `📩 DM received from ${message.author.tag} (${message.author.id}).\n` +
        `${replyLabel}\n\n${truncate(formatIncomingMessage(message))}`,
    );
    return;
  }

  if (!message.content.startsWith(config.prefix)) return;

  const withoutPrefix = message.content.slice(config.prefix.length).trim();
  const firstSpace = withoutPrefix.indexOf(' ');
  const command = (firstSpace === -1 ? withoutPrefix : withoutPrefix.slice(0, firstSpace)).toLowerCase();
  const rawArguments = firstSpace === -1 ? '' : withoutPrefix.slice(firstSpace + 1).trim();

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
    await handleReviewButton(interaction);
  } catch (error) {
    console.error('Button interaction failed:', error);

    if (interaction.isRepliable() && !interaction.deferred && !interaction.replied) {
      try {
        await interaction.reply({
          content: 'Something went wrong while handling that button. Please create a new DM draft.',
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
    if (user.bot || user.id === config.ownerId) return;
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();

    if (reaction.message.channel.type !== ChannelType.DM) return;
    if (reaction.message.author?.id !== client.user.id) return;

    const originalText = truncate(reaction.message.content || '[No text content]', 750);
    await notifyOwner(
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
