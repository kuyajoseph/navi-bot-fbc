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

client.on('messageCreate', message =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'help'){
        message.channel.send("Support's on the Way! https://www.youtube.com/codelyon");
    } else if (command === 'welcome'){
        message.channel.send("Welcome <@576633127900807182> to the official FBC Youth server! Please read our <#752955457647149089> and <#752955583749161033>, then introduce yourself in <#752955636043743256>. Are you ready to steal the world's treasure and take their hearts? I believe that your life will change, so wake up, get up, and get out there. It's showtime!");
    } else if (command === 'dm'){
        message.author.send("Ain't no time like the present, whadaya need?");
    } else if (command === 'users')
        client.users.fetch('560722709529493504').then(user => {
        user.send("Heya Matthew! I was updating the youth server and noticed you haven't reacted to the 'Oakland', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('576633127900807182').then(user => {
        user.send("Heya Sean! I was updating the youth server and noticed you haven't reacted to the 'Vallejo', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('560722709529493504').then(user => {
        user.send("Heya Gio! I was updating the youth server and noticed you haven't reacted to the 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
    })
})
})
})
require('./server')();
client.login(process.env.TOKEN);
