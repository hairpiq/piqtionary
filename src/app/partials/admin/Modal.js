import React, { Component } from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

class Modal extends Component {

	constructor() {
		super();

		this.linkTo = this.linkTo.bind(this);
	}

	componentDidMount() {

		$('body').addClass('modal-open');
	}

	componentWillUnmount() {

		$('body').removeClass('modal-open');
	}

	linkTo(params) {
		browserHistory.push(params);
	}
	
	render() {
		
		return (

			<div>
				<div className="modal">
			        <div className='modal-inner'>
			        	<div className="close-button-container">
				        	<div className="close-button">
				              <IconButton
				              	className="close-modal"
				              	onTouchTap={() => this.linkTo(this.props.returnTo)}>
				                <NavigationClose />
				              </IconButton>
				            </div>
			            </div>
			            {this.props.children}
			        </div>
		        </div>
			</div>

		)
	}
}

export default Modal;