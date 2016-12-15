import React from 'react';
var ReactRouter = require('react-router');

// Router keeps the ui and url in sync
// Route maps the url path to the specific Component
// IndexRoute is default Route that displays
// browserHistory uses html5 history (if found)

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var browserHistory = ReactRouter.browserHistory;
var Redirect = ReactRouter.Redirect;

// site container and page components
import Main from '../containers/Main';
import Index from '../pages/Index';
import Photo from '../pages/Photo';
import About from '../pages/About';

// match routes to components
module.exports = (
    <Router history={browserHistory}>
		<Route path="/" component={Main}>
			<IndexRoute component={Index}/>
			<Route path="q/:term" component={Index}/>
			<Route path="p/:id" component={Photo}/>
			<Redirect from="p/:id/" to="p/:id"/>
		</Route>
    </Router>
)