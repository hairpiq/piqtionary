import React, { Component } from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import UnpublishedWell from '../../partials/admin/UnpublishedWell';

class Unpublished extends Component {

  render() {

    return (
      <div>

        <Helmet
          title="Admin Area: Unpublished Photos"
          titleTemplate="%s - Hairpiq"
          defaultTitle="Hairpiq"
        />

        <h1>Unpublished</h1>

        <UnpublishedWell />

      </div>
    );
  }
}

export default Unpublished;
