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
import Blank from '../containers/Blank';
import Index from '../pages/Index';
import Photo from '../pages/Photo';
import Create from '../pages/Create';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Survey from '../pages/Survey';
import Info from '../pages/Info';
import Favorites from '../pages/Favorites';
import Hairtip from '../pages/Hairtip';

// authenticate user
import AuthService from '../services/auth0/';
import LoggedIn from '../pages/LoggedIn';
import LoggedOut from '../pages/LoggedOut';
const auth = new AuthService(config.AUTH0_CLIENT_ID, config.AUTH0_DOMAIN);

// onEnter callback to validate authentication in private routes


const requireAuth = (nextState, replace) => {

	if (typeof window === 'object') {

		if (!auth.loggedIn()) {
			replace({ pathname: '/' })
		}

	}
}

const parseAuthHash = (nextState, replace) => {
	
	if (typeof window === 'object') {
		
		if (/access_token|id_token|error/.test(nextState.location.hash)) {
			auth.parseHash(nextState.location.hash);
		}

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
				<Route path="search" component={Index} auth={auth} onEnter={requireAuth}/>
				
				<Route path="p/:id" component={Photo} />
				<Redirect from="p/:id/" to="p/:id"/>
				
				<Route path="favorites" component={Favorites} auth={auth} onEnter={requireAuth}/>
				<Route path="create" component={Create} auth={auth} onEnter={requireAuth}/>
				<Route path="settings" component={Settings} auth={auth} onEnter={requireAuth}/>
				
				<Route path="add-hairtip/:id" component={Hairtip} auth={auth} onEnter={requireAuth}/>
				<Route path="edit-hairtip/:id" component={Hairtip} auth={auth} onEnter={requireAuth}/>
				<Route path="hairtip/:id" component={Hairtip} />
				<Redirect from="hairtip/:id/" to="hairtip/:id"/>
				
				<Route path="info" component={Info} />
				<Route path="survey" component={Survey} />

			</Route>

			<Route component={Blank}>

				<Route path="login" component={LoggedIn} auth={auth} onEnter={parseAuthHash} />
			    <Route path="logout" component={LoggedOut} />

			</Route>

			<Route path="admin" component={AdminMain} auth={auth} onEnter={requireAuth}>

				<IndexRoute component={AdminPending} onEnter={requireAuth}/>
				<Route path="unpublished" component={AdminUnpublished} onEnter={requireAuth}/>
				<Route path="published" component={AdminPublished} onEnter={requireAuth}/>
				<Route path="trash" component={AdminTrash} onEnter={requireAuth}/>
				<Route path="create" component={AdminCreate} onEnter={requireAuth}/>
				<Route path="ava-vision" component={AdminAvaVision} onEnter={requireAuth}/>

			</Route>

		</Route>
		
		<Route path="/:username">

			<Route component={Main} auth={auth}>
    	
    			<IndexRoute component={Profile} auth={auth} />

    		</Route>
    	
    	</Route>

    </Router>
)