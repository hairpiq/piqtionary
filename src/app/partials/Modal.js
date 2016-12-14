import React, {Component} from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';

class Modal extends Component {

  render() {
    return (
      <div className='modal'>
        <p><Link to={this.props.returnTo}>Back</Link></p>
        {this.props.children}
      </div>
    )
  }
};

export default Modal;