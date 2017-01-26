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
			emailErrorText: '',
			email: '',
			is_email_valid: false,
			fullnameErrorText: '',
			fullname: '',
			is_fullname_valid: true,
			usernameErrorText: '',
			username: '',
			is_username_valid: false,
			meter_value: 0,
			passwordErrorText: '',
			is_password_valid: false,
			password_score: 0
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
		
		var checkForEmailFormat = new RegExp('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$');
		var email = e.target.value;

		console.log('email: ' + email);

		if (email.length === 0) {
			this.setState({
				emailErrorText: 'This field is required.',
				email: email,
				is_email_valid: false
			});
		} else if (email.length > 0 && email.length < 3) {
			this.setState({
				emailErrorText: 'Email is Too Short',
				email: email,
				is_email_valid: false
			});
		} else if (!checkForEmailFormat.test(email)) {
			this.setState({
				emailErrorText: 'Invalid format',
				email: email,
				is_email_valid: false
			});
		} else {
			this.setState({
				emailErrorText: '',
				email: email,
				is_email_valid: true
			});
		}

	}

	handleFullnameChange = (e) =>  {
		
		var checkForFullnameFormat = new RegExp("^[a-zA-Z-'. ]+$");
		var fullname = e.target.value.replace(/\.+/g, '.');

		if (fullname.length === 0) {
			this.setState({
				fullnameErrorText: 'This field is required.',
				fullname: fullname,
				is_fullname_valid: false
			});
		} else if (fullname.length > 0 && fullname.length < 3) {
			this.setState({
				fullnameErrorText: 'Full Name is Too Short',
				fullname: fullname,
				is_fullname_valid: false
			});
		} else if (!checkForFullnameFormat.test(fullname)) {
			this.setState({
				fullnameErrorText: 'Invalid format',
				fullname: fullname,
				is_fullname_valid: false
			});
		} else {
			this.setState({
				fullnameErrorText: '',
				fullname: fullname,
				is_fullname_valid: true
			});
		}
	}

	handleUsernameChange = (e) =>  {

		var checkForUsernameFormat = new RegExp('^[a-z0-9._-]{3,30}$');
		var username = e.target.value.replace(/\.+/g, '.');

		if (username.length === 0) {
			this.setState({
				usernameErrorText: 'This field is required.',
				username: username,
				is_username_valid: false
			});
		} else if (username.length > 0 && username.length < 3) {
			this.setState({
				usernameErrorText: 'Username is Too Short',
				username: username,
				is_username_valid: false
			});
		} else if (!checkForUsernameFormat.test(username)) {
			this.setState({
				usernameErrorText: 'Invalid format',
				username: username,
				is_username_valid: false
			});
		} else {
			this.setState({
				usernameErrorText: '',
				username: username,
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
  			passwordErrorText: e.target.value.length === 0 ? '' : strength[result.score],
  			is_password_valid: !(result.score === 0),
  			password_score: result.score
  		});
	}

	render() {

		let is_valid = (
			
			this.state.is_email_valid &&
			this.state.is_fullname_valid &&
			this.state.is_username_valid &&
			this.state.is_password_valid &&
			this.state.password_score >= 3

		);

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
						     	value={this.state.email}
						     	errorText={this.state.emailErrorText}
						     	onChange={this.handleEmailChange.bind(this)}
						    />
							<TextField
								className="textfield"
						    	hintText="Full Name"
						     	fullWidth={true}
						     	value={this.state.fullname}
						     	errorText={this.state.fullnameErrorText}
						     	onChange={this.handleFullnameChange.bind(this)}
						    />
						    <TextField
						    	className="textfield"
						    	hintText="Username"
						    	fullWidth={true}
						    	maxLength="31"
						    	value={this.state.username}
						    	errorText={this.state.usernameErrorText}
						    	onChange={this.handleUsernameChange.bind(this)}
						    />
						    <div className="password-container">
							    <TextField
							    	className="textfield"
							    	hintText="Password"
							    	type="password"
							    	errorText={this.state.passwordErrorText}
							    	fullWidth={true}
							    	onChange={this.handlePasswordChange.bind(this)}
							    	underlineShow={false}
							    />
							    <meter max="4" id="password-strength-meter" value={this.state.meter_value}></meter>

						    </div>

						    <FlatButton
						    	className={ is_valid ? "signup-button " : "signup-button disabled"}
						    	label="Sign Up"
						    	backgroundColor={orange700}
						        hoverColor="#faba79"
					          	rippleColor="#ffffff"
					          	disabled={!is_valid}
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