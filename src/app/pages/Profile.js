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
			'profile': {},
			'username': '',
			'fullname': '',
			'picture': '',
			'is_logged_in': false,
			'does_url_and_profile_match': false
		}
	}

	linkTo(route) {

		browserHistory.push(route);

	}

	getData(username) {

		let _this = this;

		// get user data reference from piqtionary
			// this enables user to see other profiles based on the
			// url, ie: I'm logged in as avery but want to see hairpiq.com/shinavia

		function getUserData(u) {
			
			let params = {
				username: u
			}

			Services.getUserData(params).then(function(result) {

				_this.setState({
					is_profile_loaded: true,
					profile: result[0],
					does_url_and_profile_match: false
				})

			});
		}

		// if the user profile is in local storage
			// parse the object
				// if the url username (this.props.params.username) equals the profile.username
					// Then load the profile object for the profile username
				// else
					// load the url username
		// else
			// load the url username

		if(localStorage.getItem('profile') !== null) {

			let profile = JSON.parse(localStorage.getItem('profile'))

			if (username === profile.app_metadata.username) {

				profile.username = profile.app_metadata.username;
				profile.fullname = profile.user_metadata.fullname;

				this.setState({
					is_profile_loaded: true,
					profile: profile,
					does_url_and_profile_match: true
				})

			} else {

				getUserData(username)

			}

		} else {
			
			getUserData(username)
		}

	}

	componentDidMount() {

		let auth = this.props.route.auth;

		this.setState({
	      is_logged_in: auth.loggedIn()
	    });

	    this.getData(this.props.params.username)

	}

	componentWillReceiveProps(nextProps) {

		this.getData(nextProps.params.username)

	}

	render() {

		let { 
			is_logged_in,
			is_profile_loaded,
			profile,
			does_url_and_profile_match
		} = this.state;

		return (

			<div className="profile-page">

				{ is_profile_loaded ?

				<div>
        
			        <Helmet
			          title={ does_url_and_profile_match ? 'My Profile' : profile.username }
			          titleTemplate="%s - Hairpiq"
			          defaultTitle="Hairpiq"
			        />

			        <div className="uk-grid uk-grid-margin">

			          <div className="uk-width-medium-8-10 uk-push-1-10">
			            
			            <Paper>

			            	<div className="content-container profile-header">

								<div className="content">
									<div className="left-col">
										<Avatar
										src={profile.picture}
										size={120}
										/>
									</div>
									<div className="right-col">
										<h1>{profile.username}</h1>
										<h2>{profile.fullname}</h2>

										{ does_url_and_profile_match ?
										
										<FlatButton
									    	className="edit-button"
									    	label="Edit"
									    	backgroundColor={grey300}
								          	onTouchTap={() => this.linkTo('/settings')}
									    /> : null }

									</div>
								</div>

				            </div>


				            <Divider className="dashed"/>

				            <div className="content-container hairpiq-collection">

								<div className="content">

									<div className="content">

										<h3>My Hairpiq Collection</h3>

										<p>images and hairtips here</p>

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