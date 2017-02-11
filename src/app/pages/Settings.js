import React, { Component } from 'react';
import { render } from 'react-dom';
import Services from '../services/';
import {browserHistory} from 'react-router';
import Helmet from 'react-helmet';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {grey300, red400, red200, grey400, orange700, orange900} from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';


class Settings extends Component {

	constructor() {
		super();

		this.state = {
			'user_id': '',
			'fullname': '',
			'fullnameErrorText': '',
			'is_fullname_valid': true,
			'username': '',
			'usernameErrorText': '',
			'is_username_valid': true,
			'email': '',
			'emailErrorText': '',
			'is_email_valid': true,
			'is_authenticating': false,
			'dialog' : {
				'open': false
			},
			'snackbar': {
				'open': false
			},
			orig : {
				fullname: '',
				username: '',
				email: ''
			},
			is_sending_reset_password_request: false,
			reset_password_result_message: '',
			force_update_button_disabled: false,
			is_deleting_profile: false
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

	handleEmailChange = (e) =>  {
		
		var checkForEmailFormat = new RegExp('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$');
		var email = e.target.value.replace(/\.+/g, '.');

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

	handleUsernameChange = (e) =>  {

		var checkForUsernameFormat = new RegExp('^[a-z0-9._-]{3,30}$');
		var username = e.target.value.replace(/\.+/g, '.').replace(/\-+/g, '_')
		username = username.toLowerCase()

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

	updateUserProfile() {

		let _this = this;
		let user_id = this.state.user_id;

		let auth = this.props.route.auth;
		var arr = [];

		const updateVars = () => {

			if (this.state.email !== this.state.orig.email) 
				arr.push(auth.updateProfile(user_id, {
					email: this.state.email
				}, true));

			if (this.state.fullname !== this.state.orig.fullname) 
				arr.push(auth.updateProfile(user_id, {
					user_metadata: {
						fullname: this.state.fullname
					}
				}, true));

			let user_data_params = {
				auth0_user_id: this.state.user_id,
				username: this.state.username,
				fullname: this.state.fullname
			};

			arr.push(Services.setUserData(user_data_params))

			Promise.all(arr).then(function(result) {

				_this.setState({
						snackbar: {
				        open: true,
				        message: 'information updated'

				    },
				    is_authenticating: false,
				    force_update_button_disabled: true
			    });

			});

			auth.removeAllListeners()
	        auth.on('profile_updated', function(e) {
	          
	          _this.updateOrigValues();

	      	});

		}

		if (this.state.username !== this.state.orig.username) {

			auth.doesUsernameExist(this.state.username).then(function(result) {

				if (result === true) {

					_this.setState({
	       				usernameErrorText: 'username already exists, please try another',
						is_username_valid: false,
						is_authenticating: false
					})

				} else {
				
					let _username = {
						app_metadata: {
							username: _this.state.username
						}
					}

					if (user_id.indexOf('facebook') === -1 && user_id.indexOf('google') === -1)
						_username.username = _this.state.username

					arr.push(auth.updateProfile(user_id, _username, true));

					updateVars()

				}

			})
			
		} else
			updateVars()

		this.setState({
	    	is_authenticating: true,
	    })

		this.handleClose();

	}

	updateOrigValues() {

		let profile = JSON.parse(localStorage.getItem('profile'));

		let fullname = profile.user_metadata.fullname;
		let username = profile.app_metadata.username ;
		let email = profile.email;

		this.setState( {
			orig : {
				fullname: fullname,
				username: username,
				email: email
			},
			force_update_button_disabled: false
		})
	}

	resetPassword() {

		let _this = this;
		
		this.props.route.auth.resetPassword(this.state.orig.email).then(function(result) {

			_this.setState({
				is_sending_reset_password_request: false,
				reset_password_result_message: result,
				snackbar: {
			        open: true,
			        message: 'password instructions sent'
			      }
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

	updateProfile() {

		this.handleDialog({
			action: 'UPDATE_PROFILE',
		});

	}

	changePassword() {

		this.handleDialog({
			action: 'CHANGE_PASSWORD',
		});

	}

	deleteProfile() {

		this.handleDialog({
			action: 'DELETE_PROFILE',
		});

	}

	handleDialog(obj) {

    var title;
    var message;

    switch (obj.action) {
      case 'UPDATE_PROFILE':

        title = 'UPDATE PROFILE';
        message = 'Are you sure you want to update your settings?'

        break;

      case 'CHANGE_PASSWORD':

        title = 'CHANGE PASSWORD';
        message = 'Are you sure you want to change your password?';

        break;

      case 'DELETE_PROFILE':

        title = 'DELETE YOUR PROFILE';
        message = 'Are you sure you want to delete your account? This cannot be undone.';

        break;
    }

		this.setState({
		  dialog: {
		    open: true,
		    title: title,
		    message: message,
		    action: obj.action
		  },
		});

	}

  	handleSubmit() {

		const action = this.state.dialog.action;

		switch (action) {
		  
		  case 'UPDATE_PROFILE':

		    this.updateUserProfile()

		    break;

		  case 'CHANGE_PASSWORD':

		  	this.resetPassword();

		    break;

		  case 'DELETE_PROFILE':

		  	let user_id = this.state.user_id;
		  	let _this = this;

		  	this.setState({
		  		is_deleting_profile: true
		  	})

		  	this.props.route.auth.deleteProfile(user_id).then(function(result) {

		  		_this.setState({
		  			snackbar: {
				        open: true,
				        message: 'Profile deleted! Take care :-)'
				      }
			 	})


		  	})

		    break;

		}

		this.handleClose()
	}

	handleOpen = () => {
		this.setState({dialog: {open: true}});
	};

	handleClose = () => {
		this.setState({dialog: {open: false }});
	};

	closeSnackbar = () => {
		this.setState({
				snackbar: { 
				open: false
			}
		});
	};

	componentDidMount() {

		let profile = JSON.parse(localStorage.getItem('profile'));
		let user_id = profile.sub || profile.user_id;
		let fullname = profile.user_metadata.fullname;
		let username = profile.app_metadata.username;
		let email = profile.email;

		this.setState({
			user_id: user_id,
			fullname: fullname,
			username: username,
			email: email,
			orig : {
				fullname: fullname,
				username: username,
				email: email
			}
		});

	}

	componentWillUnmount() {
		this.setState({
	  		is_deleting_profile: false
	  	})
	}

	render() {

		let did_values_change = (

			this.state.fullname !== this.state.orig.fullname ||
			this.state.username !== this.state.orig.username ||
			this.state.email !== this.state.orig.email

		)

		let is_update_valid = (
			
			this.state.is_email_valid &&
			this.state.is_fullname_valid &&
			this.state.is_username_valid

		);

		const actions = [
	      <FlatButton
	        label="Cancel"
	        primary={true}
	        onTouchTap={this.handleClose.bind(this)}
	      />,
	      <FlatButton
	        label="Submit"
	        primary={true}
	        keyboardFocused={true}
	        onTouchTap={this.handleSubmit.bind(this)}
	      />,
	    ];

		return (

			<div className="settings-page">
        
		        <Helmet
		          title="Profile Settings"
		          titleTemplate="%s - Hairpiq"
		          defaultTitle="Hairpiq"
		        />

		        <div className="uk-grid uk-grid-margin">

		          <div className="uk-width-medium-8-10 uk-push-1-10">
		            
		            <Paper className="content-container">

		              <div className="content user-data">
		                
		                <h1>My Profile Settings</h1>

		                <TextField
		                	floatingLabelText="Full Name"
		                	floatingLabelFixed={true}
							value={this.state.fullname}
							errorText={this.state.fullnameErrorText}
							onChange={this.handleFullnameChange.bind(this)}
					    /><br />

						<TextField
							value={this.state.username}
							floatingLabelFixed={true}
							floatingLabelText="Username"
							errorText={this.state.usernameErrorText}
							onChange={this.handleUsernameChange.bind(this)}
						/><br />

						{this.state.email !== undefined ?

						<div>
							<TextField
								value={this.state.email}
								floatingLabelFixed={true}
								floatingLabelText="Email"
								errorText={this.state.emailErrorText}
								onChange={this.handleEmailChange.bind(this)}
							/><br />
						</div>
						: null }

						{this.state.is_authenticating ?
										
						<div className="loader">
					       <CircularProgress color={grey400} size={20} />
					    </div>

					    :

					    <div>

					    	{this.state.force_update_button_disabled ?

					    	<FlatButton
								className="update-button disabled"
								label="Update"
								backgroundColor={grey300}
								disabled={true}
							/>

					    	:

							<FlatButton
								className={ did_values_change && is_update_valid ? "update-button " : "update-button disabled"}
								label="Update"
								backgroundColor={grey300}
								disabled={ ! ( did_values_change && is_update_valid ) }
								onTouchTap={() => this.updateProfile()}
							/>

							}
						</div>

						}


		              </div>

		              <Divider className="dashed"/>

		              <div className="content user-data reset-password">

		              	{ this.state.reset_password_result_message.length > 0 ?

						<div className="reset-password-result-message">
							<p>{this.state.reset_password_result_message}</p>
							<p>Please check <strong>{this.state.orig.email}</strong> for further instructions.</p>
						</div>

						:

		              	<div>

							{this.state.is_sending_reset_password_request ?

							<div className="loader">
								<CircularProgress color={grey400} size={20} />
							</div>

							:

							<FlatButton
								className={ this.state.email && this.state.orig.email ? "reset-password-button " : "reset-password-button disabled"}
								label="Reset Password"
								backgroundColor={grey300}
								disabled={ !(this.state.email && this.state.orig.email) }
								onTouchTap={() => this.changePassword()}
							/>

							}

						</div>

						}

					  </div>

					  <Divider className="dashed"/>

		              <div className="content user-data delete-profile">

		              	{this.state.is_deleting_profile ?

						<div className="loader">
							<CircularProgress color={grey400} size={20} />
						</div>

						:

						<FlatButton
							className="delete-profile-button"
							label="Delete Profile"
							backgroundColor={red400}
							hoverColor={red200}
							onTouchTap={() => this.deleteProfile()}
						/>

						}

		              </div>

		            </Paper>

		          </div>

		        </div>

		        <Dialog
		            title={this.state.dialog.title}
		            actions={actions}
		            modal={false}
		            open={this.state.dialog.open}
		            onRequestClose={this.handleClose}
		            actionsContainerClassName="settings-page-dialog"
		            overlayClassName="main dialog-overlay">
		            <p>{this.state.dialog.message}</p>
		        </Dialog>

		        <Snackbar
		          className="snackbar"
		          open={this.state.snackbar.open}
		          message="profile updated!"
		          autoHideDuration={4000}
		          onRequestClose={this.closeSnackbar}
		        />

		    </div>

		)

	}
}

export default Settings;