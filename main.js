const Discord = require('discord.js');

const client = new Discord.Client({intents: 32767})

const prefix = '+';

client.once('ready', () => {
    console.log('Navi is online!');
    client.user.setActivities("hacking a mainframe", { type: "PLAYING" })
});

client.on('guildMemberAdd', guildMember =>{
    let welcomeRole = guildMember.guild.roles.cache.find(role => role.name === 'everyone');

    guildMember.roles.add(welcomeRole);
    guildMember.guild.channels.cache.get('752955435681841252').send(`Welcome <@${guildMember.user.id}> to the official FBC Youth server! Please read our <#752955457647149089> and <#752955583749161033>, then introduce yourself in <#752955636043743256>. We pray you're blessed, prepared for edification, and ready to have a fun, Christ-centered fellowship with us! We hope you enjoy your stay.`)
});

client.on('messageCreate', message =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === 'help'){
        message.channel.send("Support's on the Way! https://www.youtube.com/codelyon");
    } else if (command === 'welcome'){
        message.channel.send("Welcome <@753054885179555980> to the official FBC Youth server! Please read our <#752955457647149089> and <#752955583749161033>, then introduce yourself in <#752955636043743256>. We pray you're blessed, prepared for edification, and ready to have a fun, Christ-centered fellowship with us! We hope you enjoy your stay.");
    }

})
require('./server')();
client.login(process.env.TOKEN);
const mySecret = process.env['TOKEN']
