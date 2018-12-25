const { mongo_url } = require('../config.json');
const db = require('monk')(mongo_url);
const Bracket = require('../bracket.js');
var crypto = require("crypto");


module.exports = {
    name: '#',
    description: 'Administration Commands',
    execute(message, args) {

        //message.author.send(`args.length: ` + args.length);
        //message.author.send(`args: ` + args);

        if (!args.length) {
            //return message.author.send(`usage: !admin event create name desc type\n       !admin event delete tID\n       !admin event delete all confirm`);
            return message.author.send(`usage:\n!# players delete\n!# events\n!# events create\n!# events setname tID name\n!# events open tID\n!# events close tID\n!# events delete tID\n!# events delete all`);
        }

        if (args[0] === 'players') {
            if (args[1] === 'delete') {

                const players = db.get('players');
                players.remove({}).then((result) => {
                    console.log(`deleted all players`);
                    return message.author.send(`deleted all players`);
                })

            }
        }

        if (args[0] === 'lfg') {
            if (args[1] === 'delete') {

                const lfg = db.get('lfg');
                lfg.remove({}).then((result) => {
                    console.log(`deleted all lfg`);
                    return message.author.send(`deleted all lfg`);
                })

            }
        }

        if (args[0] === 'events') {
            const events = db.get('events');

            if (!args[1]) {

                let z = "";
                z += `tID  state  players  name\n`;
                events.find({}).each((event, { close, pause, resume }) => {
                    // the users are streaming here
                    // call `close()` to stop the stream
                    

                    z += event.tID + `:     `;

                    if (event.signupActive == true) {
                        z += `open     [`;
                    }
                    else {
                        z += `clsd     [`;
                    }

                    z += event.players.length + `]        `;
                    z += event.name + `\n`;

                }).then(() => {
                    // stream is over
                    return message.author.send(z);
                })
            }

            if (args[1] === 'delete') {
                if (args[2]) {
                    if (args[2] === 'all') {
                        events.remove({})
                            .then((result) => {
                                console.log(`deleted all events`);
                                return message.author.send(`deleted all events`);
                            })
                    }
                    else {
                        let a = 0;
                        try {
                            a = parseInt(args[2]);
                        }
                        catch (err) {
                            console.log(err);
                            return;
                        }

                        events.count({}).then((count) => {
                            if (a <= count) {
                                events.remove({ tID: a }).then((result) => {
                                    console.log(`deleted event: ` + a);
                                    return message.author.send(`deleted event: ` + a);
                                })
                            }
                        })
                    }
                }
            }

            if (args[1] === 'create') {

                events.count({})
                .then((count) => {
                    if (count > 0) {
                        events.aggregate([{ $group: { _id: "tID", tIDmax: { $max: "$tID" } } }])
                        .then((docs) => {
  
                            events.insert({ tID: (docs[0].tIDmax + 1), signupActive: false, players:[] })
                            .then((docs2) => {
                                console.log(docs2);
                                return message.author.send(`created: ` + docs2.tID);
                            })
                        })
                    }
                    else {
                        events.insert({ tID: 1, signupActive: false, players: [] })
                        .then((docs2) => {
                            console.log(docs2);
                            return message.author.send(`created: ` + docs2.tID);
                        })
                    }
                })
            }

            if (args[1] === 'setname') {
                // find tournament ID
                if (args.length === 4) {

                    let a = 0;
                    try {
                        a = parseInt(args[2]);
                    }
                    catch (err) {
                        console.log(err);
                        return;
                    }

                    events.findOne({ tID: a })
                    .then((doc) => {
                        if (doc === null) {
                            return message.author.send(`event ` + a + ` not found`);
                        }
                        else {
                            events.findOneAndUpdate({ tID: a}, { $set: { name: args[3] } }).then((updatedDoc) => {
                                console.log(updatedDoc);
                                return message.author.send(`\event ` + a + ` renamed: ` + updatedDoc.name);
                            })
                        }
                    })
                }
            }

            if (args[1] === 'info') {
                // find tournament ID
                if (args.length === 3) {

                    let a = 0;
                    try {
                        a = parseInt(args[2]);
                    }
                    catch (err) {
                        console.log(err);
                        return;
                    }

                    events.findOne({ tID: a })
                    .then((doc) => {
                        if (doc === null) {
                            return message.author.send(`event ` + a + ` not found`);
                        }
                        else {
                            console.log(doc);
                            return message.author.send(doc.players);
                        }
                    })
                }
            }

            if (args[1] === 'open') {
                // find tournament ID
                if (args.length === 3) {

                    let a = 0;
                    try {
                        a = parseInt(args[2]);
                    }
                    catch (err) {
                        console.log(err);
                        return;
                    }

                    events.findOne({ tID: a })
                    .then((doc) => {
                        if (doc === null) {
                            return message.author.send(`event ` + a + ` not found`);
                        }
                        else {
                            events.findOneAndUpdate({ tID: a }, { $set: { signupActive: true } }).then((updatedDoc) => {
                                console.log(updatedDoc);
                                return message.author.send(`\event ` + a + ` opened: ` + updatedDoc.name);
                            })
                        }
                    })
                }
            }

            if (args[1] === 'close') {
                // find tournament ID
                if (args.length === 3) {

                    let a = 0;
                    try {
                        a = parseInt(args[2]);
                    }
                    catch (err) {
                        console.log(err);
                        return;
                    }

                    events.findOne({ tID: a })
                    .then((doc) => {
                        if (doc === null) {
                            return message.author.send(`event ` + a + ` not found`);
                        }
                        else {
                            events.findOneAndUpdate({ tID: a }, { $set: { signupActive: false } }).then((updatedDoc) => {
                                console.log(updatedDoc);
                                return message.author.send(`\event ` + a + ` closed: ` + updatedDoc.name);
                            })
                        }
                    })
                }
            }

            if (args[1] === 'fake') {
                // find tournament ID
                if (args.length === 4) {

                    let a = 0;
                    try {
                        a = parseInt(args[2]);
                    }
                    catch (err) {
                        console.log(err);
                        return;
                    }

                    for (var i = 0; i < parseInt(args[3]); i++) {

                        var j = Math.floor(Math.random() * 1000000000).toString();
                        console.log(j);
                        events.findOneAndUpdate({ tID: a }, { $addToSet: { players: j } })  
                        .then((updatedDoc) => {
                            console.log(updatedDoc);
                        });
                    }
                }
            }


            if (args[1] === 'start') {
                // find tournament ID
                if (args.length === 3) {

                    let a = 0;
                    try {
                        a = parseInt(args[2]);
                    }
                    catch (err) {
                        console.log(err);
                        return;
                    }

                    events.findOne({ tID: a })
                    .then((doc) => {
                        if (doc === null) {
                            return message.author.send(`event ` + a + ` not found`);
                        }
                        else {
                            // generate brackets
                            var playerCount = doc.players.length;

                            // tourney type?

                            if (playerCount < 2) {
                                return message.author.send(`event ` + a + ` does not have enough players`);
                            }
                            else {
                                var newBracket = new Bracket(doc.players);
                                /*for (var i = 0; i < newBracket.tierCount; i++) {
                                    for (var j = 0; j < newBracket.bracket[i].length; j++) {
                                        console.log(newBracket.bracket[i][j]);
                                    }
                                }*/

                                //console.log(newBracket);
                            }
                           

                            /*events.findOneAndUpdate({ tID: a }, { $set: { signupActive: true } }).then((updatedDoc) => {
                                console.log(updatedDoc);
                                return message.author.send(`\event ` + a + ` opened: ` + updatedDoc.name);
                            })*/
                        }
                    })
                }
            }
        }
    }
};