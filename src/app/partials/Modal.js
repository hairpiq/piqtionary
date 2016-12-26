import React, { Component } from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import {grey100, grey300} from 'material-ui/styles/colors';
import ImageNavigateNext from 'material-ui/svg-icons/image/navigate-next';
import ImageNavigateBefore from 'material-ui/svg-icons/image/navigate-before';

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

	    }

	    function renderBeforeLink() {
			if (before_id.length > 0)
			  return (

			      <FlatButton
			        className="button before"
			        onTouchTap={() => this.linkTo({
				        pathname: `/p/${before_id}`,
				        state: state
				    })}
			        backgroundColor={grey300}
			        hoverColor={grey100}
			        icon={<ImageNavigateBefore />}
			      />

			  );
		}

		function renderNextLink() {
			if (next_id.length > 0)
			  return (

			      <FlatButton
			        className="button next"
			        onTouchTap={() => this.linkTo({
				        pathname: `/p/${next_id}`,
				        state: state
				    })}
			        backgroundColor={grey300}
			        hoverColor={grey100}
			        icon={<ImageNavigateNext />}
			      />

			  );
		}
		
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
				        {this.props.hairpiqs !== undefined ?
				        	<div>
				        		<div className='nav'>
						        	{renderBeforeLink()}
						        	{renderNextLink()}
						        </div>
				        		{React.cloneElement(this.props.children, { hairpiq: current_hairpiq })}
				        	</div>
				        : 	
				        	this.props.children}
			        </div>
		        </div>
			</div>

		)
	}
}

export default Modal;