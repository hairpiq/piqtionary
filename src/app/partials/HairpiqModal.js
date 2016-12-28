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

    if (this.props.hairpiqs !== undefined) {

      const curent_id = this.props.pathname.split('/')[2];

      var current_hairpiq = {}
      var before_id = '';
      var next_id = '';

      for (var i = 0; i < this.props.hairpiqs.length; i++) {
        if (curent_id  === this.props.hairpiqs[i]._id) {

          current_hairpiq = this.props.hairpiqs[i];

          if (this.props.hairpiqs[i - 1] !== undefined)
            before_id = this.props.hairpiqs[i - 1]._id;

          if (this.props.hairpiqs[i + 1] !== undefined)
            next_id = this.props.hairpiqs[i + 1]._id;

          break;
        }
      }

      const state = { modal: true, returnTo: '/', hairpiqs: this.props.hairpiqs };

      function renderBeforeLink() {
        if (before_id.length > 0)
          return (

            <Link to={{
                  pathname: `/p/${before_id}`,
                  state: state
            }}>
              <FlatButton
                className="button before"
                backgroundColor={grey300}
                hoverColor={grey100}
                icon={<ImageNavigateBefore />}
              />
            </Link>

          );
      }

      function renderNextLink() {
        if (next_id.length > 0)
          return (

            <Link to={{
                  pathname: `/p/${next_id}`,
                  state: state
            }}>
              <FlatButton
                className="button next"
                backgroundColor={grey300}
                hoverColor={grey100}
                icon={<ImageNavigateNext />}
              />
            </Link>

          );
      }

    }

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
          <div className='nav'>
            {renderBeforeLink()}
            {renderNextLink()}
          </div>
          {React.cloneElement(this.props.children, { hairpiq: current_hairpiq })}
        </div>
      </div>
    )
  }
};

export default Modal;