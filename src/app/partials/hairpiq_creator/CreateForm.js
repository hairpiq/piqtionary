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
import LinearProgress from 'material-ui/LinearProgress';

import Services from '../../services/';

require('dotenv').config();
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
				isUploading: false,
				valid: ''
			},
			cropper: {
				image: undefined,
            	imageLoaded: false,
            	values: {},
            	crop_type: ''
			},
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
			},
			isApplyToggled: true,
			download_url: ''
		}

		// Cropper methods
		this.onImageDrop = this.onImageDrop.bind(this);

		// NavStepper methods
		this.onApplyToggle = this.onApplyToggle.bind(this);
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

      	this.openNewWindow = this.openNewWindow.bind(this);

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

		const _this = this;
		
		let upload = request.post(CLOUDINARY_UPLOAD_URL)
							.field('upload_preset', config.CLOUDINARY_UPLOAD_PRESET)
							.field('file', file);

		upload.end((err, response) => {
			if (err) {
				console.error(err);
			}

			if (response.body.secure_url !== '') {

				let temp_url = response.body.secure_url;

				// if image is valid
					// set url
				// else
					// set state as invalid image

				var params = {
					orig_photo_url: temp_url
				}

				Services.hairpiqCreator.validate(params).then(function (result) {
					
					if (Boolean(result) === true) {

						_this.setState({
							cloudinary: {
								uploadedFileCloudinaryUrl: response.body.secure_url,
								isUploading: false,
								valid: 'valid'
							}
						});

					} else {

						const pieces = temp_url.split('/');
						params = {
							cloudinary_id: pieces[ pieces.length - 1].split('.')[0]
						}


						Services.hairpiqCreator.delete(params).then(function (result) {

							$('.modal-inner, .create-form').removeClass('disabled');

							_this.setState({
								cloudinary: {
									uploadedFileCloudinaryUrl: '',
									valid: 'invalid',
									isUploading: false
								}
							});

						});

					}

				});
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
		let crop_type = ($('.cropper img')[0].naturalWidth === 1080 && $('.cropper img')[0].naturalHeight === 1350 ? 'fill' : 'crop');

		var perc = $('.cropper img')[0].naturalWidth/$('.cropper').width();

		var scaledValues = {
			x: Math.round(croppedValues.x * perc),
			y: Math.round(croppedValues.y * perc),
			width: Math.round(croppedValues.width * perc),
			height: Math.round(croppedValues.height * perc)
		}

		this.setState({
			cropper: {
				image: croppedImage,
				imageLoaded: true,
				values: scaledValues,
				crop_type: crop_type
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

		//console.log('clear image on cloudinary, as well!');
		//console.log(this.state.uploadedFileCloudinaryUrl);

		this.setState({
			cloudinary: {
				uploadedFile: null,
				uploadedFileCloudinaryUrl: '',
				isUploading: false,
				valid: ''
			},
			cropper: {
				image: undefined,
				imageLoaded: false,
				values: {},
				crop_type: ''
			},
			isApplyToggled: true
		});
	}

	onApplyToggle() {

		this.setState({
			isApplyToggled: !this.state.isApplyToggled
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

		var checkForUsernameFormat = new RegExp('^[a-z0-9._-]{3,30}$');
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
			stylename: this.state.stylename,
			ig_username: this.state.ig_username,
			add_to_pending_requests: this.state.isApplyToggled,
		}

		params.options = JSON.stringify({
			crop_type: this.state.cropper.crop_type,
			crop_data: this.state.cropper.values,
			logo: this.state.logo,
			plate: this.state.plate,

		});

		const _this = this;

		$('.create-form-dialog').addClass('disabled');
		$('.progress-bar').addClass('show');

		Services.hairpiqCreator.render(params).then(function(result) {

			_this.openNewWindow(_this.proxyUrl(result.s3_url));

			$('.create-form-dialog').removeClass('disabled');
			$('.progress-bar').removeClass('show');

			_this.setFinished(true);
			_this.setState({
					download_url: _this.proxyUrl(result.s3_url), 
					snackbar: {
			        open: true,
			    }
		    });
			_this.handleClose();

		});

	}

	proxyUrl = (s3_url) => {

		if (s3_url)
			return '/h/' + s3_url.split('.com/')[1];
	}

	openNewWindow(url) {

		window.open(url, "_blank");

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
			<div>
		    	<RetinaImage
		    		className="create-form-logo"
		    		src={["/images/hairpiq_creator/logo-" + this.state.logo.color + ".png", "/images/hairpiq_creator/2x/logo-" + this.state.logo.color + ".png"] }
		    		style={logoStyles} />
		    	<RetinaImage
		    		className="create-form-mobile-logo"
		    		src={["/images/hairpiq_creator/mobile-logo-" + this.state.logo.color + ".png", "/images/hairpiq_creator/2x/mobile-logo-" + this.state.logo.color + ".png"] }
		    		style={logoStyles} />
	    	</div>
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
		    		src={["/images/hairpiq_creator/plate-" + this.state.plate.color + ".png", "/images/hairpiq_creator/2x/plate-" + this.state.plate.color + ".png"]}
		    		style={plateStyles} />
		    	<RetinaImage
		    		className="create-form-mobile-plate"
		    		src={["/images/hairpiq_creator/mobile-plate-" + this.state.plate.color + ".png", "/images/hairpiq_creator/2x/mobile-plate-" + this.state.plate.color + ".png"]}
		    		style={plateStyles} />
	    	</div>
	    );

	    const actions = [
	      <FlatButton
	        label="Cancel"
	        primary={true}
	        onTouchTap={this.handleClose}
	        onTouchTap={this.handleClose}
	      />,
	      <FlatButton
	        label="Submit"
	        primary={true}
	        keyboardFocused={true}
	        onTouchTap={this.handleSubmit}
	        onTouchTap={this.handleSubmit}
	      />,
	    ];

		return (

			<div className="create-form">
				
					
				<div className="left-col">

					{/*
						// if cropper image is set
							// show cropped image
					*/}
						
					
					{this.state.cropper.image !== undefined ?
					
					<div className="photo">
						<Paper zDepth={2}>
							{!this.state.isPrerenderedToggled ? logo : null}
							{!this.state.isPrerenderedToggled ? plate : null}
							<img className="cropped-image" src={this.state.cropper.image} alt=""/>
						</Paper>
					</div>
					
					:

					<div className="photo">

						{/*
							// if cloudinary image is NOT valid

						*/}


						{this.state.cloudinary.valid !== 'valid' ?

						<div>
						
							{/*
								// if cloudinary url is NOT set OR if image is NOT uploading
									// display dropzone area
							*/}

							{this.state.cloudinary.uploadedFileCloudinaryUrl !== '' || this.state.cloudinary.isUploading ? null :
							<Dropzone
								className="dropzone"
								multiple={false}
								accept="image/*"
								onDrop={this.onImageDrop}>
									<p>Drop a selfie or headshot image or click to select a file to upload.</p>
							</Dropzone>}

							{/*
								// if image is uploading
									// display loading graphic
							*/}
							
							{!this.state.cloudinary.isUploading ? null :
							<div className="loader">
						       <CircularProgress color={grey400} size={80} thickness={5} />
						    </div>}

					    </div>
					    
					    :

						<div>
							
							{/*
								// display cropper tool
							*/}

							<Paper className="cropper" zDepth={2}>
								<Cropper
									src={this.state.cloudinary.uploadedFileCloudinaryUrl}
									ref="cropper"
									rate={4 / 5}
									width={500}
									originX={100}
									originY={100}
									allowNewSelection={false}
									styles={{
	                                	modal: {
	                                     opacity: 0.70,
	                                     backgroundColor: '#000'
	                                	}
	                            	}}
									imageLoaded={() => this.onImageLoaded('image')}
									/>
							</Paper>

				        </div>
					    
					    }

				    </div>
			    	}
				</div>
				
				<div className="right-col">

					<NavStepper
						
						uploadedFileCloudinaryUrl={this.state.cloudinary.uploadedFileCloudinaryUrl}
						isUploading={this.state.cloudinary.isUploading}
						image_valid={this.state.cloudinary.valid}

						imageLoaded={this.state.cropper.imageLoaded}
						image={this.state.cropper.image}
						cropImage={() => this.cropImage('image')}
						clearCrop={() => this.clearCrop()}
						clearImage={() => this.clearImage()}

						isApplyToggled={this.state.isApplyToggled}
						onApplyToggle={this.onApplyToggle}
						
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

						download_url={this.state.download_url}
					 />

				</div>

				<Dialog
		            title='CREATE YOUR HAIRPIQ'
		            actions={actions}
		            modal={false}
		            open={this.state.dialog.open}
		            onRequestClose={this.handleClose}
		            actionsContainerClassName="create-form-dialog"
		            overlayClassName="main dialog-overlay">
		            <LinearProgress mode="indeterminate" className="progress-bar" />
		            <p>Click <strong>Submit</strong> to download your newly created hairpiq!</p>
		            {this.state.isApplyToggled ? 
		            <p>We are excited to review your creation and if approved, it will be featured on hairpiq.com, home to all the hairstyles you know and love.</p>
		        	: null }
		        </Dialog>

		        <Snackbar
		          className="snackbar"
		          open={this.state.snackbar.open}
		          message="created!"
		          autoHideDuration={4000}
		          onRequestClose={this.closeSnackbar}
		        />

			</div>
		)
	}

}

export default CreateForm;