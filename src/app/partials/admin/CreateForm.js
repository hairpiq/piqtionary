import React, { Component } from 'react';
import { render } from 'react-dom';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import {green600} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';

import Dropzone from 'react-dropzone';
import request from 'superagent';

import CircularProgress from 'material-ui/CircularProgress';
import {grey400} from 'material-ui/styles/colors';

const config = process.env;
const CLOUDINARY_UPLOAD_PRESET = 'tfxcaqia';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/' + config.CLOUDINARY_CLOUD_NAME + '/image/upload';


class CreateForm extends Component {

	constructor() {
		super();

		this.state = {
			uploadedFile: null,
			uploadedFileCloudinaryUrl: '',
			isUploading: false
		}
	}

	onImageDrop(files) {
		this.setState({
			uploadedFile: files[0],
			isUploading: true
		});

		this.handleImageUpload(files[0]);
	}

	handleImageUpload(file) {
		
		let upload = request.post(CLOUDINARY_UPLOAD_URL)
							.field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
							.field('file', file);

		upload.end((err, response) => {
			if (err) {
				console.error(err);
			}

			if (response.body.secure_url !== '') {
				console.log('response.body.secure_url: ' + response.body.secure_url);
				this.setState({
					uploadedFileCloudinaryUrl: response.body.secure_url,
					isUploading: false
				})
			}
		});
	}

	render() {
		return (
			<div className="create-form">
				<div className="uk-grid" data-uk-grid-match data-uk-grid-margin>
					
					<div className="uk-width-small-6-10">
						
						<div className="photo">
							{this.state.uploadedFileCloudinaryUrl !== '' || this.state.isUploading ? null :
							<Dropzone
								className="dropzone"
								multiple={false}
								accept="image/*"
								onDrop={this.onImageDrop.bind(this)}>
								<p>Drop an image or click to select a file to upload.</p>
							</Dropzone>}
							{!this.state.isUploading ? null :
							<div className="loader">
						       <CircularProgress color={grey400} size={80} thickness={5} />
						    </div>}
							{this.state.uploadedFileCloudinaryUrl === '' ? null :
							<div>
					          <Paper zDepth={2}><img src={this.state.uploadedFileCloudinaryUrl} /></Paper>
					        </div>}
						</div>

					</div>
					
					<div className="uk-width-small-4-10">
						
						<div className="data-container">
				            <TextField
				              id={'stylename-'}
				              hintText="Style Name here"
				              floatingLabelText="Style Name"
				              floatingLabelFixed={true}
				              fullWidth={true}
				              />
				            <TextField
				              id={'ig_username-'}
				              hintText="IG Username here"
				              floatingLabelText="IG Username"
				              floatingLabelFixed={true}
				              fullWidth={true}
				              />
				        </div>

				        <div className="data-container">

					        <RaisedButton
				                className="button create"
				                label="Create"
				                labelColor="#ffffff"
				                backgroundColor={green600}
				                fullWidth={true}
				                />
				        </div>

					</div>
				</div>
			</div>
		)
	}

}

export default CreateForm;