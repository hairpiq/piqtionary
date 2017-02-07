import React, { Component } from 'react';
import { render } from 'react-dom';
import TextField from 'material-ui/TextField';

class EditForm extends Component {

	componentDidMount() {

		$('.modal-inner').addClass('fixed-edit-hairtip-form-width');

	}

	render() {

		return (

			<div className="edit-hairtip-form">
				
					
				<div className="left-col">

				photo

				</div>

				<div className="right-col">

				<p>What do you do to get the look?</p>

				<div>
					<TextField
				      hintText="Message Field"
				      errorText="This field is required."
				      floatingLabelText=""
				      floatingLabelFixed={true}
				      multiLine={true}
				      rows={2}
				    /><br />
				</div>

				</div>

			</div>


		)
	}
}

export default EditForm;