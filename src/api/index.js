module.exports = function(app, db){

	// piqtionary posts calls to database
	require('./piqtionary')(app, db);

	// hairpiq creator app
	require('./hairpiq_creator/')(app);

	// auth0 management app
	require('./auth0_management/')(app);


}