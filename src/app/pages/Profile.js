import React, { Component } from 'react';
import { render } from 'react-dom';
import Services from '../services/';
import Helmet from 'react-helmet';
import Paper from 'material-ui/Paper';


class Profile extends Component {

	constructor() {
		super();

		this.state = {
			'profile': {}
		}
	}

	componentDidMount() {


		let user_id = this.props.route.auth.getProfile().user_id;

		console.log('B');
		console.log(user_id);

	}

	render() {

		return (

			<div className="settings-page">
        
		        <Helmet
		          title="My Settings"
		          titleTemplate="%s - Hairpiq"
		          defaultTitle="Hairpiq"
		        />

		        <div className="uk-grid uk-grid-margin">

		          <div className="uk-width-medium-8-10 uk-push-1-10">
		            
		            <Paper className="content-container">

		              <div className="content">
		                
		                User Profile

		              </div>

		            </Paper>

		          </div>

		        </div>

		    </div>

		)

	}
}

export default Profile;