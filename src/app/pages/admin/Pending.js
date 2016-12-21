import React, { Component } from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import PendingWell from '../../partials/admin/PendingWell';
import NotificationMMS from 'material-ui/svg-icons/notification/mms';
import {orange700, green600} from 'material-ui/styles/colors';

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

        <PendingWell
          location={this.props.location}
        />

      </div>
    );
  }
}

export default Pending;
