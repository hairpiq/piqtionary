import React, { Component, PropTypes as T } from 'react';
import { render } from 'react-dom';
import AuthService from '../services/AuthService';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import {grey400, orange700, orange900} from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';
import CircularProgress from 'material-ui/CircularProgress';

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
			password_score: 0,
			password: '',
			is_authenticating: false,
			is_authenticating_with_facebook: false,
			is_authenticating_with_google: false,
			form_mode: 'signup',
			is_sending_reset_password_request: false,
			reset_password_result_message: ''
		}
	}

	componentDidMount() {
		this.setState({
			is_authenticating_with_facebook: false,
			is_authenticating_with_google: false
		});
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
	  		email: this.state.email,
	  		password: this.state.password
		}
	}

	login() {
		
		const { email, password } = this.getAuthParams()

		let _this = this;
		
		this.props.auth.login(email, password).catch(function(result) {

			_this.setState({
				is_authenticating: false
			});

		});

		this.setState({
			is_authenticating: true
		});
	}

	signup() {
		
		const { email, password } = this.getAuthParams()
		let fullname = this.state.fullname;
		let username =  this.state.username;
		let _this = this;

		// if success, these values are deleted in the AuthService parseHash method
		localStorage.setItem('username', username);
       	localStorage.setItem('fullname', fullname);

       	// if failure, remove in the catch below

		this.props.auth.signup(email, password, username, fullname).then(function(result) {

		}).catch(function(result) {

			localStorage.removeItem('username', username);
       		localStorage.removeItem('fullname', fullname);

			_this.setState({
				is_authenticating: false
			});

		});

		this.setState({
			is_authenticating: true
		});
	}

	loginWithFacebook() {
		
		this.props.auth.loginWithFacebook();
		this.setState({
			is_authenticating_with_facebook: true
		});

	}

	loginWithGoogle() {

		this.props.auth.loginWithGoogle();
		this.setState({
			is_authenticating_with_google: true
		});
	}

	setFormMode = (mode) => {

		this.setState({
			form_mode: mode,
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
			password_score: 0,
			password: '',
			reset_password_result_message: ''
		});

	}

	handleEmailChange = (e) =>  {
		
		var checkForEmailFormat = new RegExp('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$');
		var email = e.target.value;

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

  		let passwordErrorText = '';

  		if (this.state.form_mode === 'signup')
  			passwordErrorText = e.target.value.length === 0 ? '' : strength[result.score]

  		this.setState({
  			meter_value: result.score,
  			passwordErrorText: passwordErrorText,
  			is_password_valid: !(result.score === 0),
  			password_score: result.score,
  			password: e.target.value
  		});
	}

	resetPassword() {

		let _this = this;
		
		this.props.auth.resetPassword(this.state.email).then(function(result) {

			_this.setState({
				is_sending_reset_password_request: false,
				reset_password_result_message: result
			});

		}).catch(function(result) {

			_this.setState({
				is_sending_reset_password_request: false
			});

		});

		this.setState({
			is_sending_reset_password_request: true
		});

	}

	render() {

		let is_signup_valid = (
			
			this.state.is_email_valid &&
			this.state.is_fullname_valid &&
			this.state.is_username_valid &&
			this.state.is_password_valid

		);

		let is_login_valid = (
			this.state.is_email_valid &&
			this.state.is_password_valid
		)

		return (

			<div>
				<div className="login-form-container">

					<div className="inner-container">
					
						<h1>
							<span>Hairpiq</span>
							<RetinaImage className="logo" alt="Hairpiq Logo" src={["/images/hairpiq-splash-logo.png", "/images/2x/hairpiq-splash-logo.png"]} />
						</h1>

						<h2>capture your style,<br /> learn new looks</h2>

					</div>

					<Divider className="dashed"/>

					{ this.state.form_mode === 'signup' ?

					<div>

						<div className="or">log in with</div>

						<div className="inner-container login-buttons">

							{
								this.state.is_authenticating_with_facebook ||
								this.state.is_authenticating_with_google ?

							<div className="loader">
						       <CircularProgress color={grey400} size={20} />
						    </div>

						    :

						    <div>

								<FlatButton
							    	className="login-button"
							    	label="Hairpiq"
							    	backgroundColor={orange700}
							        hoverColor="#faba79"
						          	rippleColor="#ffffff"
						          	icon={<FontIcon className="icon-hairpiq2" />}
						          	onTouchTap={() => this.setFormMode('login')}
							    />

								<FlatButton
							    	className="facebook-login-button"
							    	label="Facebook"
							    	backgroundColor="#3b5998"
									hoverColor="#98a8c9"
						          	rippleColor="#ffffff"
						          	icon={<FontIcon className="icon-facebook2" />}
						          	onTouchTap={() => this.loginWithFacebook()}
							    />

								<FlatButton
							    	className="google-login-button"
							    	label="Google"
							    	backgroundColor="#3a7af3"
							        hoverColor="#6195f5"
						          	rippleColor="#ffffff"
						          	icon={<FontIcon className="icon-google2" />}
						          	onTouchTap={() => this.loginWithGoogle()}
							    />

						    </div>

							}

						</div>

						<div>

							{
								
								this.state.is_authenticating_with_facebook ||
								this.state.is_authenticating_with_google ? null

							:

							<div>

								<Divider className="dashed"/>

								<div className="or">or sign up</div>

								<div className="inner-container signup-form">

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
										    	className="textfield password"
										    	hintText="Password"
										    	type="password"
										    	errorText={this.state.passwordErrorText}
										    	fullWidth={true}
										    	onChange={this.handlePasswordChange.bind(this)}
										    	underlineShow={false}
										    	onKeyDown={(e) => {

										    		var keypressed = e.keyCode || e.which;
													if (keypressed == 13)
														if (is_signup_valid)
															this.signup();
										    	}}
										    />
										    <meter max="4" id="password-strength-meter" value={this.state.meter_value}></meter>

									    </div>

									    {this.state.is_authenticating ?
										
										<div className="loader">
									       <CircularProgress color={grey400} size={20} />
									    </div>

									    :

									    <FlatButton
									    	className={ is_signup_valid ? "signup-button " : "signup-button disabled"}
									    	label="Sign Up"
									    	backgroundColor={orange700}
									        hoverColor="#faba79"
								          	rippleColor="#ffffff"
								          	disabled={!is_signup_valid}
								          	onTouchTap={() => this.signup()}
									    />

										}
									</div>

								</div>

							</div>

							}

						</div>

					</div>

					: null }

					{ this.state.form_mode === 'login' ?

					<div>

						<div className="or">log in</div>

						<div className="inner-container login-form">

							<div>
							    <TextField
									className="textfield email"
							    	hintText="Email"
							     	fullWidth={true}
							     	value={this.state.email}
							     	errorText={this.state.emailErrorText}
							     	onChange={this.handleEmailChange.bind(this)}
							    />
							    <TextField
							    	className="textfield password"
							    	hintText="Password"
							    	type="password"
							    	errorText={this.state.passwordErrorText}
							    	fullWidth={true}
							    	onChange={this.handlePasswordChange.bind(this)}
							    	onKeyDown={(e) => {

							    		var keypressed = e.keyCode || e.which;
										if (keypressed == 13)
											if (is_login_valid)
												this.login();

							    	}}
							    />

							    {this.state.is_authenticating ?
								
								<div className="loader">
							       <CircularProgress color={grey400} size={20} />
							    </div>

							    :

							    <FlatButton
							    	className={ is_login_valid ? "login-submit-button " : "login-submit-button disabled"}
							    	label="Login"
							    	backgroundColor={orange700}
							        hoverColor="#faba79"
						          	rippleColor="#ffffff"
						          	disabled={!is_login_valid}
						          	onTouchTap={() => this.login()}
							    />

								}

								<p>Forgot Your Password? <a onTouchTap={() => this.setFormMode('reset-password')}>Reset Password</a></p>
								<p>Don't have an account? <a onTouchTap={() => this.setFormMode('signup')}>Sign Up</a></p>

							</div>

						</div>

					</div>

					: null }


					{ this.state.form_mode === 'reset-password' ?

					<div>

						<div className="or">reset password</div>

						<div className="inner-container reset-password-form">

							<p><a onTouchTap={() => this.setFormMode('login')}>Back to Login</a></p>

							{ this.state.reset_password_result_message.length > 0 ?

							<div>
								<p>{this.state.reset_password_result_message}</p>
							</div>

							:

							<div>
								<TextField
									className="textfield email"
							    	hintText="Email"
							     	fullWidth={true}
							     	value={this.state.email}
							     	errorText={this.state.emailErrorText}
							     	onChange={this.handleEmailChange.bind(this)}
							     	onKeyDown={(e) => {

							    		var keypressed = e.keyCode || e.which;
										if (keypressed == 13)
											if (this.state.is_email_valid)
												this.resetPassword();

							    	}}
							    />

							    {this.state.is_sending_reset_password_request ?
									
								<div className="loader">
							       <CircularProgress color={grey400} size={20} />
							    </div>

							    :

							    <FlatButton
							    	className={ this.state.is_email_valid ? "reset-password-submit-button " : "reset-password-submit-button disabled"}
							    	label="Submit"
							    	backgroundColor={orange700}
							        hoverColor="#faba79"
						          	rippleColor="#ffffff"
						          	disabled={!this.state.is_email_valid}
						          	onTouchTap={() => this.resetPassword()}
							    />

								}

							</div>

							}

						</div>

					</div>

					: null }

				</div>
			</div>

		)
	}
}

export default LoginForm;