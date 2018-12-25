module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(message, db, args) {
        message.author.send('Pong.');
    },
};