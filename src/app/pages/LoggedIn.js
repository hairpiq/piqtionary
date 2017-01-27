import React, { Component } from 'react';
import { render } from 'react-dom';
import {browserHistory} from 'react-router';

class LoggedIn extends Component {

	render() {
		return (
			
			<div>
				<p><a href="http://hairpiq.ngrok.io/">Click here if not forwarded...</a></p>
			</div>
		)
	}
}

export default LoggedIn;