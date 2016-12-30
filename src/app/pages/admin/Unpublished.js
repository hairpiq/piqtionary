import React, { Component } from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import UnpublishedWell from '../../partials/admin/UnpublishedWell';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import FileCloudDone from 'material-ui/svg-icons/file/cloud-done';

class Unpublished extends Component {

  render() {

    return (
      <div>

        <Helmet
          title="Admin: Unpublished"
          titleTemplate="%s - Hairpiq"
          defaultTitle="Hairpiq"
        />

        <div className="intro">
          <h1>Unpublished</h1>
          <p>Hairpiqs that are approved but not live on the site yet.</p>
          <p>To publish one, hit the <strong>Cloud On</strong> button ( <FileCloudDone /> ). To move to trash, hit the <strong>Trash</strong> button (<ActionDelete />).</p>
        </div>

        <UnpublishedWell />

      </div>
    );
  }
}

export default Unpublished;
