const { mongo_url } = require('../config.json');
const db = require('monk')(mongo_url);

module.exports = {
    name: 'help',
    description: 'Discord ID details',
    execute(message, args) {

        const players = db.get('players');
        var returnMessage = "";

        //return message.author.send(`usage:\n!profile FS2_username`);
        //return message.author.send(`usage:\n!profile`);

        players.findOne({ discordID: message.author.id }).then((doc) => {
            //console.log(doc);

            if (doc === null) {
                // discord id does not exist

                // create dummy data spots:
                //  - discordID
                //  - FS2_username [none]
                //  - pref_Exte (no/dark/light/any) [any]
                //  - pref_Char (no/dark/light/any) [any]
                //  - pref_Disp (no/dark/light/any) [any]
                //  - pref_Secu (no/dark/light/any) [any]
                //  - pref_Host (no/dark/light/any) [any]
                //  - pref_Bomb (no/dark/light/any) [any]
                //  - pref_timed (no/ok/only) [ok]

                // do an insert
                players.insert([{
                    discordID: message.author.id,
                    FS2_username: "none",
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

                    returnMessage += `\n!setname to set FS2_username`;
                    returnMessage += `\n!profile to view your details`;
                    returnMessage += `\n!gameprefs to change game preferences`;
                    returnMessage += `\n!lfg to find players looking for games`;

                    returnMessage += `\`\`\``;
                    return message.author.send(returnMessage);
                    //return message.author.send(newUser);
                })

                // FS2_username does not exist. 
                /*players.findOne({ discordID: message.author.id }).then((doc2) => {
                    //console.log(doc2);
                    if (doc2 === null) {
                        //console.log(`message.author.id not found, creating.`);

                        // do an insert
                        players.insert([{ discordID: message.author.id, FS2_username: args[0] }])
                    }
                    else {
                        //console.log(`message.author.id found: ` + message.author.id);

                        // do an update
                        players.findOneAndUpdate({ discordID: message.author.id }, { $set: { FS2_username: args[0] } }).then((updatedDoc) => {
                            //console.log(updatedDoc);
                            return message.author.send(`\nFS2_username: ` + updatedDoc.FS2_username);
                        })
                    }
                })*/


            }

            else {

                // discord id has been registered

                //return message.author.send(doc);
                console.log(doc);

                returnMessage = `\`\`\`\nDiscord Name:  ` + message.author.username +
                    `\nFS2_username:  ` + doc.FS2_username +
                    `\n\nGame Preferences:` +
                    `\nExtermination: ` + doc.pref_Exte +
                    `\nCharge:        ` + doc.pref_Char +
                    `\nDisputed:      ` + doc.pref_Disp +
                    `\nSecure:        ` + doc.pref_Secu +
                    `\nHostage:       ` + doc.pref_Host +
                    `\nBomb Defusal:  ` + doc.pref_Bomb +
                    `\nTimed Turns:   ` + doc.pref_timed + `\n`;

                returnMessage += `\n!setname to set FS2_username`;
                returnMessage += `\n!profile to view your details`;
                returnMessage += `\n!gameprefs to change game preferences`;
                returnMessage += `\n!lfg to find players looking for games`;

                returnMessage += `\`\`\``;
                return message.author.send(returnMessage);

                // so now we can dsicuss setting an fs2_username


                /*console.log(`FS2_username Already Exists: ` + message.author.id);
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
                }*/
            }
        })

    }
};