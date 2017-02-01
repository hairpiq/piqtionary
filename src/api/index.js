module.exports = function(app, db){

	// piqtionary posts calls to database
	require('./piqtionary')(app, db);

	// hairpiq creator api
	require('./hairpiq_creator/')(app);

	// auth0 server-side communication layer
	// to avoid client-side cors issues
	require('./auth0/')(app);


}