var router = require('express').Router();
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var Main = require('../containers/Main.js');
var ReactRouter = require('react-router');

router.get('*', function(req, res) {
	var props = {}

	ReactRouter.match({
		routes: require('./routes.js'),
		location: req.url
	}, function(error, redirectLocation, renderProps) {
		if (renderProps) {
			var html = ReactDOMServer.renderToString(
				<ReactRouter.RouterContext {...renderProps}
					createElement={function(Main, renderProps) {
						return <Main {...renderProps} custom={props} />;
					}} />
			);
			res.send(html);
		} else {
			res.status(404).send('Not Found');
		}
	});
});

module.exports = router;