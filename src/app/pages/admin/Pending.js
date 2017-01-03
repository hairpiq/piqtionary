import React, { Component } from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import PendingWell from '../../partials/admin/PendingWell';
import ActionDelete from 'material-ui/svg-icons/action/delete';

class Pending extends Component {

  render() {

    return (
      <div>

        <Helmet
          title="Admin: Pending Requests"
          titleTemplate="%s - Hairpiq"
          defaultTitle="Hairpiq"
        />

        <div className="intro">
          <h1>Pending Requests</h1>
          <p>These are hairpiqs received from the team, and our users.</p>
          <p>To edit it's stylename and/or ig username, update it's text field(s), then hit the <strong>Update</strong> button.</p>
          <p>When you are satisfied with it, hit the <strong>Approve</strong> button.</p>
          <p>To move to trash, hit the <strong>Trash</strong> button (<ActionDelete />).</p>
        </div>

        <PendingWell />

      </div>
    );
  }
}

export default Pending;
