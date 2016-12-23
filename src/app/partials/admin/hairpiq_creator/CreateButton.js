import React, { Component } from 'react';
import { render } from 'react-dom';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {orange700} from 'material-ui/styles/colors';
import { Link } from 'react-router';

class CreateButton extends Component {
	render() {
		return (
			<div>
				<Link to={{
                pathname: '/admin/create',
                state: { modal: true, returnTo: this.props.location.pathname }
              }}>
					<FloatingActionButton backgroundColor={orange700} className="create-button">
			          <ContentAdd />
			        </FloatingActionButton>
		        </Link>
			</div>
		)
	}
}

export default CreateButton;