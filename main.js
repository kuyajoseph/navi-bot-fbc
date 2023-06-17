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
        message.channel.send("Welcome <@829028828965634078> to the official FBC Youth server! Please read our <#752955457647149089> and <#752955583749161033>, then introduce yourself in <#752955636043743256>. Are you ready to steal the world's treasure and take their hearts? I believe that your life will change, so wake up, get up, and get out there. It's showtime!");
    } else if (command === 'dm'){
        message.author.send("Ain't no time like the present, whadaya need?");
    } else if (command === 'boost'){
        message.channel.send("<@389558217035874308> has boosted the server!");
    } else if (command === 'boosted'){
        message.channel.send("<@389558217035874308> has boosted the server! FBC Youth has achieved **Level 1!**");
    } else if (command === 'users')
        client.users.fetch('389558217035874308').then(user => {
        user.send("Heya Joseph! I'm currently doing the weekly updates for the youth server and noticed that you've completed your mission. Great job leader! See ya on the next mission!");
        client.users.fetch('159891741749542912').then(user => {
        user.send("Heya Judges! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Matchmaking' and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('194313702319718400').then(user => {
        user.send("Heya Renz! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Matchmaking' and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('569292352909344778').then(user => {
        user.send("Heya Jed! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('365993064294252555').then(user => {
        user.send("Heya Daniel! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('721061481843523635').then(user => {
        user.send("Heya Daniel! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('219166875962048513').then(user => {
        user.send("Heya Tammy! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Vallejo', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('364934686595874817').then(user => {
        user.send("Heya Noah! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Vallejo', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('437115064265343000').then(user => {
        user.send("Heya Elijah! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('581679951099723801').then(user => {
        user.send("Heya Alyza! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Matchmaking' and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('698267376399024168').then(user => {
        user.send("Heya Ashley! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Vallejo', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('254889264393879552').then(user => {
        user.send("Heya Ben! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Visitor', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('752766831986737263').then(user => {
        user.send("Heya Ben! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Oakland', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('429056649454682113').then(user => {
        user.send("Heya Aris! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Matchmaking' and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('689679540183629857').then(user => {
        user.send("Heya Arden! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'San Francisco', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('455113092452450304').then(user => {
        user.send("Heya Devon! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('217133608261910528').then(user => {
        user.send("Heya Dante! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('754170214777618562').then(user => {
        user.send("Heya Isaiah! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Tri-City', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('607681832028471306').then(user => {
        user.send("Heya Jadrian! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('710012819168297003').then(user => {
        user.send("Heya Janessa! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('437790888803172372').then(user => {
        user.send("Heya Juju! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Tri-City', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('216786154211639316').then(user => {
        user.send("Heya Patrick! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Visitor', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('619264112870031391').then(user => {
        user.send("Heya Leanne! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'San Francisco', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('822904403664044103').then(user => {
        user.send("Heya Liam! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Visitor', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('213172303876456449').then(user => {
        user.send("Heya Joseph! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'San Francisco', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('341032873433759756').then(user => {
        user.send("Heya Jeremy! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'San Francisco', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('560722709529493504').then(user => {
        user.send("Heya Matthew! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Oakland', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('114115642176700418').then(user => {
        user.send("Heya Gio! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('576633127900807182').then(user => {
        user.send("Heya Sean! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Vallejo', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('441379280102883329').then(user => {
        user.send("Heya Marc! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'San Francisco', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('145026384740220928').then(user => {
        user.send("Heya Luis! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'San Francisco', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('292044341231353856').then(user => {
        user.send("Heya LJ! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Vallejo', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('586372063409733636').then(user => {
        user.send("Heya Jonathan! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Metagame' role, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('994090349620363397').then(user => {
        user.send("Heya Pontius! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'San Francisco', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('886684493606436874').then(user => {
        user.send("Heya Faith! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Vallejo', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('806418130523783178').then(user => {
        user.send("Heya Gino! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('764656260314300427').then(user => {
        user.send("Heya Alaina! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Visitor', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('297569558309634048').then(user => {
        user.send("Heya Miguel! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Vallejo', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('379018505149874186').then(user => {
        user.send("Heya Bodek! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'San Francisco', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        client.users.fetch('1000977103942078565').then(user => {
        user.send("Heya Jaylen! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Visitor', 'Community Events', 'Matchmaking', and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        });
    });
    });
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});
require('./server')();
client.login(process.env.TOKEN);
