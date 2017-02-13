import React, { Component } from 'react';
import { render } from 'react-dom';
import {browserHistory} from 'react-router';

class LoggedOut extends Component {

	componentDidMount() {

		// report account activity metric
	    ga('send', {
			hitType: 'event',
			eventCategory: 'Account Activity',
			eventAction: 'logged-out',
			eventLabel: 'Logged Out'
		});

		browserHistory.replace('/');

	}

	render() {
		return <div />
	}
}

export default LoggedOut;