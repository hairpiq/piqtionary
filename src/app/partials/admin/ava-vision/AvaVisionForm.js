import React, { Component } from 'react';
import { render } from 'react-dom';
import Paper from 'material-ui/Paper';

import Dropzone from 'react-dropzone';
import request from 'superagent';

import CircularProgress from 'material-ui/CircularProgress';
import {grey400} from 'material-ui/styles/colors';

import {Tabs, Tab} from 'material-ui/Tabs';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import ImageRemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';

import {Cropper} from 'react-image-cropper';

import NavStepper from './NavStepper';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import LinearProgress from 'material-ui/LinearProgress';

import Services from '../../../services/admin/';

require('dotenv').config();
const config = process.env;
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/' + config.CLOUDINARY_CLOUD_NAME + '/image/upload';

var RetinaImage = require('react-retina-image');

class AvaVisionForm extends Component {

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
			},
			hairpiqs: [],
			imageSelected: false,
			tabs: {
				tab_value: 'grid'
			},
			selectedImageUrl: '',
			selected_image_id: ''
		}

		// Cropper methods
		this.onImageDrop = this.onImageDrop.bind(this);
		this.onImageLoaded = this.onImageLoaded.bind(this);

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

		this.setGridList();
	}

	setGridList = () => {

		const _this = this;
		
		Services.getUntrained({}).then(function(result) {

			_this.setState({
				
				hairpiqs: result

			});
		});
	}

	componentWillUnmount() {

		$('.modal-inner').removeClass('fixed-create-form-width');

	}

	handleTabChange = (value) => {

		if ('grid')
			this.setGridList();
		
		this.setState({
			
			tabs: {
				tab_value: value,
			}

		});

	};

	setGridImageForCrop = (item) => {

		const proxy_url = '/h/' + item.s3_url.split('.com/')[1];

		this.setState({
			
			imageSelected: true,
			stylename: item.stylename,
			is_stylename_valid: true,
			selectedImageUrl: proxy_url,
			selectedImageIsUploading: true,
			selected_image_id: item._id

		});

	}


	onImageDrop(files) {

		$('.modal-inner, .train-form').addClass('disabled');
		
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

		$('.modal-inner, .train-form').removeClass('disabled');
		$('.cropper').removeClass('unloaded');

		this.setState({
			cropper: {
				[state + 'Loaded']: true,
			},
			selectedImageIsUploading: false
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
			},
		});

	}

	clearImage() {

		console.log('clear image on cloudinary, as well!');

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
				values: {}
			},
			isPrerenderedToggled: false,
			selectedImageUrl: '',
			imageSelected: false,
			selected_image_id: ''
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

	handleDialog(obj) {

		this.setState({
		  dialog: {
		    open: true
		  }
		});
	}

	handleSubmit() {

		let base64 = this.state.cropper.image.replace(/^data:image\/(.*);base64,/, '');

		let params = {
			base64: base64,
			stylename: this.state.stylename,
			id: this.state.selected_image_id
		}

		const _this = this;

		$('.train-form-dialog').addClass('disabled');
		$('.progress-bar').addClass('show');

		Services.hairpiqCreator.train(params).then(function(result) {

			$('.train-form-dialog').removeClass('disabled');
			$('.progress-bar').removeClass('show');

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
	    		src={["/images/hairpiq_creator/logo-" + this.state.logo.color + ".png", "/images/hairpiq_creator/2x/logo-" + this.state.logo.color + ".png"] }
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
		    		src={["/images/hairpiq_creator/plate-" + this.state.plate.color + ".png", "/images/hairpiq_creator/2x/plate-" + this.state.plate.color + ".png"]}
		    		style={plateStyles} />
	    	</div>
	    );

	    const gridStyles = {
		  root: {
		    display: 'flex',
		    flexWrap: 'wrap',
		    justifyContent: 'space-around',
		  },
		  gridList: {
		    width: 'auto',
		    maxHeight: 600,
		    overflowY: 'auto',
		  },
		};

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
	        onTouchTap={this.handleSubmit}
	      />,
	    ];

	    const tilesData = [];

		return (

			<div className="train-form">

				<div className="left-col">

					{/*
						// if cropper image is set
							// show cropped image
					*/}
						
					
					{this.state.cropper.image !== undefined ?
					
					<div className="photo cropped-image">
						<Paper zDepth={2}>
							<img src={this.state.cropper.image} alt=""/>
						</Paper>
					</div>
					
					:

					<Tabs
						className="train-tabs"
				        value={this.state.tabs.tab_value}
				        onChange={this.handleTabChange}>
						<Tab label="Select from Hairpiq" value="grid" >
						    
						    <div className="photo">

						    	{/*
									// if grid_image is NOT selected

								*/}

								{this.state.selectedImageUrl === '' ?

									<GridList
								      cellHeight={180}
								      style={gridStyles.gridList}>
								      
								      {this.state.hairpiqs.map((item) => (
								        <GridTile
								          key={item._id}
								          title={item.stylename}
								          actionIcon={<IconButton onTouchTap={() => this.setGridImageForCrop(item)}><ImageRemoveRedEye color="white" /></IconButton>}
								          >
								          <img src={item.s3_url} />
								        </GridTile>
								      ))}
								    </GridList>

							    :

							    <div>

							    	{/*
										// if image is uploading
											// display loading graphic
									*/}

						    		{!this.state.selectedImageIsUploading ? null : 
									
									<div className="loader">
								       <CircularProgress color={grey400} size={80} thickness={5} />
								    </div>}

									{/*
										// display grid cropper tool
									*/}

									<Paper className="cropper unloaded" zDepth={2}>

										<Cropper
											src={this.state.selectedImageUrl}
											ref="cropper"
											width={500}
											fixedRatio={false}
											allowNewSelection={false}
											styles={{
				                                 modal: {
				                                     opacity: 0.70,
				                                     backgroundColor: '#000'
				                                 },
				                                 dotInner: {
				                                     borderColor: '#ff0000'
				                                 },
				                                 dotInnerCenterVertical: {
				                                     backgroundColor: '#ff0000'
				                                 },
				                                 dotInnerCenterHorizontal: {
				                                     backgroundColor: '#ff0000'
				                                 }
				                             }}
											imageLoaded={() => this.onImageLoaded('image')}
											/>
									</Paper>

						        </div>

						    	}

						    </div>

						</Tab>
						<Tab label="Upload Image" value="dropzone">
						 	<div>
							    
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
											// display dropzone cropper tool
										*/}

										<Paper className="cropper" zDepth={2}>
											<Cropper
												src={this.state.cloudinary.uploadedFileCloudinaryUrl}
												ref="cropper"
												width={500}
												originX={100}
												originY={100}
												fixedRatio={false}
												allowNewSelection={false}
												styles={{
					                                 modal: {
					                                     opacity: 0.70,
					                                     backgroundColor: '#000'
					                                 },
					                                 dotInner: {
					                                     borderColor: '#ff0000'
					                                 },
					                                 dotInnerCenterVertical: {
					                                     backgroundColor: '#ff0000'
					                                 },
					                                 dotInnerCenterHorizontal: {
					                                     backgroundColor: '#ff0000'
					                                 }
					                             }}
												imageLoaded={() => this.onImageLoaded('image')}
												/>
										</Paper>

							        </div>
							    
							    	}

					    		</div>

						  	</div>
						</Tab>
					</Tabs>

			    	}

				</div>
				
				<div className="right-col">

					<NavStepper
						
						tab_value={this.state.tabs.tab_value}
						imageSelected={this.state.imageSelected}
						uploadedFileCloudinaryUrl={this.state.cloudinary.uploadedFileCloudinaryUrl}
						isUploading={this.state.cloudinary.isUploading}
						image_valid={this.state.cloudinary.valid}
						
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
						
						isValid={(this.state.is_stylename_valid)}
						clearInfo={this.clearInfo}
						handleDialog={() => this.handleDialog()}
						finished={this.state.finished}
						setFinished={this.setFinished}
					 />

				</div>

				<Dialog
		            title='IMPROVE AVA VISION'
		            actions={actions}
		            modal={false}
		            open={this.state.dialog.open}
		            onRequestClose={this.handleClose}
		            actionsContainerClassName="train-form-dialog"
		            overlayClassName="admin dialog-overlay">
		            <LinearProgress mode="indeterminate" className="progress-bar" />
		            <p>Do you want to submit this cropped hairstyle and stylename to Ava Vision?</p>
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

export default AvaVisionForm;