import React, { Component } from 'react';
import { render } from 'react-dom';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ImageAddAPhoto from 'material-ui/svg-icons/image/add-a-photo';
import {orange700} from 'material-ui/styles/colors';
import {browserHistory} from 'react-router';
import Snackbar from 'material-ui/Snackbar';

class CreateButton extends Component {

	constructor() {
		super()

		this.state = {
			snackbar: {
	            open: false,
	            message: ''
	        },
		}
	}

	linkTo(params) {

		if (this.props.is_logged_in) {

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
			
			ga('send', test);

		} else {

	      this.setState({
	        snackbar: {
	            open: true,
	            message: 'Log in to use the Hairpiq Creator!'
	        }
	      })
		}
	}

	mobileLinkTo(route) {
		browserHistory.push('/create');
	}

	closeSnackbar = () => {
	    this.setState({
	        snackbar: { 
	        	open: false
	  		}
		});
	};

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

		         <Snackbar
		          className="snackbar"
		          open={this.state.snackbar.open}
		          message={this.state.snackbar.message}
		          autoHideDuration={4000}
		          onRequestClose={this.closeSnackbar}
		        />

		    </div>
		)
	}
}

export default CreateButton;