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
import Create from '../pages/Create';
import Survey from '../pages/Survey';
import Info from '../pages/Info';

// admin container and page components
import AdminMain from '../containers/admin/Main';
import AdminPending from '../pages/admin/Pending';
import AdminUnpublished from '../pages/admin/Unpublished';
import AdminPublished from '../pages/admin/Published';
import AdminTrash from '../pages/admin/Trash';
import AdminCreate from '../pages/admin/Create';
import AdminAvaVision from '../pages/admin/AvaVision';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// match routes to components
module.exports = (
    <Router history={browserHistory}>
		<Route path="/">
			
			<Route component={Main}>
				<IndexRoute component={Index}/>
				<Route path="q/:term" component={Index}/>
				<Route path="p/:id" component={Photo}/>
				<Redirect from="p/:id/" to="p/:id"/>
				<Route path="create" component={Create}/>
				<Route path="survey" component={Survey}/>
				<Route path="info" component={Info}/>
			</Route>

			<Route path="admin" component={AdminMain}>
				<IndexRoute component={AdminPending}/>
				<Route path="unpublished" component={AdminUnpublished}/>
				<Route path="published" component={AdminPublished}/>
				<Route path="trash" component={AdminTrash}/>
				<Route path="create" component={AdminCreate}/>
				<Route path="ava-vision" component={AdminAvaVision}/>
			</Route>

		</Route>
    </Router>
)