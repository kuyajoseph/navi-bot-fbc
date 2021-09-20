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
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong!');
  }
});
// You really don't want your token here since your repl's code
// is publically available. We'll take advantage of a Repl.it 
// feature to hide the token we got earlier. 
client.login(process.env.TOKEN);