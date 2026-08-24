const draftLifetimeMinutes = 10;
const discordIdPattern = /^\d{17,20}$/;
const authorizedUserIds = new Set(
  [process.env.OWNER_ID, ...(process.env.AUTHORIZED_USER_IDS || '').split(',')]
    .map((id) => id?.trim())
    .filter((id) => discordIdPattern.test(id)),
);

module.exports = {
  prefix: process.env.PREFIX || '+',
  token: process.env.TOKEN,
  ownerId: process.env.OWNER_ID,
  authorizedUserIds,
  draftLifetimeMinutes,
  draftLifetimeMs: draftLifetimeMinutes * 60 * 1000,
  welcomeRoleName: process.env.WELCOME_ROLE_NAME || 'everyone',
  welcomeChannelId: process.env.WELCOME_CHANNEL_ID || '752955435681841252',
  boostChannelId: process.env.BOOST_CHANNEL_ID || '752955547942387752',
};
