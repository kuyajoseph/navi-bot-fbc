const express = require('express');
const server = express();
const port = 3000;
server.all('/', (req, res)=>{
    res.send('Systems online!')
})
function keepAlive(){
    server.listen(3000, ()=>{console.log("Systems Online!")});
}
module.exports = keepAlive;
// ================= START BOT CODE ===================
const Discord = require('discord.js');
const client = new Discord.Client({intents: 32767})

client.once('ready', () => {
  console.log('Navi is online!');
});

client.on('messageCreate', message =>{
  if(!message.content.startsWith(prefix) || message.author.bot) return;
  
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if(command === 'help'){
      message.channel.send("Support's on the Way! https://www.youtube.com/codelyon");
  }
});
// You really don't want your token here since your repl's code
// is publically available. We'll take advantage of a Repl.it 
// feature to hide the token we got earlier. 
client.login(process.env.TOKEN);