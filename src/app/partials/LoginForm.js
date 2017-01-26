import React, { Component, PropTypes as T } from 'react';
import ReactDOM, { render } from 'react-dom';
import AuthService from '../services/AuthService';
import {browserHistory} from 'react-router';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import {orange700, orange900} from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';

var RetinaImage = require('react-retina-image');
var zxcvbn = require('zxcvbn');

class LoginForm extends Component {

	constructor() {
		super();

		this.state = {
			usernameErrorText: '',
			username: '',
			is_username_valid: false,
			meter_value: 0,
			passwordErrorText: ''
		}
	}
	
	static contextTypes = {
		router: T.object
	}

	static propTypes = {
		location: T.object,
		auth: T.instanceOf(AuthService)
	}

	getAuthParams() {
		return {
	  		email: ReactDOM.findDOMNode(this.refs.email).value,
	  		password: ReactDOM.findDOMNode(this.refs.password).value
		}
	}

	login(e) {
		e.preventDefault()
		const { email, password } = this.getAuthParams()
		this.props.auth.login(email, password)
	}

	signup() {
		const { email, password } = this.getAuthParams()
		this.props.auth.signup(email, password)
	}

	loginWithGoogle() {
		this.props.auth.loginWithGoogle();
	}

	handleEmailChange = (e) =>  {
		console.log(e.target.value);
	}

	handleFullnameChange = (e) =>  {
		console.log(e.target.value);
	}

	handleUsernameChange = (e) =>  {

		var checkForUsernameFormat = new RegExp('^[a-z0-9._-]{3,30}$');

		if (!checkForUsernameFormat.test(username)) {
			this.setState({
				usernameErrorText: 'Invalid format: your_username',
				username: '@' + username,
				is_username_valid: false
			});
		} else if (e.target.value.length === 0) {
			this.setState({
				usernameErrorText: 'This field is required.',
				username: e.target.value,
				is_username_valid: false
			});
		} else {
			this.setState({
				usernameErrorText: '',
				username: e.target.value,
				is_username_valid: true
			});
		}
	}

	handlePasswordChange = (e) =>  {
		
		let result = zxcvbn(e.target.value);

		var strength = {
		  0: "Password is Too Short",
		  1: "Password is Very Weak",
		  2: "Password is Weak",
		  3: "Password is Good",
		  4: "Password is Strong!"
		}

		// Update the password strength meter
  		//meter.value = result.score;

  		this.setState({
  			meter_value: result.score,
  			passwordErrorText: e.target.value.length === 0 ? '' : strength[result.score]
  		});
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
						    	hintText="Email"
						     	fullWidth={true}
						     	onChange={this.handleEmailChange.bind(this)}
						    />
							<TextField
								className="textfield"
						    	hintText="Full Name"
						     	fullWidth={true}
						     	onChange={this.handleFullnameChange.bind(this)}
						    />
						    <TextField
						    	className="textfield"
						    	hintText="Username"
						    	fullWidth={true}
						    	errorText={this.state.usernameErrorText}
						    	onChange={this.handleUsernameChange.bind(this)}
						    />
						    <TextField
						    	className="textfield"
						    	hintText="Password"
						    	type="password"
						    	errorText={this.state.passwordErrorText}
						    	fullWidth={true}
						    	onChange={this.handlePasswordChange.bind(this)}
						    />
						    
						    {this.state.passwordErrorText.length > 0 ?
						    <meter max="4" id="password-strength-meter" value={this.state.meter_value}></meter>
						    : null }

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

					<div className="or">or log in with</div>

					<div className="inner-container login-buttons">

						<FlatButton
					    	className="login-button"
					    	label="Hairpiq"
					    	backgroundColor={orange700}
					        hoverColor="#faba79"
				          	rippleColor="#ffffff"
				          	icon={<FontIcon className="icon-hairpiq2" />}
					    />

						<FlatButton
					    	className="facebook-login-button"
					    	label="Facebook"
					    	backgroundColor="#3b5998"
							hoverColor="#98a8c9"
				          	rippleColor="#ffffff"
				          	icon={<FontIcon className="icon-facebook2" />}
					    />

						<FlatButton
					    	className="google-login-button"
					    	label="Google"
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