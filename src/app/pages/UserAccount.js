import React, { Component } from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import Services from '../services/';

class UserAccount extends Component {

	constructor() {
		super();

		this.state = {
			'profile': {}
		}
	}

	componentDidMount() {

		let auth0_user_id = this.props.route.auth.getProfile().user_id;

		Services.getUserMetadata({auth0_user_id: auth0_user_id}).then(function(result) {

			console.log('A');
			console.log(result);

		});

	}

	render() {

		return (

			<div className="account-page">
        
		        <Helmet
		          title="My Account"
		          titleTemplate="%s - Hairpiq"
		          defaultTitle="Hairpiq"
		        />

		        <div className="uk-grid uk-grid-margin">

		          <div className="uk-width-medium-8-10 uk-push-1-10">
		            
		            <Paper className="content-container">

		              <div className="content">
		                
		                Account Info

		              </div>

		            </Paper>

		          </div>

		        </div>

		    </div>

		)

	}
}

export default UserAccount;