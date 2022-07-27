const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client({intents: 32767})

const prefix = process.env.PREFIX;

client.once('ready', () => {
    console.log('Systems online!');
    client.user.setActivity(`hacking a mainframe`, {type: 'PLAYING'});
});

client.on('guildMemberAdd', guildMember =>{
    let welcomeRole = guildMember.guild.roles.cache.find(role => role.name === 'everyone');
    guildMember.roles.add(welcomeRole);
    guildMember.guild.channels.cache.get('752955435681841252').send(`Welcome <@${guildMember.user.id}> to the official FBC Youth server! Please read our <#752955457647149089> and <#752955583749161033>, then introduce yourself in <#752955636043743256>. Are you ready to steal the world's treasure and take their hearts? I believe that your life will change, so wake up, get up, and get out there. It's showtime!`)
});

client.on("guildMemberUpdate", (oldMember, newMember) => {
    const oldStatus = oldMember.premiumSince;
    const newStatus = newMember.premiumSince;

    if(!oldStatus && newStatus) {
        client.channels.cache
        .get('752955547942387752')
        .send(`${newMember.user.tag} has boosted the server!`);
    }

    if(oldStatus && !newStatus) {
        client.channels.cache
        .get('752955547942387752')
        .send(`${newMember.user.tag} has unboosted the server!`);
    }
});

client.on('messageCreate', message =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

});

    if (command === 'dm'){
        message.channel.send("Hi")
    };
require('./server')();
client.login(process.env.TOKEN);
