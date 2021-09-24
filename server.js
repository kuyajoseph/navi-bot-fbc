const express = require('express');
const server = express();
const port = 3000;
server.all('/', (req, res)=>{
    res.send('Here come the buffs!')
})
function keepAlive(){
    server.listen(3000, ()=>{console.log("Here come the buffs!")});
}
module.exports = keepAlive;
// ================= START BOT CODE ===================
const Discord = require('discord.js');
const client = new Discord.Client({intents: 32767})

const prefix = process.env.PREFIX;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message =>{
  if(!message.content.startsWith(prefix) || message.author.client) return;
  
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if(command === 'help'){
    message.channel.send("Support's on the Way! https://www.youtube.com/codelyon");
} else if (command === 'welcome'){
    message.channel.send("Welcome <@753054885179555980> to the official FBC Youth server! Please read our <#752955457647149089> and <#752955583749161033>, then introduce yourself in <#752955636043743256>. We pray you're blessed, prepared for edification, and ready to have a fun, Christ-centered fellowship with us! We hope you enjoy your stay.");
} else if (command === 'pm'){
    message.author.send("Ain't no time like the present, whadaya need?");
} else if (command === 'users')
    client.users.fetch('389558217035874308').then(user => {
    user.send("Hello World!");
})
})

// You really don't want your token here since your repl's code
// is publically available. We'll take advantage of a Repl.it 
// feature to hide the token we got earlier. 
client.login(process.env.TOKEN);