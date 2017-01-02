import React, { Component } from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import AvaVisionForm from '../../partials/admin/ava-vision/AvaVisionForm';
import ImageRemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';

class AvaVision extends Component {

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
          title="Admin: Ava Vision"
          titleTemplate="%s - Hairpiq"
          defaultTitle="Hairpiq"
        />

        <div className="intro">
          <h1>Hairpiq&reg; Ava Vision <ImageRemoveRedEye className="ava-vision-icon" color="#555555"/></h1>
          <p>Use the below form to improve Ava Vision!</p>
          <p>Use the crop tool to isolate only the hairstyle part of the photo.</p>
          <p>When complete, press the <strong>Submit</strong> button.</p>
        </div>

        <AvaVisionForm
          data={this.state.data}
        />

      </div>
    );
  }
}

export default AvaVision;
