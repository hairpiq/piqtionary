import React, { Component } from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

class Modal extends Component {

	componentDidMount() {

		$('body').addClass('modal-open');
	}

	componentWillUnmount() {

		$('body').removeClass('modal-open');
	}
	
	render() {
		
		return (

			<div>
				<div className="modal">
			        <div className='modal-inner'>
			        	<div className="close-button-container">
				        	<Link className="close-button" to={this.props.returnTo}>
				              <IconButton className="close-modal">
				                <NavigationClose />
				              </IconButton>
				            </Link>
			            </div>
			            {this.props.children}
			        </div>
		        </div>
			</div>

		)
	}
}

export default Modal;