import React, { Component } from 'react';
import { render } from 'react-dom';
import Services from '../services/';
import Helmet from 'react-helmet';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import {grey300, orange700, orange900} from 'material-ui/styles/colors';
import {browserHistory} from 'react-router';
import FavoritesWell from '../partials/FavoritesWell';

class Profile extends Component {

	constructor() {
		super();

		this.state = {
			'is_profile_loaded': false,
			'profile': null
		}
	}

	linkTo(route) {

		browserHistory.push(route);

	}

	componentDidMount() {

		let auth = this.props.route.auth;

		this.setState({
	      profile: auth.getProfile(),
	      is_profile_loaded: true
	    });
	}

	render() {

		let is_profile_loaded = this.state.is_profile_loaded;

		return (

			<div>

			{ is_profile_loaded ?

				<div>

					<div className="no-hero-space" />

					<div className="favorites-page">

						<div>
		        
					        <Helmet
					          title="My Favorites"
					          titleTemplate="%s - Hairpiq"
					          defaultTitle="Hairpiq"
					        />

					        <div className="uk-grid uk-grid-margin">

								<div className="uk-width-medium-8-10 uk-push-1-10">

									<h1>My Favorites</h1>

									<FavoritesWell
									location={this.props.location}
									/>

								</div>

					        </div>

					    </div>

				    </div>

			    </div>

			    : null }

		    </div>

		)

	}
}

export default Profile;