var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var UserSchema = new Schema({
		username: { type: String, unique: true },
		hashed_password: String
		email: String,
});
mongoose.model("User", UserSchema);
