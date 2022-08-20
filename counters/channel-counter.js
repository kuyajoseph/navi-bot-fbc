module.exports = async (client) =>{
    const guild = client.guilds.cache.get('752951481937690765');
    setInterval(() =>{
        const channelCount = guild.channelCount;
        const channel = guild.channels.cache.get('1010412675316068453')
        channel.setName(`Channel Count: ${channelCount.toLocaleString()}`)
        console.log('Updating Channel Count');
    }, 5000);
}