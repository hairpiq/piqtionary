import React, { Component } from 'react';
import { render } from 'react-dom';
import {browserHistory} from 'react-router';
const config = process.env;

class LoggedIn extends Component {

	componentDidMount() {

		// report account activity metric
	    ga('send', {
			hitType: 'event',
			eventCategory: 'Account Activity',
			eventAction: 'logged-in',
			eventLabel: 'Logged In'
		});
		
	}

	render() {
		return (
			
			<div>
				<p><a href= {"//" + config.HOSTNAME}>Click here if not forwarded...</a></p>
			</div>
		)
	}
}

export default LoggedIn;