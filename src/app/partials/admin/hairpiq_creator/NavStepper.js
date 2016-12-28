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
		
		if (stepIndex === 0 && this.props.isPrerenderedToggled) {
			
			// if step index is on first step (0) and image is pre-rendered
				// skip step 2

			stepIndex = stepIndex + 1;

		} else if (stepIndex === 2 && this.props.isValid) {
			
			// if stepIndex is on final step (2) and data is valid
				// submit

			this.props.handleDialog();
		}

		if (stepIndex !== 2)
			this.setState({
			  stepIndex: stepIndex + 1,
			});

	};

	handlePrev = () => {
		
		let {stepIndex} = this.state;

		// if step index is on the last step (2) and image is pre-rendered
			// skip step 2

		if (stepIndex === 2 && this.props.isPrerenderedToggled)
			stepIndex = stepIndex - 1;

		if (stepIndex > 0) {
		  this.setState({stepIndex: stepIndex - 1});
		}

	};

	renderStepActions(step) {
		const {stepIndex} = this.state;

		return (
		  <div style={{margin: '12px 0'}}>

		  	{stepIndex === 2 ?
		  		<RaisedButton
		  		  className="submit-button"
			      label="Create"
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
		      label={stepIndex === 0 && this.props.isPrerenderedToggled ? 'Add Info' : 'Next'}
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
	    	uploadedFileCloudinaryUrl,
	    	isUploading,
	    	image_valid,
	    	imageLoaded,
	    	image,
	    	logoColor,
	    	plateColor,
	    	finished
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
				            	{uploadedFileCloudinaryUrl !== '' || isUploading ? null :

				            		<div>
							            {image_valid === '' ?
										<p>
											In the left drop zone area, drop a selfie image or click to select a file to upload.
										</p>
										: null}

										{image_valid === 'invalid' ?
										<div className="uk-alert-danger">
											<p>Please upload a more appropriate photo. We focus exclusively on semi-close-up photos of people that have their hairstyle on display.</p>
											<p>In the left drop zone area, drop a selfie image or click to select a file to upload.</p>
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
										<p>
											Please crop your image into the Hairpiq Portrait format.
										</p>
										<FlatButton
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
											className="crop-button"
											backgroundColor={grey300}
											label="Adjust Crop"
											onTouchTap={this.props.clearCrop}
											icon={<FontIcon className="material-icons">crop_free</FontIcon>}/>

										<div className="data-container">
							            	<Toggle
							            	  className="toggle"
										      label="Is this Hairpiq pre-rendered?"
										      labelPosition="right"
										      onToggle={this.props.onPrerenderedToggle}
										      defaultToggled={this.props.isPrerenderedToggled}
										    />
									    </div>

										{this.renderStepActions(0)}

									</div>
									}
								</div>
								: null}

					        </div>
			            </StepContent>
			          </Step>
			          <Step>
			            <StepLabel>Customize Colors</StepLabel>
			            <StepContent>
			              
							<Subheader>Logo</Subheader>

							<div className="data-container">
								<Checkbox
									className="checkbox"
									checkedIcon={<FontIcon className="material-icons">invert_colors</FontIcon>}
									uncheckedIcon={<FontIcon color={grey400} className="material-icons">invert_colors</FontIcon>}
									label={logoColor}
									onCheck={this.props.onLogoColorCheck}
							    />
							    <Slider
							    	min={0.3}
							    	defaultValue={0.5}
							    	value={this.props.logoOpacity}
          							onChange={this.props.onLogoOpacityChange}
							    />
						    </div>

						    <Subheader>Plate</Subheader>

							<div className="data-container">
								<Checkbox
									className="checkbox"
									checkedIcon={<FontIcon className="material-icons">invert_colors</FontIcon>}
									uncheckedIcon={<FontIcon color={grey400} className="material-icons">invert_colors</FontIcon>}
									label={plateColor}
									onCheck={this.props.onPlateColorCheck}
									defaultChecked={true}
							    />
							    <Slider
							    	min={0.3}
							    	max={0.7}
							    	defaultValue={0.5}
							    	value={this.props.plateOpacity}
          							onChange={this.props.onPlateOpacityChange}
							    />
						    </div>

			              {this.renderStepActions(1)}
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
								<TextField
									style={textfieldStyles}
									hintText="IG Username"
									underlineShow={false}
									maxLength="31"
									defaultValue={this.props.ig_username}
									value={this.props.ig_username}
									errorText={this.props.ig_usernameErrorText}
						            onChange={this.props.handleIGUsernameChange}/>
								<Divider />
							</div>
			              {this.renderStepActions(2)}
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
		            </a> to create a new hairpiq.
		          </p>
		        )}
		      	</div>

		    </div>

		)
	}
}

export default NavStepper;