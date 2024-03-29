import React, { Component } from 'react';
import { render } from 'react-dom';
import {green600, grey300, grey400, grey900, orange700} from 'material-ui/styles/colors';
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
		
		if (stepIndex === 2 && this.props.isValid) {
			
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
		      label="Next"
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

		const styles = {
			thumbSwitched: {
			    backgroundColor: grey900,
			},
		}

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
											In the outlined drop zone area, drop a selfie or headshot image or click to select a file to upload.
										</p>
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
							<div className="data-container">
				            	<Toggle
				            	  className="toggle"
							      label="apply to be featured on hairpiq.com and on our social media"
							      labelPosition="right"
							      thumbSwitchedStyle={styles.thumbSwitched}
							      onToggle={this.props.onApplyToggle}
								  defaultToggled={this.props.isApplyToggled}
							    />
						    </div>
			              {this.renderStepActions(2)}
			            </StepContent>
			          </Step>
			        </Stepper>
		        {finished && (

		        	<div>
		        		<a style={{margin: '20px 0 0 35px', textAlign: 'center'}}
		        			href={this.props.download_url}
		        			target="_blank"
		        			download
		        			>
		        		<FlatButton
							className="button download"
							label="Download Hairpiq"
							backgroundColor={orange700}
							hoverColor="#faba79"
					      	target="_blank"
					      	onTouchTap={() => {

					      		ga('send', {
								  hitType: 'event',
								  eventCategory: 'Hairpiq Creator',
								  eventAction: 'download',
								  eventLabel: 'Download Custom Hairpiq'
								});

					      	}}
					      	icon={<FontIcon color="#ffffff" className="icon-download" />}
						    />
						</a>
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
		          </div>
		        )}
		      	</div>

		    </div>

		)
	}
}

export default NavStepper;