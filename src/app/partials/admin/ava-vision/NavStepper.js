import React, { Component } from 'react';
import { render } from 'react-dom';
import {green600, grey300, grey400} from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Toggle from 'material-ui/Toggle';
import Checkbox from 'material-ui/Checkbox';
import Slider from 'material-ui/Slider';
import {
  Step,
  Stepper,
  StepLabel,
  StepContent,
} from 'material-ui/Stepper';
import FontIcon from 'material-ui/FontIcon';

class NavStepper extends Component {
	constructor() {
		super();

		this.state = {
    		stepIndex: 0,
		}

		this.handleNext = this.handleNext.bind(this);
		this.handlePrev = this.handlePrev.bind(this);
		this.renderStepActions = this.renderStepActions.bind(this);

	}

	handleNext = () => {
		
		let {stepIndex} = this.state;
		
		if (stepIndex === 1 && this.props.isValid) {
			
			// if stepIndex is on final step (2) and data is valid
				// submit

			this.props.handleDialog();
		}

		if (stepIndex !== 1)
			this.setState({
			  stepIndex: stepIndex + 1,
			});

	};

	handlePrev = () => {
		
		let {stepIndex} = this.state;

		if (stepIndex > 0) {
		  this.setState({stepIndex: stepIndex - 1});
		}

	};

	renderStepActions(step) {
		const {stepIndex} = this.state;

		return (
		  <div style={{margin: '12px 0'}}>

		  	{stepIndex === 1 ?
		  		<RaisedButton
		  		  className="submit-button"
			      label="Train"
			      disableTouchRipple={true}
			      disableFocusRipple={true}
			      labelColor="#ffffff"
                  backgroundColor={green600}
			      disabled={!this.props.isValid || this.props.finished}
			      onTouchTap={this.handleNext}
			      style={{marginRight: 12}}
			    />
			:
		    <RaisedButton
		      label='Next'
		      disableTouchRipple={true}
		      disableFocusRipple={true}
		      primary={true}
		      onTouchTap={this.handleNext}
		      style={{marginRight: 12}}
		    />}

		    {step > 0 && (
		      <FlatButton
		        label="Back"
		        disabled={stepIndex === 0 || this.props.finished}
		        disableTouchRipple={true}
		        disableFocusRipple={true}
		        onTouchTap={this.handlePrev}
		      />
		    )}
		  </div>
		);
	}

	render() {

	    const {stepIndex} = this.state;
	    
	    const {
	    	tab_value,
	    	imageSelected,
	    	uploadedFileCloudinaryUrl,
	    	isUploading,
	    	image_valid,
	    	imageLoaded,
	    	image,
	    	logoColor,
	    	plateColor,
	    	finished,
	    } = this.props;

		const textfieldStyles = {
			marginLeft: '20px',
			width: '100%'
		};

		return (

			<div className="nav-stepper">
				<div>
			        <Stepper activeStep={stepIndex} orientation="vertical">
			          <Step>
			            <StepLabel>Add An Image</StepLabel>
			            <StepContent>
			            	<div>
				            	{uploadedFileCloudinaryUrl !== '' || isUploading || imageSelected ? null :

				            		<div>
							            {image_valid === '' ?

							            <div>
							            	{tab_value === 'grid' ?
											<p>
												In the left grid area, select a hairpiq.
											</p>
											:
											<p>
												In the outlined drop zone area, drop a selfie or headshot image or click to select a file to upload.
											</p>
											}
										</div>
										: null}

										{image_valid === 'invalid' ?
										<div className="uk-alert-danger">
											<p>Uh, oh. This photo seems to contain content that doesn't fit the requirements of our site. We focus exclusively on semi-close-up photos of people that have their hairstyle on display.</p>
											<p>In the outlined drop zone area, drop a selfie or headshot image or click to select a file to upload.</p>
										</div>
										: null}
									</div>

								}

					          	{!isUploading ? null :
								<p>
									loading...
								</p>}

								{imageLoaded ?
								<div>
									{image === undefined ?
									<div>
										<div className="uk-alert-warning">
											<p>
												Please crop your image very TIGHT TO THE SUBJECT'S HAIR.
											</p>
										</div>
										<FlatButton
											className="crop-button"
											backgroundColor={grey300}
											label="Crop"
											onTouchTap={this.props.cropImage}
											icon={<FontIcon className="material-icons">crop</FontIcon>}/>
										<FlatButton
											backgroundColor={grey300}
											label="Clear"
											onTouchTap={this.props.clearImage}
											icon={<FontIcon className="material-icons">layers_clear</FontIcon>}/>
									</div>
									:
									<div>
										<FlatButton
											className="adjust-crop-button"
											backgroundColor={grey300}
											label="Adjust Crop"
											onTouchTap={this.props.clearCrop}
											icon={<FontIcon className="material-icons">crop_free</FontIcon>}/>

										{this.renderStepActions(0)}

									</div>
									}
								</div>
								: null}

					        </div>
			            </StepContent>
			          </Step>
			          <Step>
			            <StepLabel>Add Info</StepLabel>
			            <StepContent>
			            	<div className="data-container textfields">
								<TextField
									style={textfieldStyles}
									hintText="Style Name"
									underlineShow={false}
									maxLength="25"
									defaultValue={this.props.stylename}
									value={this.props.stylename}
									errorText={this.props.stylenameErrorText}
						            onChange={this.props.handleStylenameChange}/>
								<Divider />
							</div>
			              {this.renderStepActions(1)}
			            </StepContent>
			          </Step>
			        </Stepper>
		        {finished && (
		          <p style={{margin: '20px 0', textAlign: 'center'}}>
		            <a
		              href="#"
		              onTouchTap={(event) => {
		                event.preventDefault();
		                this.props.clearImage();
		                this.props.clearInfo();
		                this.props.setFinished(false);
		                this.setState({stepIndex: 0});
		              }}
		            >
		              Click here
		            </a> to improve Vision some more.
		          </p>
		        )}
		      	</div>

		    </div>

		)
	}
}

export default NavStepper;