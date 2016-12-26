import React, { Component } from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import CreateForm from '../partials/hairpiq_creator/CreateForm';

class Create extends Component {

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
          title="Create a Hairpiq"
          titleTemplate="%s - Hairpiq"
          defaultTitle="Hairpiq"
        />

        <div className="intro">
          <h1>Create Your Own Hairpiq</h1>
          <p>Use the below form to create a hairpiq.</p>
          <p>Just follow the instructions and enjoy.</p>
          <p>You can create a hairpiq for yourself, and <strong>if you'd like your hairpiq to be featured by us, just select the option to apply in the form</strong>.</p>
        </div>

        <CreateForm />

      </div>
    );
  }
}

export default Create;
