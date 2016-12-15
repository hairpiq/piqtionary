import React, {Component} from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

class Modal extends Component {

  componentDidMount() {

    $('body, .create-button').addClass('modal-open');

  }

  componentWillUnmount() {

     $('body, .create-button').removeClass('modal-open');

  }

  render() {
    return (
      <div className='modal'>
      	<div className="close-modal-container">
        	<Link to={this.props.returnTo}>
            <IconButton className="close-modal">
              <NavigationClose />
            </IconButton>
          </Link>

        </div>
        {this.props.children}
      </div>
    )
  }
};

export default Modal;