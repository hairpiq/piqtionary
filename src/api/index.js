module.exports = function(app, db){

	// piqtionary posts calls to database
	require('./piqtionary')(app, db);

	// hairpiq creator mms app
	require('./hairpiq_creator/')(app);

}