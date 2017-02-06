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

			<div className="profile-page">

				{ is_profile_loaded ?

				<div>
        
			        <Helmet
			          title="My Collection"
			          titleTemplate="%s - Hairpiq"
			          defaultTitle="Hairpiq"
			        />

			        <div className="uk-grid uk-grid-margin">

			          <div className="uk-width-medium-8-10 uk-push-1-10">
			            
			            <Paper>

			            	<div className="content-container profile-header">

								<div className="content">
									<h1>My Favorites</h1>
								</div>

				            </div>

				            <Divider className="dashed"/>

				            <div className="content-container hairpiq-collection">

								<div className="content">

									<div className="content">

										<h2>my favorite hairpiqs and hairtips</h2>
										
									</div>

								</div>

							</div>

			            </Paper>

			          </div>

			        </div>

			    </div>

		    	: null }

		    </div>

		)

	}
}

export default Profile;