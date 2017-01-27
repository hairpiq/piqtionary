import React from 'react';
var ReactRouter = require('react-router');
const config = process.env;

// Router keeps the ui and url in sync
// Route maps the url path to the specific Component
// IndexRoute is default Route that displays
// browserHistory uses html5 history (if found)

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var browserHistory = ReactRouter.browserHistory;
var Redirect = ReactRouter.Redirect;
var IndexRedirect = ReactRouter.IndexRedirect;

// site container and page components
import Main from '../containers/Main';
import Index from '../pages/Index';
import Photo from '../pages/Photo';
import Create from '../pages/Create';
import Survey from '../pages/Survey';
import Info from '../pages/Info';

// authenticate user
import AuthService from '../services/AuthService';
import LoggedOut from '../pages/LoggedOut';
const auth = new AuthService(config.AUTH0_CLIENT_ID, config.AUTH0_DOMAIN);

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/login' })
  }
}

const parseAuthHash = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.parseHash(nextState.location.hash)
  }
}


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

			<Route component={Main} auth={auth}>

				<IndexRoute component={Index} auth={auth} />
			    <Route path="login" component={Index} auth={auth} />
			    <Route path="logout" component={LoggedOut} />

				<Route path="search" component={Index} onEnter={requireAuth}/>
				<Route path="p/:id" component={Photo} onEnter={requireAuth}/>
				<Redirect from="p/:id/" to="p/:id"/>
				<Route path="create" component={Create} onEnter={requireAuth}/>
				<Route path="survey" component={Survey} />
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