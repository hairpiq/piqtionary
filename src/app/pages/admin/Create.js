import React, { Component } from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import CreateForm from '../../partials/admin/hairpiq_creator/CreateForm';

class Create extends Component {

  render() {

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
