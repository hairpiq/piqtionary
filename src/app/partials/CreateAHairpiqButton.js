import React, { Component } from 'react';
import { render } from 'react-dom';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {orange700} from 'material-ui/styles/colors';


class CreateAHairpiqButton extends Component {
	render() {
		return (
			<div>
				<FloatingActionButton backgroundColor={orange700} className="button-create-a-hairpiq">
		          <ContentAdd />
		        </FloatingActionButton>
			</div>
		)
	}
}

export default CreateAHairpiqButton;