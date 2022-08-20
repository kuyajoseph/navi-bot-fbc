module.exports = async (client) =>{
    const guild = client.guilds.cache.get('752951481937690765');
    setInterval(() =>{
        const roleCount = guild.roleCount;
        const channel = guild.channels.cache.get('1010412623084396546')
        channel.setName(`Role Count: ${memberRole.toLocaleString()}`)
        console.log('Updating Role Count');
    }, 5000);
}