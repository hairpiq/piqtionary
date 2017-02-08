import React, { Component } from 'react';
import { render } from 'react-dom';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {grey400, grey700, orange700} from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';
import Services from '../../services/';
import { browserHistory } from 'react-router';
import ActionDeleteForever from 'material-ui/svg-icons/action/delete-forever';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';

const styles = {
  appBarIconButton : {
    color: grey700
  }
};

class EditForm extends Component {

	constructor() {
		super()

		this.state = {
			hairtipTextErrorText: '',
			hairtipText: '',
			is_hairtip_valid: false,
			request_status: '',
			dialog: {
				open: false,
			},
			snackbar: {
              open: false,
              message: ''
          	},
          	form_mode: '',
		}
	}

	proxyUrl = (s3_url) => {

		if (s3_url)
			return '/h/' + s3_url.split('.com/')[1];
	
	}

	submitHairtip() {

		let _this = this;
		let auth0_user_id = JSON.parse(localStorage.getItem('profile')).user_id
		let hairpiq_id = this.props.data._id

		let params = {
			auth0_user_id: auth0_user_id,
			hairpiq_id: hairpiq_id,
			body_text: this.state.hairtipText
		}

	    this.setState({
	      request_status: 'loading'
	    },function() {

	   	let method = (_this.state.form_mode === 'create' ? 'add' : 'edit')


		Services.hairtips[method](params).then(function(result) {

			if (_this.state.form_mode === 'create') {
				
				_this.setFormMode('edit')

			}

			_this.setState({
					request_status: 'loaded',
					snackbar: {
						open: true,
						message: 'hairtip ' + method + 'ed'
					}
				})

			})

	    })

	}

	deleteHairtip () {

		let _this = this;
		let hairpiq_id = this.props.data._id;
		let params = {
			hairpiq_id: hairpiq_id
		}

		this.setState({
	      request_status: 'loading',
	      dialog: {
				open: false
			},
	    }, function () {

			Services.hairtips.delete(params).then(function(result) {

	          	let url = ( _this.props.returnTo !== undefined ? _this.props.returnTo : '/add-hairtip/' + hairpiq_id )
				browserHistory.replace(url)

				_this.setState({
					hairtipText: '',
					form_mode: 'create',
					request_status: 'loaded',
					snackbar: {
						open: true,
						message: 'hairtip deleted'
					}
				})

	        })

		})

	}

	handleHairtipTextChange = (e) =>  {
		
		var hairtipText = e.target.value.replace(/\<+/g, '').replace(/\>+/g, '');
		var minCharLimit = 85;
		var maxCharLimit = 2000;

		if (hairtipText.length === 0) {
			this.setState({
				hairtipTextErrorText: 'This field is required.',
				hairtipText: hairtipText,
				is_hairtip_valid: false
			});
		} else if (hairtipText.length > 0 && hairtipText.length < minCharLimit) {
			this.setState({
				hairtipTextErrorText: 'Hairtip is ' + (minCharLimit - hairtipText.length) + ' characters too short.',
				hairtipText: hairtipText,
				is_hairtip_valid: false
			});
		} else if (maxCharLimit <= hairtipText.length) {
			this.setState({
				hairtipTextErrorText: 'Hairtip is ' + (hairtipText.length - maxCharLimit) + ' characters too long.',
				hairtipText: hairtipText,
				is_hairtip_valid: false
			});
		} else {
			this.setState({
				hairtipTextErrorText: '',
				hairtipText: hairtipText,
				is_hairtip_valid: true
			});
		}
	}

	closeSnackbar = () => {

		this.setState({
		    snackbar: { 
		    open: false
		  }
		});

	};

	setFormMode = (mode) => {

		this.setState({
			form_mode: mode
		})

	}

	componentDidMount() {

		$('.modal-inner').addClass('fixed-edit-hairtip-form-width');

		let pieces = location.pathname.split('/')
		let pathname = pieces[1]
		let hairpiq_id = pieces[2]
		let form_mode = (pathname === 'add-hairtip' ? 'create' : 'edit')
		let _this = this;

		this.setFormMode(form_mode)

		let params = {
			hairpiq_id: hairpiq_id
		}

		Services.hairtips.getHairtipByHairpiqId(params).then(function(result) {

			if (result.length > 0) {

				if (form_mode === 'create') {
					
					browserHistory.replace('/edit-hairtip/' + hairpiq_id)
					_this.setFormMode('edit')

				}

				_this.setState({
					hairtipText: result[0].body_text
				})

			}

		});

	}

	handleOpen = () => {
    	this.setState({dialog: {open: true}});
	};

	handleClose = () => {
		this.setState({dialog: {open: false }});
	};

	render() {

		const params = this.props.data;

		const actions = [
		<FlatButton
			label="Cancel"
			primary={true}
			onTouchTap={this.handleClose}
			/>,
		<FlatButton
			label="Submit"
			primary={true}
			keyboardFocused={true}
			onTouchTap={this.deleteHairtip.bind(this)}
			/>,
		];

		return (

			<div className="edit-hairtip-form">
				
					
				<div className="left-col">

					<div className="photo">

						<Paper className="paper" zDepth={2}>
							<img src={this.proxyUrl(params.s3_url)} onLoad={this.onImageLoaded}/>
						</Paper>

					</div>

				</div>

				<div className="right-col">

					<div className="detail-info">
							
							<div className="data-container">

							{ this.state.form_mode === 'create' ?

							<h2>Add a Hairtip</h2>

							:

							<h2>Edit Your Hairtip</h2>

							}

							<div>
								<TextField
								  id="hairtip-textfield"
								  floatingLabelText="What did you do to get this look?"
      							  floatingLabelFixed={true}
							      hintText="list your routine, products, and/or special tricks that make this look happen"
							      errorText={this.state.hairtipTextErrorText}
							      value={this.state.hairtipText}
							      multiLine={true}
							      rows={4}
							      fullWidth={true}
							      onChange={this.handleHairtipTextChange}
							    /><br />
							</div>

						</div>

						{ this.state.request_status === 'loading' ?

						<div>

					        <div className="loader">
					           <CircularProgress color={grey400} size={20} />
					        </div>

					        <FlatButton
							    	className="submit-button disabled"
							    	label="Submit"
							    	backgroundColor={orange700}
							        hoverColor="#faba79"
						          	rippleColor="#ffffff"
						          	disabled={true}
						          	onTouchTap={() => this.submitHairtip()}
							    />

						</div>


				        :

						<FlatButton
						    	className={ this.state.is_hairtip_valid ? "submit-button " : "submit-button disabled"}
						    	label="Submit"
						    	backgroundColor={orange700}
						        hoverColor="#faba79"
					          	rippleColor="#ffffff"
					          	disabled={!this.state.is_hairtip_valid}
					          	onTouchTap={() => this.submitHairtip()}
						    />

						}

						{ this.state.form_mode === 'edit' ?

						<IconButton
							className="delete button"
							onTouchTap={() => this.handleOpen()}
							iconStyle={styles.appBarIconButton}>
							<ActionDeleteForever />
						</IconButton>

						: null }

					</div>

				</div>

				<div>
		          <Dialog
		            title='Delete this Hairtip'
		            actions={actions}
		            modal={false}
		            open={this.state.dialog.open}
		            onRequestClose={this.handleClose}
		            actionsContainerClassName="delete-hairtip-dialog"
		            overlayClassName="dialog-overlay">
		            <p>do you want to clear this hairtip? This can't be undone.</p>
		          </Dialog>
		        </div>

				<Snackbar
		          className="snackbar"
		          open={this.state.snackbar.open}
		          message={this.state.snackbar.message}
		          autoHideDuration={4000}
		          onRequestClose={this.closeSnackbar}
		        />

			</div>


		)
	}
}

export default EditForm;