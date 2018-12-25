//const Bracket = require('./bracket.js');

const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

//const MongoClient = require('mongodb').MongoClient;
//const assert = require('assert');

//const url = 'mongodb://localhost:27017';

//const dbName = 'fs2bot';
//const dbName = 'test';
/*
function getUserFromMention(mention) {
    const matches = mention.match(/^<@!?(\d+)>$/);
    // The id is the first and only match found by the RegEx.
    // However the first element in the matches array will be the entire mention, not just the ID,
    // so use index 1.
    const id = matches[1];

    return client.users.get(id);
}
*/
//http://mongodb.github.io/node-mongodb-native/3.1/quick-start/quick-start/ 

const { mongo_url } = require('./config.json');
const db = require('monk')(mongo_url);
const players = db.get('players');

function decrementLFG() {
    console.log(`decrementLFG`);
    players.update({ lfg_time: { $gt: 0 } }, { $inc: { lfg_time: -1 } })
}

setInterval(decrementLFG, 60000);

client.on('ready', () => {
    console.log('Ready!');

   /* var m = new Date();
    var dateString =
        m.getUTCFullYear() + "/" +
        ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" +
        ("0" + m.getUTCDate()).slice(-2) + " " +
        ("0" + m.getUTCHours()).slice(-2) + ":" +
        ("0" + m.getUTCMinutes()).slice(-2) + ":" +
        ("0" + m.getUTCSeconds()).slice(-2);*/

    const channel = client.channels.find(ch => ch.name === 'shape-terminal');
    //if (!channel) return;
    //console.log(`talking in channel:` + channel + `\n`);
    
    // Send the message, mentioning the member
   // channel.send(`FS2bot Online: ` + dateString);

    //client.channels.get('#shape-terminal').send('FS2Bot Online');
    //message.channel.send('FS2Bot Online');


});

client.on('message', message => {
    //console.log(message.content);

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        //client.commands.get(command).execute(message, args);
        command.execute(message, args);
    }
    catch (error) {
        console.error(error);
    }
});

client.login(token);