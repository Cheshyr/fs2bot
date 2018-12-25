const { mongo_url } = require('../config.json');
const db = require('monk')(mongo_url);

module.exports = {
    name: 'deletename',
    description: 'Remove FS2 username from Discord ID',
    execute(message, args) {

        if (!args.length) {
            return message.author.send(`usage: !deletename confirm`);
        }

        // find username based on unique discord id
        const players = db.get('players');

        console.log(`message.author.username: ` + message.author.username);
        console.log(`message.author.id: ` + message.author.id);
        console.log(`FS2_username: ` + args[0]);

        if (args[0] === `confirm`) {

            // do an update
            players.findOneAndUpdate({ discordID: message.author.id }, { $set: { FS2_username: null } }).then((updatedDoc) => {
                console.log(updatedDoc);
                console.log(`deleted FS2_username`);
                return message.author.send(`deleted FS2_username`);
            })
            
        }
    }
};