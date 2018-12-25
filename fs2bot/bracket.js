//console.log("Bracket Sim");

const data_2 = ["player1", "player2"];
const data_3 = ["player1", "player2", "player3"];
const data_4 = ["player1", "player2", "player3", "player4"];
const data_5 = ["player1", "player2", "player3", "player4", "player5"];
const data_6 = ["player1", "player2", "player3", "player4", "player5", "player6"];
const data_7 = ["player1", "player2", "player3", "player4", "player5", "player6", "player7"];
const data_8 = ["player1", "player2", "player3", "player4", "player5", "player6", "player7", "player8"];


class Player {

    constructor(name, id, seed) {
        this.FS2_username = name;
        this.discordID = id;
        this.seed = seed;
    }

}

// Node class 
class Node {

    constructor(data, left, right) {
        this.matchID = data;
        this.winner = null;
        this.left = left;
        this.right = right;
    }

    setWinner(user)
    {
        this.winner = user;
    }
} 

class Bracket {
    constructor(data) {

        //console.log(data);
        this.playerlist = data;
        this.players = [];
        this.matchList = [];

        for (var i = 0; i < this.playerlist.length; i++) {
            this.players.push(new Player(this.playerlist[i], null, i));
        }

        this.tierCount = Math.ceil(Math.log2(this.players.length));
        this.bracket = [];

        for (var i = 0; i < this.tierCount; i++) {
            this.bracket[i] = [];
        }
        //console.log(this.bracket);

        switch (this.players.length) {
            case 2:
                this.bracket[0].push(new Node(`none`, this.players.shift(), this.players.shift()));
                break;

            case 3:
                this.bracket[0].push(new Node(`none`, this.players.shift(), this.players.shift()));
                this.bracket[1].push(new Node(`none`, this.bracket[0][0], this.players.shift()));
                break;

            case 4:
                this.bracket[0].push(new Node(`none`, this.players.shift(), this.players.shift()));
                this.bracket[0].push(new Node(`none`, this.players.shift(), this.players.shift()));
                this.bracket[1].push(new Node(`none`, this.bracket[0][0], this.bracket[0][1]));
                break;

            case 5:
                this.bracket[0].push(new Node(`none`, this.players.shift(), this.players.shift()));
                this.bracket[1].push(new Node(`none`, this.bracket[0][0], this.players.shift()));
                this.bracket[1].push(new Node(`none`, this.players.shift(), this.players.shift()));
                this.bracket[2].push(new Node(`none`, this.bracket[1][0], this.bracket[1][1]));
                break;

            case 6:
                this.bracket[0].push(new Node(`none`, this.players.shift(), this.players.shift()));
                this.bracket[0].push(new Node(`none`, this.players.shift(), this.players.shift()));
                this.bracket[1].push(new Node(`none`, this.bracket[0][0], this.players.shift()));
                this.bracket[1].push(new Node(`none`, this.bracket[0][1], this.players.shift()));
                this.bracket[2].push(new Node(`none`, this.bracket[1][0], this.bracket[1][1]));
                break;

            case 7:
                this.bracket[0].push(new Node(`none`, this.players.shift(), this.players.shift()));
                this.bracket[0].push(new Node(`none`, this.players.shift(), this.players.shift()));
                this.bracket[0].push(new Node(`none`, this.players.shift(), this.players.shift()));
                this.bracket[1].push(new Node(`none`, this.bracket[0][0], this.bracket[0][1]));
                this.bracket[1].push(new Node(`none`, this.bracket[0][2], this.players.shift()));
                this.bracket[2].push(new Node(`none`, this.bracket[1][0], this.bracket[1][1]));
                break;

            case 8:
                this.bracket[0].push(new Node(`none`, this.players.shift(), this.players.shift()));
                this.bracket[0].push(new Node(`none`, this.players.shift(), this.players.shift()));
                this.bracket[0].push(new Node(`none`, this.players.shift(), this.players.shift()));
                this.bracket[0].push(new Node(`none`, this.players.shift(), this.players.shift()));
                this.bracket[1].push(new Node(`none`, this.bracket[0][0], this.bracket[0][1]));
                this.bracket[1].push(new Node(`none`, this.bracket[0][2], this.bracket[0][3]));
                this.bracket[2].push(new Node(`none`, this.bracket[1][0], this.bracket[1][1]));
                break;
        }

        for (var i = 0; i < this.tierCount; i++) {
            for (var j = 0; j < this.bracket[i].length; j++) {
                this.matchList.push(this.bracket[i][j]);
            }
        }

        console.log(this.matchList);
    }
}

/*new Bracket(data_2);
new Bracket(data_3);
new Bracket(data_4);
new Bracket(data_5);
new Bracket(data_6);
new Bracket(data_7);
new Bracket(data_8);*/

module.exports = Player;
module.exports = Node;
module.exports = Bracket;