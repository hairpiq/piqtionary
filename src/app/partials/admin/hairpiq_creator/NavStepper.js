import React, { Component } from 'react';
import { render } from 'react-dom';
import {green600, grey300} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Toggle from 'material-ui/Toggle';
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
			finished: false,
    		stepIndex: 0
		}

		this.handleNext = this.handleNext.bind(this);
		this.handlePrev = this.handlePrev.bind(this);
		this.renderStepActions = this.renderStepActions.bind(this);

	}

	handleNext = () => {
		const {stepIndex} = this.state;
		this.setState({
		  stepIndex: stepIndex + 1,
		  finished: stepIndex >= 2,
		});
	};

	handlePrev = () => {
		const {stepIndex} = this.state;
		if (stepIndex > 0) {
		  this.setState({stepIndex: stepIndex - 1});
		}
	};

	renderStepActions(step) {
		const {stepIndex} = this.state;

		return (
		  <div style={{margin: '12px 0'}}>
		    <RaisedButton
		      label={stepIndex === 2 ? 'Finish' : 'Next'}
		      disableTouchRipple={true}
		      disableFocusRipple={true}
		      primary={true}
		      onTouchTap={this.handleNext}
		      style={{marginRight: 12}}
		    />
		    {step > 0 && (
		      <FlatButton
		        label="Back"
		        disabled={stepIndex === 0}
		        disableTouchRipple={true}
		        disableFocusRipple={true}
		        onTouchTap={this.handlePrev}
		      />
		    )}
		  </div>
		);
	}

	render() {

	    const {finished, stepIndex} = this.state;
	    
	    const {
	    	uploadedFileCloudinaryUrl,
	    	isUploading,
	    	imageLoaded,
	    	image
	    } = this.props;

		return (

			<div className="nav-stepper">
				<div style={{maxWidth: 380, maxHeight: 400, margin: 'auto'}}>
			        <Stepper activeStep={stepIndex} orientation="vertical">
			          <Step>
			            <StepLabel>Add An Image</StepLabel>
			            <StepContent>
			            	<div>
				            	{uploadedFileCloudinaryUrl !== '' || isUploading ? null :
								<p>
									In the left drop zone area, drop a selfie image or click to select a file to upload.
								</p>}

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
											onClick={this.props.cropImage}
											icon={<FontIcon className="material-icons">crop</FontIcon>}/>
										<FlatButton
											backgroundColor={grey300}
											label="Clear"
											onClick={this.props.clearImage}
											icon={<FontIcon className="material-icons">layers_clear</FontIcon>}/>
									</div>
									:
									<div>
										<FlatButton
											backgroundColor={grey300}
											label="Adjust Crop"
											onClick={this.props.clearCrop}
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
			            <StepLabel>Choose a Color</StepLabel>
			            <StepContent>
			              
			            	<Divider />
							<Subheader>Logo</Subheader>
							<div className="data-container no-padding-top">
								<Toggle
							      label="Color"
							      labelPosition="right"
							    />
							    <Slider defaultValue={0.5} />
						    </div>

			              {this.renderStepActions(1)}
			            </StepContent>
			          </Step>
			          <Step>
			            <StepLabel>Add Info</StepLabel>
			            <StepContent>
			              <p>
			                Try out different ad text to see what brings in the most customers,
			                and learn how to enhance your ads using features like ad extensions.
			                If you run into any problems with your ads, find out how to tell if
			                they're running and how to resolve approval issues.
			              </p>
			              {this.renderStepActions(2)}
			            </StepContent>
			          </Step>
			        </Stepper>
		        {finished && (
		          <p style={{margin: '20px 0', textAlign: 'center'}}>
		            <a
		              href="#"
		              onClick={(event) => {
		                event.preventDefault();
		                this.setState({stepIndex: 0, finished: false});
		              }}
		            >
		              Click here
		            </a> to reset the example.
		          </p>
		        )}
		      	</div>

		    </div>

		)
	}
}

export default NavStepper;