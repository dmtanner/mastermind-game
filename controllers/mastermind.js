var users = require('./users_controller');

//var mongoose = require('mongoose');
//var ArchivedGame = mongoose.model('Game');
//var PlayerStats = mongoose.model('Stats');

var currentGames = {};
var nextGameID = 1;

// ROYGBV + White + Black
const colors = "ROYGBVWK".split('');

function check(code, guess) {
    if (code.length !== guess.length) {
        return null;
        //throw Error("The guess is not the same length as the code.");
    }

    var result = {right_color: 0, right_place: 0};

    for (var i=0; i<code.length; i++) {
        if (code[i] === guess[i]) {
            result.right_place ++;
        }
    }

    // Iterate through possible colors, count them in both the code and the guess
    // And then return the smaller amount.
    // This checks for multiplicities and color matches.
    colors.forEach(function (color, i, arr) {
        result.right_color += Math.min(
            code.split(color).length - 1,
            guess.split(color).length - 1
        );
    });

    return result;
}

function generateCode(len) {
    var code = '';
    for (var i=0; i<len; i++) {
        var color = Math.floor(Math.random() * colors.length);
        code += colors[color];
    }
    return code;
}

// for (var i=0; i<10; i++) console.log(generateCode(4));

/*  Constructor to initialize a new game
 *  host is the player who entered the code
 *  guest is the player who is guessing
 *  code is the code itself
 * */
function Game(host, guest, code, max_guesses) {

    if (max_guesses == undefined) max_guesses = 15;
    // These are stubs for user information (communicate with DB here)
    this.host  = host;
    this.guest = guest;

    // Information about the game itself
    this.code  = code.toUpperCase();
    this.gameID = nextGameID ++;
    this.guesses = []; // initialize an empty list of guesses
    this.max_guesses = max_guesses;

    console.log(this.code);
}

// TODO: winning/losing
Game.prototype = {
    // make a guess and return an object containing the appropriate info.
    makeGuess: function makeGuess(guess) {
        guess = guess.toUpperCase();
        for (var i=0; i<guess.length; ++i) {
            if (colors.indexOf(guess[i]) === -1) {
                return {error: "Invalid character in guess string: " + guess[i]};
            }
        }
        console.log(guess);
        var result = check(this.code, guess);
        console.log(result);
        if (result != null) {
            // Only add new guesses
            if (this.guesses.indexOf(guess) == -1) {
                var guess_info = {guess: guess};
                guess_info.right_color = result.right_color;
                guess_info.right_place = result.right_place;
                this.guesses.push(guess_info);
                //console.log(this.guesses);
            }
            result.num_guesses = this.guesses.length;
            return result;
        }
        else {
            return {error: "Guess is not the same length as the code. (Expected a length of " + this.code.length + ")"};
        }
    },

    getHistory: function () {
        return this.guesses;
    },

    // Validate the user trying to guess.
    validateUser: function validateUser(user) {
        // Stub
    },
};

// STUB: communicate with server to save stats from a game
function archive(id) {
    var game = currentGames[id];
    currentGames[id] = "Finished";
    console.log(game);
/*
    var arch = new ArchivedGame(game);

    arch.save( function(err, game) {
        if (err) return next(err);
        currentGames[id] = game._id;
    });
    * */
}

function startNewGame(host, guest, code, maxguesses) {
    var game = new Game(host, guest, code, maxguesses);
    currentGames[game.gameID] = game;
    return JSON.stringify({game: 'mastermind',
                           id: game.gameID,
                           code_length: code.length,
                           max_guesses: maxguesses});
}

// DEBUG: delete all games
function deleteAllGames() {
    currentGames = {};
}

module.exports = {
    startNewGame: startNewGame,
    startCPUGame: function(player, codelength, maxguesses) {
        return startNewGame(null, player, generateCode(codelength), maxguesses);
    },
    deleteAllGames: deleteAllGames,
    makeGuess: function(id, player, guess) { // TEMP/stub
        // TODO: authentication of the player
        var game = currentGames[id];
        var result;
        if (player != game.guest) {
            result = {error: "This is not your game to play."}
        }
        else if (game === "Finished" || typeof(game) === "number") {
            // TODO: grab the archived game data / stats.
            result = {error: "Game with id " + id + " has already finished."}
        }
        else if (game !== undefined) {
            result = game.makeGuess(guess);

            // Win Condition
            if (result.right_place === guess.length) {
                result.message = "You won!";
                game.winner = game.guest;
                result.code = game.code;
                archive(id);
                //save highscore
                var score = game.guesses.length;
                var username = player.username;
                users.highscore(username, score);
            }
            // Lose condition
            else if (result.num_guesses >= game.max_guesses) {
                result.message = "You lost!";
                game.winner = game.host;
                result.code = game.code;
                archive(id);
            }
        }
        else {
            result = {error: "Game with id " + id + " does not exist."};
        }

        result.gameid = id;
        result.guess = guess;

        return JSON.stringify(result);
    },
    getGuessHistory: function(id, player) {
        game = currentGames[id];
        var result;
        if (game !== undefined) {
            result = game.getHistory();
        }
        else {
            result = {error: "Game with id " + id + " does not exist."};
        }
        result.gameid = id;
        return JSON.stringify(result);
    }
}
