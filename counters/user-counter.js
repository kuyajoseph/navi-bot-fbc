module.exports = async (client) =>{
    const guild = client.guilds.cache.get('752951481937690765');
    setInterval(() =>{
        const userCount = guild.userCount;
        const channel = guild.channels.cache.get('11010411364973551617')
        channel.setName(`User Count: ${userCount.toLocaleString()}`)
        console.log('Updating User Count');
    }, 5000);
}