const { mongo_url } = require('../config.json');
const db = require('monk')(mongo_url);


module.exports = {
    name: 'signup',
    description: 'Signup for an Event',
    execute(message, args) {

        const events = db.get('events');
        const players = db.get('players');

        if (!args.length) {

            let z = "";
            z += `usage:\n!signup #\ntID  players  name\n`;
            events.find({ signupActive: true }).each((event, { close, pause, resume }) => {
                // the users are streaming here
                // call `close()` to stop the stream

                z += event.tID + `:     [`;

                z += event.players.length + `]        `;
                z += event.name + `\n`;


            }).then(() => {
                // stream is over
                return message.author.send(z);
            })
        }

        if (args.length === 1) {

            let a = 0;
            try {
                a = parseInt(args[0]);
            }
            catch (err) {
                console.log(err);
                return;
            }

            // check if tID is valid
            
            events.findOne({ tID: a })
            .then((doc) => {
                if (doc === null) {
                    return message.author.send(`event ` + a + ` not found`);
                }
                else {
                    if (doc.signupActive != true) {
                        return message.author.send(`event ` + a + ` signups not active yet`);
                    }
                    else {
                        // check if player has registered their FS2_username
                            
                        players.findOne({ discordID: message.author.id }).then((doc2) => {
                            //console.log(doc2);
                            if (doc2 === null) {
                                return message.author.send(`please register your FS2 username using !register first`);
                            }
                            else {
                                // is payer already signed up?
                                events.findOne({ tID: a }).then((doc3) => {
                                    if (doc3.players.includes(message.author.id)) {
                                        return message.author.send(`you are already signed up for tournament ` + a);
                                    }
                                    else {
                                        events.findOneAndUpdate({ tID: a }, { $addToSet: { players: message.author.id } }).then((updatedDoc) => {
                                            console.log(updatedDoc);
                                            return message.author.send(`registered ` + message.author.username + ` (` + doc2.FS2_username + `) to tournament ` + updatedDoc.tID);
                                        })
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }

            /*
            if (args[1] === 'create') {
                if (args[2] && args[3] && args[4]) {

                    const collection = db.get('events');

                    collection.count({}).then((count) => {
                        //console.log(`tournament count: ` + count);

                        if (count > 0) {
                            collection.aggregate([{ $group: { _id: "tID", tIDmax: { $max: "$tID" } } }])
                                .then((docs) => {
                                    //console.log(docs);
                                    //console.log(`tIDmax: ` + docs[0].tIDmax);

                                    collection.insert({ tID: (docs[0].tIDmax + 1), name: args[2], description: args[3], type: args[4], participants: [] }).then((docs2) => {
                                        console.log(docs2);
                                    })
                                })
                            return message.author.send(`created: ` + args[2]);
                        }
                        else {
                            collection.insert({ tID: 1, name: args[2], description: args[3], type: args[4], participants: [] }).then((docs2) => {
                                console.log(docs2);
                            })
                            return message.author.send(`created: ` + args[2]);
                        }
                    })


                }
            } 
            */
    }
};