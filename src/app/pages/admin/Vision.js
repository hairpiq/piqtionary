import React, { Component } from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import VisionForm from '../../partials/admin/vision/VisionForm';

class Train extends Component {

  constructor() {
    super();

    this.state = {};

  }

  componentDidMount() {

    // if not rendered in modal
      // fix the width of the layout
    if ($('.modal').length === 0)
      $('.main-container').addClass('fixed-train-form-width');

  }

   componentWillUnmount() {

    // if not rendered in modal
      // remove fixed width from main-container
    if ($('.modal').length === 0)
      $('.main-container').removeClass('fixed-train-form-width');

  }

  render() {

    return (
      <div>

        <Helmet
          title="Admin: Vision"
          titleTemplate="%s - Hairpiq"
          defaultTitle="Hairpiq"
        />

        <div className="intro">
          <h1>Hairpiq&reg; Vision</h1>
          <p>Use the below form to improve Hairpiq Vision.</p>
          <p>Use the crop tool to isolate only the hairstyle part of the photo.</p>
          <p>When complete, press the <strong>Submit</strong> button.</p>
        </div>

        <VisionForm
          data={this.state.data}
        />

      </div>
    );
  }
}

export default Train;
