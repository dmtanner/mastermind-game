var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
// Archived games
var GameSchema = new Schema({
        host: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        guest: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        code: String,
        winner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        guesses: [{guess: String, right_color: Number, right_place: Number}]
});
mongoose.model("Games", StatsSchema);
