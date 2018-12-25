const { mongo_url } = require('../config.json');
const db = require('monk')(mongo_url);

module.exports = {
    name: 'lfg',
    description: 'Looking for Game table',
    execute(message, args) {

        const players = db.get('players');

        async function getProfile(ID) {
            players.findOne({ discordID: ID })
        }

        // find username based on unique discord id
        
        var returnMessage = `\`\`\``;

        if (args.length == 1) {
            // user has specified an argument

            // check if the argument is valid
            if ((args[0] < -1) || (args[0] > 9999)) {
                // error message?

                returnMessage += `usage:\n!lfg` +
                    `\n!lfg <duration in minutes [1 to 9999]>` +

                    `\n\n 0 minutes = no longer looking for a game` +
                    `\n-1 minutes = forever`;

                returnMessage += `\`\`\``;
                return message.author.send(returnMessage);
            }
            else {
                // is this discord ID registered?
                players.findOne({ discordID: message.author.id }).then((doc) => {
                    //console.log(doc);

                    if (doc === null) {
                        // discord id does not exist

                        // return an error message
                        returnMessage += `discordID not registered.  please run:` +
                            `\n!setname <FS2_username>`;

                        returnMessage += `\`\`\``;
                        return message.author.send(returnMessage);

                    }
                    else {
                        // discord ID exists.  is the FS2_username set?
                        if (doc.FS2_username == "none") {

                            // nope
                            // return an error message
                            returnMessage += `FS2_username not set.  please run:` +
                                `\n!setname <FS2_username>`;

                            returnMessage += `\`\`\``;
                            return message.author.send(returnMessage);
                        }
                        else {
                            // they passed valid arguments.  they have a discord ID.  They have set their FS2_username
                            // I guess it's time to add them to the list.

                            // so, how do I want to do this?

                            players.findOneAndUpdate({ discordID: message.author.id }, { $set: { lfg_time: parseInt(args[0]) } }).then((updatedDoc) => {

                                if (args[0] == -1) {
                                    returnMessage += doc.FS2_username + ` is now Looking-for-Game indefinitely.`;
                                }
                                else if (args[0] == 0) {
                                    returnMessage += doc.FS2_username + ` is no longer Looking-for-Game.`;
                                }
                                else {
                                    returnMessage += doc.FS2_username + ` is now Looking-for-Game for ` + args[0] + ` minutes.`;
                                }

                                returnMessage += `\`\`\``;
                                return message.author.send(returnMessage);
                            })



                            // lfg.find({}).then((data) => { });


                            // insert a discord ID and a timeout?

                            // do an insert
                            /*lfg.insert([{
                                discordID: message.author.id,
                                timeout: args[0]
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

                                if (updatedDoc[0].FS2_username == "none") {
                                    returnMessage += `\n!setname to set FS2_username`;
                                }
                                returnMessage += `\n!profile to view your details`;
                                returnMessage += `\n!gameprefs to change game preferences`;
                                returnMessage += `\n!lfg to find players looking for games`;

                                returnMessage += `\`\`\``;
                                return message.author.send(returnMessage);
                                //return message.author.send(newUser);
                            })*/
                        }
                    }
                })

            }
        }
        else {

            players.find({ lfg_time: { $gt: -2 } }).then((data) => {
                console.log(data);
                returnMessage += `usage:\n!lfg` +
                    `\n!lfg <duration in minutes [1 to 9999]>` +

                    `\n\n 0 minutes = no longer looking for a game` +
                    `\n-1 minutes = forever`;

                returnMessage += `\n\nFS2_username              Exterm  Charge  Disput  Secure  Hostag  Bomb    Timed`
                returnMessage += `\n------------              ------  ------  ------  ------  ------  ------  ------\n`

                for (var i = 0; i < data.length; i++) {
                    if (data[i].lfg_time == 0) {
                        continue;
                    }

                    returnMessage += data[i].FS2_username.padEnd(26,' ') + 

                        data[i].pref_Exte.padEnd(8, ' ') +
                        data[i].pref_Char.padEnd(8, ' ') +
                        data[i].pref_Disp.padEnd(8, ' ') +
                        data[i].pref_Secu.padEnd(8, ' ') +
                        data[i].pref_Host.padEnd(8, ' ') +
                        data[i].pref_Bomb.padEnd(8, ' ') +
                        data[i].pref_timed + `\n`;
                        //data[i].pref_timed.padEnd(8, ' ') +
                        //data[i].lfg_time + `\n`;
                }

                returnMessage += `\`\`\``;

                return message.author.send(returnMessage);


            })



            





                    
            


        } 
    }
}