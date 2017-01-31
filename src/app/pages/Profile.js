import React, { Component } from 'react';
import { render } from 'react-dom';
import Services from '../services/';
import Helmet from 'react-helmet';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';

class Profile extends Component {

	constructor() {
		super();

		this.state = {
			'is_profile_loaded': false,
			'profile': {},
			'is_logged_in': false
		}
	}

	componentDidMount() {

		let _this = this;
		let auth = this.props.route.auth;

		if(localStorage.getItem('profile') !== null)
			this.setState({
				is_profile_loaded: true,
				profile: JSON.parse(localStorage.getItem('profile'))
			})
		else {
			
			console.log(this.props.params.username)

			let params = {
				username: this.props.params.username
			}

			Services.getUserData(params).then(function(result) {

				console.log(result[0]);

				_this.setState({
					is_profile_loaded: true,
					profile: result[0]
				})


			});
		}

	    this.setState({
	      is_logged_in: auth.loggedIn()
	    });

	}

	componentWillReceiveProps(nextProps) {

	}

	render() {

		let { 
			is_logged_in,
			is_profile_loaded,
			profile
		} = this.state;

		return (

			<div className="profile-page">

				{ is_profile_loaded ?

				<div>
        
			        <Helmet
			          title={ is_logged_in ? 'My Profile' : this.state.profile.username }
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