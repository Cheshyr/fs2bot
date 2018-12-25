const { mongo_url } = require('../config.json');
const db = require('monk')(mongo_url);


module.exports = {
    name: 'event',
    description: 'Event Commands',
    execute(message, args) {

        if (!args.length) {
            return message.author.send(`usage: !event list\n       !event register\n       !event results`);
        }

        if (args[0] === 'list') {

            const events = db.get('events');

            events.find({})
            .then((docs) => {
                console.log(docs);
                console.log(docs.length);
                // here's your array
                // make it pretty
                // send to user



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