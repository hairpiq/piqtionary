import React, { Component } from 'react';
import { render } from 'react-dom';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {orange700} from 'material-ui/styles/colors';


class CreateButton extends Component {
	render() {
		return (
			<div>
				<FloatingActionButton backgroundColor={orange700} className="create-button">
		          <ContentAdd />
		        </FloatingActionButton>
			</div>
		)
	}
}

export default CreateButton;