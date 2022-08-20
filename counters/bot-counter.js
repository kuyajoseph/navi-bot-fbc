module.exports = async (client) =>{
    const guild = client.guilds.cache.get('752951481937690765');
    setInterval(() =>{
        const botCount = guild.botCount;
        const channel = guild.channels.cache.get('1010412550015418429')
        channel.setName(`Bot Count: ${botCount.toLocaleString()}`)
        console.log('Updating Bot Count');
    }, 5000);
}