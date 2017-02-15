const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
	name: String,
	number: Number,
});

const TeamSchema = new mongoose.Schema({
	name: { type: String, unique: true },
	players: [PlayerSchema],
});

var Team = mongoose.model('Team', TeamSchema);

module.exports = Team;