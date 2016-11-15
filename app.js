var config = require('./config/hairpiq');

function init() {

	var config = require('./config/hairpiq');

	var express = require('express');
	var app = express();

	// identify static folder
	var fs = require('fs');
	var dir = __dirname + '/hairpiq/s3-queue';
	if (!fs.existsSync(dir))
	    fs.mkdirSync(dir);
	app.use(express.static(dir));

	// allow nodejs to access get and post variables
	var bodyParser = require('body-parser');
	app.use(bodyParser.urlencoded({extended: false}));

	// instantiate hairpiq module
	var hairpiq = require('./hairpiq/hairpiq')(app);

	app.listen(3000, function() {
	    
	    // show which worker is running
	    //if (config.isProd())
	    //	console.log('Worker %d running!', cluster.worker.id);
	    
	});
}

//if (!config.isProd()) 
	init();
	/*
else {

	/*
		run this application all the CPU cores available
		on this machine to increase performance
	*/

	// Code to run if we're in the master process
/*	
	var cluster = require('cluster');


	if (cluster.isMaster) {

		 // Count the machine's CPUs
		var cpuCount = require('os').cpus().length;


		console.log('Total CPU Count: ' + cpuCount);

		// Create a worker for each CPU
	    for (var i = 0; i < cpuCount; i += 1) {
	        cluster.fork();
	    }

	    // Listen for dying workers
		cluster.on('exit', function (worker) {

		    // Replace the dead worker,
		    // we're not sentimental
		    console.log('Worker %d died :(', worker.id);
		    cluster.fork();

		});

	} else {

		init();

	}

}

*/
