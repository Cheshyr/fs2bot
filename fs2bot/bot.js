var Discord = require('discord.io');
var auth = require('./auth.json');

// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on('ready', function (evt) {
    console.log('Connected');
    console.log('Logged in as: ' + bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        console.log('received: ' + user + ' ' + userID + ' ' + cmd + ' ' + args);
        args = args.splice(1);
        switch (cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'hello ' + user
                });
                break;

            case 'register':
                // do things
                bot.sendMessage({
                    to: channelID,
                    message: 'registered ' + user + ' to tourney: '  + args
                });

                break;
            // Just add any case commands if you want to..
        }
    }
});