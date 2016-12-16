import React from 'react';
import ReactDOMServer from 'react-dom/server';
var ExpressRouter = require('express').Router();
var ReactRouter = require('react-router');

// site containers
import HTMLDocShell from './HTMLDocShell';
import Main from '../containers/Main';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

ExpressRouter.get('*', function(req, res) {
	
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

		  var html = HTMLDocShell(markup);

			res.send(html);
		} else {
			res.status(404).send('Not Found');
		}
	});
	
});

module.exports = ExpressRouter;