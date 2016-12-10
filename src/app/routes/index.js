var router = require('express').Router();
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var Main = require('../containers/Main.js');
var ReactRouter = require('react-router');

import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

router.get('*', function(req, res) {
	var props = {}

	ReactRouter.match({
		routes: require('./routes.js'),
		location: req.url
	}, function(error, redirectLocation, renderProps) {
		if (renderProps) {
			var markup = ReactDOMServer.renderToString(
				<ReactRouter.RouterContext {...renderProps}
					createElement={function(Main, renderProps) {
						return <Main {...renderProps} custom={props} />;
					}} />
			);

			let html = [
		    '<!DOCTYPE html>',
		    '<html>',
		      '<head>',
		        '<meta charset="utf-8"/>',
		        '<link rel="stylesheet" href="/css/styles.css"></link>',
		      '</head>',
		      '<body>',
		        '<div id="app">' + markup + '</div>',
		      '</body>',
		      '<script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>',
		      '<script type="text/javascript" src="/app.js"></script>',
		    '</html>'
		  ].join('');

			res.send(html);
		} else {
			res.status(404).send('Not Found');
		}
	});
});

module.exports = router;