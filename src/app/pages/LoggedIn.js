import React, { Component } from 'react';
import { render } from 'react-dom';
import {browserHistory} from 'react-router';
require('dotenv').config();
const config = process.env;

class LoggedIn extends Component {

	render() {
		return (
			
			<div>
				<p><a href= {"//" + config.HOSTNAME}>Click here if not forwarded...</a></p>
			</div>
		)
	}
}

export default LoggedIn;