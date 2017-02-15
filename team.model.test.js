var { assert } = require('chai'),
	Team = require('./team.model'),
	mongoose = require('mongoose'),
	{ TEST_DB } = require('./config');

mongoose.connect(TEST_DB);

function getModel() {
	var myTeam = new Team({
		name: 'super team',
		players: [{
			name: 'John Smith',
			number: 12,
		}, {
			name: 'Jane Doe',
			number: 7,
		}],
	});

	return myTeam;
}

describe('Test Team model CRUD operations', function() {

	// Clear out the database before and after each test
	beforeEach(function(done) {
		Team.remove({}).then(() => done());
	});

	afterEach(function(done) {
		Team.remove({}).then(() => done());
	});

	it('should create a model when supplied the proper data', function() {

		let myTeam = getModel();

		assert.strictEqual(myTeam.name, 'super team');
		assert.deepEqual(myTeam.players[0].name, 'John Smith');
		assert.strictEqual(myTeam.players[0].number, 12);
		assert.deepEqual(myTeam.players[1].name, 'Jane Doe');
		assert.strictEqual(myTeam.players[1].number, 7);
	});

	it('should save data without issue', function(done) {
		let myTeam = getModel();
		Team.find({}).then(models => {
			assert.strictEqual(models.length, 0);
		}).then(() => {
			return myTeam.save();
		}).then(() => {
			return Team.find({});
		}).then(models => {
			assert.strictEqual(models.length, 1);
			done();
		});
	});

	it('should find a model without issue', function(done) {
		let myTeam = getModel();

		myTeam.save().then(() => {
			return Team.findOne({ name: 'super team' });
		}).then(team => {
			assert.strictEqual(team.name, 'super team');
			done();
		});
	});

	it('should update the proper model', function(done) {
		let myTeam = getModel();

		myTeam.save().then(() => {
			return Team.update(
				{ name: 'super team', 'players.name': 'John Smith' },
				{ '$set': { 'players.$.number': 40 }, }
			);
		}).then(() => {
			return Team.findOne({ name: 'super team' });
		}).then(model => {
			const player = model.players.find(data => data.name === 'John Smith');

			assert.strictEqual(player.number, 40);
			done();
		})
	});

	it('should delete the proper model',  function(done) {
		let myTeam = getModel();

		myTeam.save().then(() => {
			return Team.remove({ name: 'super team' });
		}).then(() => {
			return Team.findOne({ name: 'super team' });
		}).then(team => {
			assert.strictEqual(team, null);
			done();
		});
	});
});