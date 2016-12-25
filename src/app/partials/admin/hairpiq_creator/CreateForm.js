import React, { Component } from 'react';
import { render } from 'react-dom';
import Paper from 'material-ui/Paper';

import Dropzone from 'react-dropzone';
import request from 'superagent';

import CircularProgress from 'material-ui/CircularProgress';
import {grey400} from 'material-ui/styles/colors';

import {Cropper} from 'react-image-cropper';

import NavStepper from './NavStepper';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';

import Services from '../../../services/admin/'

const config = process.env;
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/' + config.CLOUDINARY_CLOUD_NAME + '/image/upload';

var RetinaImage = require('react-retina-image');

class CreateForm extends Component {

	constructor() {
		super();

		this.state = {
			cloudinary: {
				uploadedFile: null,
				uploadedFileCloudinaryUrl: '',
				isUploading: false
			},
			cropper: {
				image: undefined,
            	imageLoaded: false,
            	values: {}
			},
			isPrerenderedToggled: false,
			logo: {
				color: 'white',
				opacity: 1
			},
			plate: {
				color: 'black',
				opacity: 0.5
			},
			stylename: 'Style Name',
			ig_username: '@ig_username',
			stylenameErrorText: '',
			ig_usernameErrorText: '',
			is_stylename_valid: false,
			is_ig_username_valid: false,
			dialog: {
	            open: false,
	        },
	        finished: false,
	        snackbar: {
				open: false
			}
		}

		// Cropper methods
		this.onImageDrop = this.onImageDrop.bind(this);

		// NavStepper methods
		this.onPrerenderedToggle = this.onPrerenderedToggle.bind(this);
		this.onLogoColorCheck = this.onLogoColorCheck.bind(this);
		this.onPlateColorCheck = this.onPlateColorCheck.bind(this);
		this.handleStylenameChange = this.handleStylenameChange.bind(this);
		this.handleIGUsernameChange = this.handleIGUsernameChange.bind(this);
		this.clearInfo = this.clearInfo.bind(this);
		this.setFinished = this.setFinished.bind(this);

		// Dialog methods
		this.handleOpen = this.handleOpen.bind(this);
      	this.handleClose = this.handleClose.bind(this);
      	this.handleSubmit = this.handleSubmit.bind(this);

	}

	componentDidMount() {

		$('.modal-inner').addClass('fixed-create-form-width');

		this.setState({
			stylename: 'Style Name',
			ig_username: '@ig_username',
			stylenameErrorText: '',
			ig_usernameErrorText: '',
			is_stylename_valid: false,
			is_ig_username_valid: false
		});
	}

	componentWillUnmount() {

		$('.modal-inner').removeClass('fixed-create-form-width');

	}

	onImageDrop(files) {

		$('.modal-inner, .create-form').addClass('disabled');
		
		this.setState({
			cloudinary: {
				uploadedFile: files[0],
				isUploading: true
			}
		});

		this.handleImageUpload(files[0]);
	}

	handleImageUpload(file) {
		
		let upload = request.post(CLOUDINARY_UPLOAD_URL)
							.field('upload_preset', config.CLOUDINARY_UPLOAD_PRESET)
							.field('file', file);

		upload.end((err, response) => {
			if (err) {
				console.error(err);
			}

			if (response.body.secure_url !== '') {
				this.setState({
					cloudinary: {
						uploadedFileCloudinaryUrl: response.body.secure_url,
						isUploading: false
					}
				})
			}
		});
	}

	onImageLoaded(state) {

		$('.modal-inner, .create-form').removeClass('disabled');

		this.setState({
			cropper: {
				[state + 'Loaded']: true
			}
		});

	}

	cropImage(state) {

		let croppedImage = this.refs.cropper.crop();
		let croppedValues = this.refs.cropper.values();
		
		this.setState({
			cropper: {
				image: croppedImage,
				imageLoaded: true,
				values: croppedValues
			}
		});

	}

	clearCrop() {

		this.setState({
			cropper: {
				image: undefined,
				values: {}
			}
		});

	}

	clearImage() {

		console.log('clear image on cloudinary, as well!');

		this.setState({
			cloudinary: {
				uploadedFile: null,
				uploadedFileCloudinaryUrl: '',
				isUploading: false
			},
			cropper: {
				image: undefined,
				imageLoaded: false,
				values: {}
			},
			isPrerenderedToggled: false
		});
	}

	onPrerenderedToggle() {

		this.setState({
			isPrerenderedToggled: !this.state.isPrerenderedToggled
		});

	}

	onLogoColorCheck(e, isChecked) {

		var color = (isChecked ? 'black' : 'white');

		this.setState({
			logo: {
				color: color,
				opacity: this.state.logo.opacity
			}
		})
	}

	onLogoOpacityChange = (event, value) => {
		
		this.setState({
			logo: {
				opacity: value,
				color: this.state.logo.color
			}
		});

	}

	onPlateColorCheck(e, isChecked) {

		var color = (isChecked ? 'black' : 'white');

		this.setState({
			plate: {
				color: color,
				opacity: this.state.plate.opacity
			}
		});

	}

	onPlateOpacityChange = (event, value) => {
		
		this.setState({
			plate: {
				opacity: value,
				color: this.state.plate.color
			}
		});

	}

	handleStylenameChange(e) {

		if (e.target.value.toLowerCase().indexOf('style name') !== -1) {
			this.setState({
				stylenameErrorText: 'Replace this text with the Style Name.',
				stylename: e.target.value,
				is_stylename_valid: false
			});
		} else if (e.target.value.length === 0) {
			this.setState({
				stylenameErrorText: 'This field is required.',
				stylename: e.target.value,
				is_stylename_valid: false
			});
		} else {
			this.setState({
				stylenameErrorText: '',
				stylename: e.target.value,
				is_stylename_valid: true
			});
		}

	}

	handleIGUsernameChange(e) {

		var checkForUsernameFormat = new RegExp('^[a-z0-9_-]{3,30}$');
		var username = e.target.value.split('@')[1];

		if (!checkForUsernameFormat.test(username)) {
			this.setState({
				ig_usernameErrorText: 'Invalid format: @your_ig_username',
				ig_username: '@' + username,
				is_ig_username_valid: false
			});
		} else if (e.target.value.toLowerCase().indexOf('ig_username') !== -1) {
			this.setState({
				ig_usernameErrorText: 'Replace this text with your IG username.',
				ig_username: e.target.value,
				is_ig_username_valid: false
			});
		} else if (e.target.value.length === 0) {
			this.setState({
				ig_usernameErrorText: 'This field is required.',
				ig_username: e.target.value,
				is_ig_username_valid: false
			});
		} else {
			this.setState({
				ig_usernameErrorText: '',
				ig_username: '@' + (username !== undefined ? username : e.target.value),
				is_ig_username_valid: true
			});
		}

	}

	clearInfo() {
		
		this.setState({
			stylename: 'Style Name',
			ig_username: '@ig_username',
			stylenameErrorText: '',
			ig_usernameErrorText: '',
			is_stylename_valid: false,
			is_ig_username_valid: false
		});
	}

	submit() {

		var params = {
			orig_photo_url: this.state.cloudinary.uploadedFileCloudinaryUrl,
			crop: this.state.cropper.values,
			logo: this.state.logo,
			plate: this.state.plate,
			stylename: this.state.stylename,
			ig_username: this.state.ig_username
		}

		console.log(params);
	}

	handleDialog(obj) {

		this.setState({
		  dialog: {
		    open: true
		  }
		});
	}

	handleSubmit() {

		let params = {
			orig_photo_url: this.state.cloudinary.uploadedFileCloudinaryUrl,
			crop: this.state.cropper.values,
			stylename: this.state.stylename,
			ig_username: this.state.ig_username,
		}

		if (!this.state.isPrerenderedToggled) {
			params.logo = this.state.logo;
			params.plate = this.state.plate;
		}

		console.log(params);

		const _this = this;

		$('.create-form-dialog').addClass('disabled');

		Services.hairpiqCreator.add(params).then(function(result) {

			console.log('A');
			console.log(result);

			$('.create-form-dialog').removeClass('disabled');

			_this.setFinished(true);
			_this.setState({
					snackbar: {
			        open: true,
			    }
		    });
			_this.handleClose();

		});

	}

	setFinished(bool) {
		
		this.setState({
			finished: bool
		});

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

	render() {

		const logoStyles = {
			opacity: this.state.logo.opacity
		}

		const plateStyles = {
			opacity: this.state.plate.opacity
		}

		const logo = (
	    	<RetinaImage
	    		className="create-form-logo"
	    		src={["/assets/images/hairpiq_creator/logo-" + this.state.logo.color + ".png", "/assets/images/hairpiq_creator/2x/logo-" + this.state.logo.color + ".png"] }
	    		style={logoStyles} />
	    );

	    const plate = (
	    	<div>
	    		<div className="create-form-plate-stylename">
	    			<p>{this.state.stylename}</p>
	    		</div>
	    		<div className="create-form-plate-ig_username">
	    			<p>{this.state.ig_username}</p>
	    		</div>
		    	<RetinaImage
		    		className="create-form-plate"
		    		src={["/assets/images/hairpiq_creator/plate-" + this.state.plate.color + ".png", "/assets/images/hairpiq_creator/2x/plate-" + this.state.plate.color + ".png"]}
		    		style={plateStyles} />
	    	</div>
	    );

	    const actions = [
	      <FlatButton
	        label="Cancel"
	        primary={true}
	        onTouchTap={this.handleClose}
	        onClick={this.handleClose}
	      />,
	      <FlatButton
	        label="Submit"
	        primary={true}
	        keyboardFocused={true}
	        onTouchTap={this.handleSubmit}
	        onClick={this.handleSubmit}
	      />,
	    ];

		return (

			<div className="create-form">
				
					
				<div className="left-col">
					
					{this.state.cropper.image !== undefined ?
					
					<div className="photo">
						<Paper zDepth={2}>
							{!this.state.isPrerenderedToggled ? logo : null}
							{!this.state.isPrerenderedToggled ? plate : null}
							<img className="cropped-image" src={this.state.cropper.image} alt=""/>
						</Paper>
					</div> :
					
					<div className="photo">
						{this.state.cloudinary.uploadedFileCloudinaryUrl !== '' || this.state.cloudinary.isUploading ? null :
						<Dropzone
							className="dropzone"
							multiple={false}
							accept="image/*"
							onDrop={this.onImageDrop}>
							<p>Drop a selfie image or click to select a file to upload.</p>
						</Dropzone>}
						
						{!this.state.cloudinary.isUploading ? null :
						<div className="loader">
					       <CircularProgress color={grey400} size={80} thickness={5} />
					    </div>}
						
						{this.state.cloudinary.uploadedFileCloudinaryUrl === '' ? null :
						<div>
				          <Paper className="cropper" zDepth={2}>
				          	<Cropper
				          		src={this.state.cloudinary.uploadedFileCloudinaryUrl}
				          		ref="cropper"
				          		rate={4 / 5}
				          		width={500}
				          		imageLoaded={() => this.onImageLoaded('image')}
				          		/>
				          </Paper>
				        </div>}
				    </div>
			    	}
				</div>
				
				<div className="right-col">

					<NavStepper
						
						uploadedFileCloudinaryUrl={this.state.cloudinary.uploadedFileCloudinaryUrl}
						isUploading={this.state.cloudinary.isUploading}
						
						imageLoaded={this.state.cropper.imageLoaded}
						image={this.state.cropper.image}
						cropImage={() => this.cropImage('image')}
						clearCrop={() => this.clearCrop()}
						clearImage={() => this.clearImage()}

						isPrerenderedToggled={this.state.isPrerenderedToggled}
						onPrerenderedToggle={this.onPrerenderedToggle}
						
						logoColor={this.state.logo.color}
						onLogoColorCheck={this.onLogoColorCheck}
						logoOpacity={this.state.logo.opacity}
						onLogoOpacityChange={this.onLogoOpacityChange}
						
						plateColor={this.state.plate.color}
						onPlateColorCheck={this.onPlateColorCheck}
						onPlateOpacityChange={this.onPlateOpacityChange}
						
						stylename={this.state.stylename}
						handleStylenameChange={this.handleStylenameChange}
						stylenameErrorText={this.state.stylenameErrorText}
						
						ig_username={this.state.ig_username}
						handleIGUsernameChange={this.handleIGUsernameChange}
						ig_usernameErrorText={this.state.ig_usernameErrorText}
						
						isValid={(this.state.is_stylename_valid && this.state.is_ig_username_valid)}
						clearInfo={this.clearInfo}
						handleDialog={() => this.handleDialog()}
						finished={this.state.finished}
						setFinished={this.setFinished}
					 />

				</div>

				<Dialog
		            title='ADD TO PENDING REQUESTS'
		            actions={actions}
		            modal={false}
		            open={this.state.dialog.open}
		            onRequestClose={this.handleClose}
		            actionsContainerClassName="create-form-dialog">
		            <p>Do you want to submit this hairpiq to the "Pending Requests" Section for team review?</p>
		        </Dialog>

		        <Snackbar
		          className="snackbar"
		          open={this.state.snackbar.open}
		          message="submitted!"
		          autoHideDuration={4000}
		          onRequestClose={this.closeSnackbar}
		        />

			</div>
		)
	}

}

export default CreateForm;