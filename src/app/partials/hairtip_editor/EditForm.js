import React, { Component } from 'react';
import { render } from 'react-dom';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {grey400, orange700} from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';
import Services from '../../services/'

class EditForm extends Component {

	constructor() {
		super()

		this.state = {
			hairtipTextErrorText: '',
			hairtipText: '',
			is_hairtip_valid: false,
			request_status: '',
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

		let params = {
			auth0_user_id: auth0_user_id,
			hairpiq_id: this.props.data._id,
			body_text: this.state.hairtipText
		}

	    this.setState({
	      request_status: 'loading'
	    },function() {

	      Services.hairtips.add(params).then(function(result) {
	        
	        _this.setState({
	          request_status: 'loaded',
		          snackbar: {
	              open: true,
	              message: 'added hairtip'
	          }
	        })


	      })

	    })

	}

	handleHairtipTextChange = (e) =>  {
		
		var hairtipText = e.target.value.replace(/\<+/g, '').replace(/\>+/g, '');
		var minCharLimit = 85;

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

		let form_mode = (location.pathname.split('/')[1] === 'add-hairtip' ? 'create' : 'edit')

		this.setFormMode(form_mode)
	}

	render() {

		const params = this.props.data;

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

					</div>

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