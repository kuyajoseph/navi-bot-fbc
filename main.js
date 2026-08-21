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
    if (welcomeRole) {
        guildMember.roles.add(welcomeRole).catch(console.error);
    } else {
        console.error("Welcome role not found!");
    }

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
        user.send("Heya Allissa! Joseph wanted me to let you know that he's praying for you so much for your 1-on-1 meeting soon. J loves you so much :)");
        });
    
    //    client.users.fetch('636675814410289190').then(user => {
    //    user.send("Heya Allissa! This is your daily reminder that you are beautiful, valuable, and good. Joseph loves you and Jesus loves you even more! Take it easy today okay Aya :)");
    //    });
    
    // } else if (command === 'dm'){
    // const me = '389558217035874308';           // your ID
    // const target = '636675814410289190';       // other user ID
    // const messageText = "For you to have serene, blissful, and sweet dreams tonight: https://open.spotify.com/playlist/5BhU4lwIx1BTalGXqNdGYO?si=Wfk4xzUTQ5-NQpI2vVSLDQ&utm_source=copy-link&pt=a3590ffce342750e096afcc1e421c874&pi=cMKxSsgQTFuMr&sci=spotify%3Acard-config%3A4eh6hfh0tdShyK08GI6TBM";

    // Send DM to yourself
    // client.users.fetch(me).then(user => {
    //    user.send(messageText);
    // });

    // Send DM to the other user + confirmation
    // client.users.fetch(target)
    //    .then(user => user.send(messageText))
    //    .then(() => {
    //    console.log("DM successfully sent.");
    //    return client.users.fetch(me);
    //})
    //.then(meUser => {
    //    meUser.send("The DM was successfully sent.");
    //})
    //.catch(err => {
    //    console.error("Failed to send DM:", err);
    //    client.users.fetch(me).then(meUser => {
    //        meUser.send("The DM failed to send. Check logs.");
    //    });
    //});

        
        // client.users.fetch('389558217035874308').then(user => {
        // user.send("For you to have serene, blissful, and sweet dreams tonight: https://open.spotify.com/playlist/5BhU4lwIx1BTalGXqNdGYO?si=Wfk4xzUTQ5-NQpI2vVSLDQ&utm_source=copy-link&pt=a3590ffce342750e096afcc1e421c874&pi=cMKxSsgQTFuMr&sci=spotify%3Acard-config%3A4eh6hfh0tdShyK08GI6TBM");
        // });
        // client.users.fetch('636675814410289190')
        // .then(user => {
        //     return user.send("For you to have serene, blissful, and sweet dreams tonight: https://open.spotify.com/playlist/5BhU4lwIx1BTalGXqNdGYO?si=Wfk4xzUTQ5-NQpI2vVSLDQ&utm_source=copy-link&pt=a3590ffce342750e096afcc1e421c874&pi=cMKxSsgQTFuMr&sci=spotify%3Acard-config%3A4eh6hfh0tdShyK08GI6TBM");
        // })
        // .then(() => {
        //     console.log("DM successfully sent.");
        //     client.users.fetch('389558217035874308').then(me => {
        //         me.send("The DM was successfully sent.");
        //     });
        // })
        // .catch(err => {
        //     console.error("Failed to send DM:", err);
        //     client.users.fetch('389558217035874308').then(me => {
        //         me.send("The DM failed to send. Check logs.");
        //     });
        // });
        

        // client.users.fetch('[user id]').then(user => {
        // user.send("Heya [Name]! I'm currently doing the weekly updates for the youth server and noticed you haven't reacted to the 'Matchmaking' and 'Metagame' roles, meaning you don't have access to the entire server. I don't want you to miss out some stuff, so in order to change that, please head on over and read the info in the 'rules' and 'flairing' channels, then self-assign yourself by reacting to the roles you're missing. (consider it a free buff!) See ya on the next mission!");
        // });
    
    } else if (command === 'camp'){
        message.channel.send(`<@[channel id]>`);
    }

    client.users.fetch('1234567890').then(user => {
    user.send("")
    })

});

require('./server')();
client.login(process.env.TOKEN);