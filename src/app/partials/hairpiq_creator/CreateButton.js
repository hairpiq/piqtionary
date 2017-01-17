import React, { Component } from 'react';
import { render } from 'react-dom';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ImageAddAPhoto from 'material-ui/svg-icons/image/add-a-photo';
import {orange700} from 'material-ui/styles/colors';
import {browserHistory} from 'react-router';

class CreateButton extends Component {

	linkTo(params) {

		if ($('body').width() < 768)
			browserHistory.push('/create');
		else
			browserHistory.push({
	            pathname: '/create',
	            state: {
	            	modal: true,
	            	returnTo: this.props.location.pathname
	            }
	        });

		// report step metric
		var test = {
		  hitType: 'event',
		  eventCategory: 'Hairpiq Creator',
		  eventAction: 'open-hairpiq-creator',
		  eventLabel: 'Open the Hairpiq Creator'
		};

		console.log(test);
		
		ga('send', test);
	}

	mobileLinkTo(route) {
		browserHistory.push('/create');
	}

	render() {

		return (
			<div>
				<FloatingActionButton
					onTouchTap={this.linkTo.bind(this)}
					backgroundColor={orange700}
					className="create-button"
					zDepth={5}>
		          <ImageAddAPhoto />
		        </FloatingActionButton>
		    </div>
		)
	}
}

export default CreateButton;