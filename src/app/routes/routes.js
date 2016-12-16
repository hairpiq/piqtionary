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

// admin container and page components
import AdminMain from '../containers/admin/Main';
import Review from '../pages/admin/Review';
import Unpublished from '../pages/admin/Unpublished';
import Published from '../pages/admin/Published';
import Trash from '../pages/admin/Trash';

// match routes to components
module.exports = (
    <Router history={browserHistory}>
		<Route path="/">
			
			<Route component={Main}>
				<IndexRoute component={Index}/>
				<Route path="q/:term" component={Index}/>
				<Route path="p/:id" component={Photo}/>
				<Redirect from="p/:id/" to="p/:id"/>
			</Route>

			<Route path="admin" component={AdminMain}>
				<IndexRoute component={Review}/>
				<Route path="unpublished" component={Unpublished}/>
				<Route path="published" component={Published}/>
				<Route path="trash" component={Trash}/>
			</Route>

		</Route>
    </Router>
)