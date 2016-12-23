var config = process.env;
import React, { Component } from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import CreateForm from '../../partials/admin/CreateForm';

class Create extends Component {

  render() {

    const phone_number = config.TWILIO_PHONE_NUMBER;

    return (
      <div>

        <Helmet
          title="Admin Area: Create a Hairpiq"
          titleTemplate="%s - Hairpiq"
          defaultTitle="Hairpiq"
        />

        <CreateForm />

      </div>
    );
  }
}

export default Create;
