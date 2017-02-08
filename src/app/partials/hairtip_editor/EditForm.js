import React, { Component } from 'react';
import { render } from 'react-dom';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {orange700} from 'material-ui/styles/colors';

class EditForm extends Component {

	constructor() {
		super()

		this.state = {
			hairtipTextErrorText: '',
			hairtipText: '',
			is_hairtip_valid: false
		}
	}

	proxyUrl = (s3_url) => {

		if (s3_url)
			return '/h/' + s3_url.split('.com/')[1];
	
	}

	submitHairtip() {

		console.log('A - Submit Hairtip')

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

	componentDidMount() {

		$('.modal-inner').addClass('fixed-edit-hairtip-form-width');

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

							<h2>Add a Hairtip</h2>

							<div>
								<TextField
								  id="hairtip-textfield"
								  floatingLabelText="What did you do to get this look?"
      							  floatingLabelFixed={true}
							      hintText="list your routine, products, and/or special tricks that make this look happen"
							      errorText={this.state.hairtipTextErrorText}
							      multiLine={true}
							      rows={4}
							      fullWidth={true}
							      onChange={this.handleHairtipTextChange}
							    /><br />
							</div>

							<FlatButton
							    	className={ this.state.is_hairtip_valid ? "submit-button " : "submit-button disabled"}
							    	label="Submit"
							    	backgroundColor={orange700}
							        hoverColor="#faba79"
						          	rippleColor="#ffffff"
						          	disabled={!this.state.is_hairtip_valid}
						          	onTouchTap={() => this.submitHairtip()}
							    />
						</div>

					</div>

				</div>

			</div>


		)
	}
}

export default EditForm;