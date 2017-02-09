import React, { Component } from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import EditForm from '../partials/hairtip_editor/EditForm';
import Services from '../services/';

class Hairtip extends Component {

	constructor() {
		super();

		this.state = {
		  data: {}
		}
	}

	proxyUrl = (s3_url) => {

		if (s3_url)
		  return '/h/' + s3_url.split('.com/')[1];

	}

	componentDidMount() {

		// if not rendered in modal
		  // fix the width of the layout
		if ($('.modal').length === 0)
		  $('.main-container').addClass('fixed-edit-hairtip-form-width');

		if (this.props.hairpiq === undefined) {

	      var _this = this;

	      // add id
	      var params = {
	        _id: this.props.params.id
	      }

	      Services.getById(params).then(function(result) {

	        _this.setState({ data: result[0]});

	      }).catch(function(error) {
	        console.log(error);
	      });

	    }

	}

	componentWillUnmount() {

		// if not rendered in modal
		  // remove fixed width from main-container
		if ($('.modal').length === 0)
		  $('.main-container').removeClass('fixed-edit-hairtip-form-width');

	}

	render() {

		let location = this.props.location

		return (
		  
			<div>

				<div>

					<Helmet
					  title="Edit a Hairtip"
					  titleTemplate="%s - Hairpiq"
					  defaultTitle="Hairpiq"
					/>

					<div className="intro">
						
						{ location.pathname.split('/')[1] === 'add-hairtip' ?
						
						<h1>Create Your Own Hairtip</h1>
						
						:

						<h1>Edit Your Hairtip</h1>

						}

					</div>

					<EditForm
						data={this.props.hairpiq || this.state.data}
						location={location}
						returnTo={this.props.returnTo}
					/>

				</div>

			</div>

			)
	}
}

export default Hairtip;
