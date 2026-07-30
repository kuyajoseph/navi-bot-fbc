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

client.on('guildMemberUpdate', (oldMember, newMember) => {
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

client.on('messageCreate', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'help'){
        message.channel.send("Support's on the Way! https://www.youtube.com/codelyon , https://sourceb.in/ , https://dashboard.heroku.com/apps , and https://uptimerobot.com/login?rt=https://uptimerobot.com/dashboard#789227729");
    
    } else if (command === 'welcome'){
        message.channel.send("Welcome <@[user id]> to the official FBC Youth server! Please read our <#752955457647149089> and <#752955583749161033>, then introduce yourself in <#752955636043743256>. Are you ready to steal the world's treasure and take their hearts? I believe that your life will change, so wake up, get up, and get out there. It's showtime!");
    
    } else if (command === 'ping'){
        message.author.send("Ain't no time like the present, whadaya need?");
    
    } else if (command === 'boost'){
        message.channel.send("<@389558217035874308> has boosted the server!");
    
    } else if (command === 'boosted'){
        message.channel.send("<@389558217035874308> has boosted the server! FBC Youth has achieved **Level 1!**");
    
    } else if (command === 'dm'){
        client.users.fetch('389558217035874308').then(user => {
        user.send("Heya Joseph! I'm currently doing the weekly updates for the youth server and noticed that you've completed your mission. Great job leader! See ya on the next mission!");
        });
        client.users.fetch('636675814410289190').then(user => {
        user.send("Heya Allissa! This is your daily reminder that you are beautiful, valuable, and good. Joseph loves you and Jesus loves you even more! Take it easy today okay :)");
        });
        // client.users.fetch('[user id]').then(user => {
        // user.send("Heya [Name]! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Matchmaking' and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        // });
    
    } else if (command === 'camp'){
        message.channel.send(`
        <@766139933337059328>
        WAVE 4 – NIGHT GAMES INTRO + LEADERS KIDNAP
        //
        https://youtu.be/5pxS2cp1VlU?si=rMb-TjQv3S2OJz3d
        https://youtu.be/yvDlPXQ7u0E?si=QpECQg68r9zpYslb
        https://youtu.be/S0-G9LBl-Cw?si=TXlVqo7dgab_gCgZ
        https://youtu.be/kWSAruiLGTg?si=rwx954AdHMmcDw2Q
        https://youtu.be/53xb2ViAGSE?si=D5lI6eBZfwrcXbmS
        `);
    }
});

require('./server')();
client.login(process.env.TOKEN);
