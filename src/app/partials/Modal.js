import React, {Component} from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';

class Modal extends Component {

  render() {
    return (
      <div className='modal'>
      	<div className="close-modal-container">
        	<p className="close-modal"><Link to={this.props.returnTo}>Back</Link></p>
        </div>
        {this.props.children}
      </div>
    )
  }
};

export default Modal;