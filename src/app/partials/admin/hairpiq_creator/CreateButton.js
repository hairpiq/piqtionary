import React, { Component } from 'react';
import { render } from 'react-dom';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ImageAddAPhoto from 'material-ui/svg-icons/image/add-a-photo';
import {grey900} from 'material-ui/styles/colors';
import {browserHistory} from 'react-router';

class CreateButton extends Component {

	linkTo(params) {
		browserHistory.push({
            pathname: '/admin/create',
            state: {
            	modal: true,
            	returnTo: this.props.location.pathname
            }
        });
	}

	render() {

		return (
			<div>
			
					<FloatingActionButton
						onTouchTap={this.linkTo.bind(this)}
						backgroundColor={grey900}
						className="create-button"
						zDepth={5}>
			          <ImageAddAPhoto />
			        </FloatingActionButton>
			</div>
		)
	}
}

export default CreateButton;