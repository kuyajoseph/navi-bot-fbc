const draftLifetimeMinutes = 10;

module.exports = {
  prefix: process.env.PREFIX || '+',
  token: process.env.TOKEN,
  ownerId: process.env.OWNER_ID,
  draftLifetimeMinutes,
  draftLifetimeMs: draftLifetimeMinutes * 60 * 1000,
  welcomeRoleName: process.env.WELCOME_ROLE_NAME || 'everyone',
  welcomeChannelId: process.env.WELCOME_CHANNEL_ID || '752955435681841252',
  boostChannelId: process.env.BOOST_CHANNEL_ID || '752955547942387752',
};
