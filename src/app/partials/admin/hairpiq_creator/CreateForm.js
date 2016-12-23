import React, { Component } from 'react';
import { render } from 'react-dom';
import Paper from 'material-ui/Paper';

import Dropzone from 'react-dropzone';
import request from 'superagent';

import CircularProgress from 'material-ui/CircularProgress';
import {grey400} from 'material-ui/styles/colors';

import {Cropper} from 'react-image-cropper';

import FlatButton from 'material-ui/FlatButton';
import {green600, grey300} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import NavStepper from './NavStepper';

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
			},
			finished: false,
    		stepIndex: 0
		}

		// cropper methods
		this.onImageDrop = this.onImageDrop.bind(this);
		this.onImageLoaded = this.onImageLoaded.bind(this);
		this.cropImage = this.cropImage.bind(this);
		this.clearCrop = this.clearCrop.bind(this);

	}

	componentDidMount() {

		$('.modal-inner').addClass('fixed-create-form-width');
	}

	componentWillUnmount() {

		$('.modal-inner').removeClass('fixed-create-form-width');
	}

	onImageDrop(files) {
		
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
				console.log('response.body.secure_url: ' + response.body.secure_url);
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

		this.setState({
			cropper: {
				[state + 'Loaded']: true
			}
		});

	}

	cropImage(state) {

		let croppedImage = this.refs.cropper.crop();
		
		this.setState({
			cropper: {
				image: croppedImage,
				imageLoaded: true
			}
		});

	}

	clearCrop() {

		this.setState({
			cropper: {
				image: undefined
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
			}
		});
	}

	render() {

		const logo = (
	    	<RetinaImage className="create-form-logo" src={["/assets/images/hairpiq_creator/logo-white.png", "/assets/images/hairpiq_creator/2x/logo-white.png"]} />
	    );

	    const plate = (
	    	<RetinaImage className="create-form-plate" src={["/assets/images/hairpiq_creator/plate-white.png", "/assets/images/hairpiq_creator/2x/plate-white.png"]} />
	    );

		return (
			<div className="create-form">
				
					
				<div className="left-col">
					
					{this.state.cropper.image !== undefined ?
					
					<div className="photo">
						<Paper zDepth={2}>
							{logo}
							{plate}
							<img src={this.state.cropper.image} alt=""/>
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
				          <Paper zDepth={2}>
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
					 />

				</div>

			</div>
		)
	}

}

export default CreateForm;