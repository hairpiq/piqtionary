import React, { Component } from 'react';
import { render } from 'react-dom';
import {browserHistory} from 'react-router';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import {orange700, orange900} from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';

var RetinaImage = require('react-retina-image');

class LoginForm extends Component {
	constructor() {
		super();

	}

	render() {

		return (

			<div>
				<div className="login-form-container">

					<div className="inner-container">
					
						<h1>
							<span>Hairpiq</span>
							<RetinaImage className="logo" alt="Hairpiq Logo" src={["/images/hairpiq-splash-logo.png", "/images/2x/hairpiq-splash-logo.png"]} />
						</h1>

						<h2>a search engine for people<br /> who love hair</h2>

						<div>
							<TextField
								className="textfield"
						    	hintText="Full Name"
						     	fullWidth={true}
						    />
						    <TextField
						    	className="textfield"
						    	hintText="Username"
						    	fullWidth={true}
						    />
						    <TextField
						    	className="textfield"
						    	hintText="Password"
						    	type="password"
						    	fullWidth={true}
						    />
						    <FlatButton
						    	className="signup-button"
						    	label="Sign Up"
						    	backgroundColor={orange700}
						        hoverColor="#faba79"
					          	rippleColor="#ffffff"
						    />
						</div>

					</div>

					<Divider className="dashed"/>

					<div className="or">or</div>

					<div className="inner-container">

						<FlatButton
					    	className="login-button"
					    	label="Log Into Hairpiq"
					    	backgroundColor={orange700}
					        hoverColor="#faba79"
				          	rippleColor="#ffffff"
				          	icon={<FontIcon className="icon-hairpiq2" />}
					    />

						<FlatButton
					    	className="facebook-login-button"
					    	label="Log In With Facebook"
					    	backgroundColor="#3b5998"
							hoverColor="#98a8c9"
				          	rippleColor="#ffffff"
				          	icon={<FontIcon className="icon-facebook2" />}
					    />

						<FlatButton
					    	className="google-login-button"
					    	label="Log In With Google"
					    	backgroundColor="#3a7af3"
					        hoverColor="#6195f5"
				          	rippleColor="#ffffff"
				          	icon={<FontIcon className="icon-google2" />}
					    />

					</div>

				</div>
			</div>

		)
	}
}

export default LoginForm;