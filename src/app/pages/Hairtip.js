import React, { Component } from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import EditForm from '../partials/hairtip_editor/EditForm';

class Hairtip extends Component {

  componentDidMount() {

    // if not rendered in modal
      // fix the width of the layout
    if ($('.modal').length === 0)
      $('.main-container').addClass('fixed-create-form-width');

  }

  componentWillUnmount() {

    // if not rendered in modal
      // remove fixed width from main-container
    if ($('.modal').length === 0)
      $('.main-container').removeClass('fixed-create-form-width');

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
			<p>Help other Hairpiqers save time, money and hassle by listing your routine, products, and/or special tricks that make this happen.</p>
        </div>

        <EditForm />

      </div>
    );
  }
}

export default Hairtip;
