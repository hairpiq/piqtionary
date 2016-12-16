import React, {Component} from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import {orange700, grey100, grey300} from 'material-ui/styles/colors';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import ImageNavigateNext from 'material-ui/svg-icons/image/navigate-next';
import ImageNavigateBefore from 'material-ui/svg-icons/image/navigate-before';

class Modal extends Component {

  componentDidMount() {

    $('body, .create-button').addClass('modal-open');

  }

  componentWillUnmount() {

     $('body, .create-button').removeClass('modal-open');

  }

  render() {
    return (
      <div>
        <div className="modal-backdrop">
        </div>
        <div className='modal'>
        	<div className="close-modal-container">
          	<Link to={this.props.returnTo}>
              <IconButton className="close-modal">
                <NavigationClose />
              </IconButton>
            </Link>
          </div>
          <FlatButton
            className="button before"
            backgroundColor={grey300}
            hoverColor={grey100}
            icon={<ImageNavigateBefore />}
          />
          <FlatButton
            className="button next"
            backgroundColor={grey300}
            hoverColor={grey100}
            icon={<ImageNavigateNext />}
          />
          {this.props.children}
        </div>
      </div>
    )
  }
};

export default Modal;