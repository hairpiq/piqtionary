import React, { Component } from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import EditForm from '../partials/hairtip_editor/EditForm';

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
		  $('.main-container').addClass('fixed-edit-hairpiq-form-width');

	}

	componentWillUnmount() {

		// if not rendered in modal
		  // remove fixed width from main-container
		if ($('.modal').length === 0)
		  $('.main-container').removeClass('fixed-edit-hairpiq-form-width');

	}

	render() {

	return (
	  
		<div>

			<Helmet
			  title="Edit a Hairtip"
			  titleTemplate="%s - Hairpiq"
			  defaultTitle="Hairpiq"
			/>

			<div className="intro">
				<h1>Create Your Own Hairtip</h1>
			</div>

			<EditForm data={this.props.hairpiq || this.state.data} />

		</div>

		)
	}
}

export default Hairtip;
