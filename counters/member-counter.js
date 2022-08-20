module.exports = async (client) =>{
    const guild = client.guilds.cache.get('752951481937690765');
    setInterval(() =>{
        const memberCount = guild.memberCount;
        const channel = guild.channels.cache.get('1010400348839624704')
        channel.setName(`Total Members: ${memberCount.toLocaleString()}`)
        console.log('Updating Member Count');
    }, 5000);
}

1000 = 1,000