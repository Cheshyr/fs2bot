const { mongo_url } = require('../config.json');
const db = require('monk')(mongo_url);

module.exports = {
    name: 'register',
    description: 'Link FS2 username to Discord ID',
    execute(message, args) {

        if (!args.length) {
            return message.author.send(`usage:\n!register FS2_username`);
        }

        // find username based on unique discord id
        const players = db.get('players');

        //console.log(`message.author.username: ` + message.author.username);
        //console.log(`message.author.id: ` + message.author.id);
        //console.log(`FS2_username: ` + args[0]);

        if (args[0]) {
            
            // is this FS2_username already claimed?
            players.findOne({ FS2_username: args[0] }).then((doc) => {
                //console.log(doc);

                if (doc === null) {
                    // FS2_username does not exist. 
                    players.findOne({ discordID: message.author.id }).then((doc2) => {
                        //console.log(doc2);
                        if (doc2 === null) {
                            //console.log(`message.author.id not found, creating.`);

                            // do an insert
                            players.insert([{ discordID: message.author.id , FS2_username: args[0] }])
                        }
                        else {
                            //console.log(`message.author.id found: ` + message.author.id);

                            // do an update
                            players.findOneAndUpdate({ discordID: message.author.id }, { $set: { FS2_username: args[0] } }).then((updatedDoc) => {
                                //console.log(updatedDoc);
                                return message.author.send(`\nFS2_username: ` + updatedDoc.FS2_username);
                            })
                        }
                    })
                }
                else {
                    console.log(`FS2_username Already Exists: ` + message.author.id);
                    // it exists.  do the pID match?
                    //console.log(doc);
                    //console.log(message.author.id);

                    if (doc.discordID === message.author.id) {
                        //console.log(`This FS2_username already belongs to you.`);
                        return message.author.send(`This FS2_username already belongs to you.`);
                    }
                    else {
                        // exists, doesn't belong to them, error
                        //console.log(`This FS2_username already belongs to someone else.`);
                        return message.author.send(`This FS2_username already belongs to someone else.`);
                    }   
                }
            })
        }
    }
};