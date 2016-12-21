import React, { Component } from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import PendingWell from '../../partials/admin/PendingWell';

class Pending extends Component {

  render() {

    return (
      <div>

        <Helmet
          title="Admin Area: Pending Requests"
          titleTemplate="%s - Hairpiq"
          defaultTitle="Hairpiq"
        />

        <h1>Pending Requests</h1>

        <PendingWell />

      </div>
    );
  }
}

export default Pending;
