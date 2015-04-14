var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var StatsSchema = new Schema({
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        total_games: { type: Number, default: 0 },
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 }
});
mongoose.model("Stats", StatsSchema);
