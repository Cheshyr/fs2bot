const { mongo_url } = require('../config.json');
const db = require('monk')(mongo_url);

module.exports = {
    name: 'setname',
    description: 'Link FS2 username to Discord ID',
    execute(message, args) {

        if (!args.length) {
            return message.author.send(`usage: !setname FS2_username`);
        }

        // find username based on unique discord id
        const players = db.get('players');
        var returnMessage = "";

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

                            players.insert([{
                                discordID: message.author.id,
                                FS2_username: args[0],
                                pref_Exte: "any",
                                pref_Char: "any",
                                pref_Disp: "any",
                                pref_Secu: "any",
                                pref_Host: "any",
                                pref_Bomb: "any",
                                pref_timed: "ok",
                                lfg_time: -2
                            }]).then((updatedDoc) => {
                                console.log(updatedDoc);
                                returnMessage = `\`\`\`\nDiscord Name:  ` + message.author.username +
                                    `\nFS2_username:  ` + updatedDoc[0].FS2_username +
                                    `\n\nGame Preferences:` +
                                    `\nExtermination: ` + updatedDoc[0].pref_Exte +
                                    `\nCharge:        ` + updatedDoc[0].pref_Char +
                                    `\nDisputed:      ` + updatedDoc[0].pref_Disp +
                                    `\nSecure:        ` + updatedDoc[0].pref_Secu +
                                    `\nHostage:       ` + updatedDoc[0].pref_Host +
                                    `\nBomb Defusal:  ` + updatedDoc[0].pref_Bomb +
                                    `\nTimed Turns:   ` + updatedDoc[0].pref_timed + `\n`;

                                //if (updatedDoc[0].FS2_username == "none") {
                                    returnMessage += `\n!setname to set FS2_username`;
                                //}
                                returnMessage += `\n!profile to view your details`;
                                returnMessage += `\n!gameprefs to change game preferences`;
                                returnMessage += `\n!lfg to find players looking for games`;

                                returnMessage += `\`\`\``;
                                return message.author.send(returnMessage);
                                //return message.author.send(newUser);
                            })


                            // do an insert
                            //players.insert([{ discordID: message.author.id , FS2_username: args[0] }])
                        }
                        else {
                            //console.log(`message.author.id found: ` + message.author.id);

                            // do an update
                            players.findOneAndUpdate({ discordID: message.author.id }, { $set: { FS2_username: args[0] } }).then((updatedDoc) => {
                                //console.log(updatedDoc);
                                //return message.author.send(`\nFS2_username: ` + updatedDoc.FS2_username);
                                console.log(updatedDoc);
                                returnMessage = `\`\`\`\nDiscord Name:  ` + message.author.username +
                                    `\nFS2_username:  ` + updatedDoc.FS2_username +
                                    `\n\nGame Preferences:` +
                                    `\nExtermination: ` + updatedDoc.pref_Exte +
                                    `\nCharge:        ` + updatedDoc.pref_Char +
                                    `\nDisputed:      ` + updatedDoc.pref_Disp +
                                    `\nSecure:        ` + updatedDoc.pref_Secu +
                                    `\nHostage:       ` + updatedDoc.pref_Host +
                                    `\nBomb Defusal:  ` + updatedDoc.pref_Bomb +
                                    `\nTimed Turns:   ` + updatedDoc.pref_timed + `\n`;

                               // if (updatedDoc.FS2_username == "none") {
                                    returnMessage += `\n!setname to set FS2_username`;
                                //}
                                returnMessage += `\n!profile to view your details`;
                                returnMessage += `\n!gameprefs to change game preferences`;
                                returnMessage += `\n!lfg to find players looking for games`;

                                returnMessage += `\`\`\``;
                                return message.author.send(returnMessage);
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