import React, { Component } from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import PublishedWell from '../../partials/admin/PublishedWell';
import FileCloudOff from 'material-ui/svg-icons/file/cloud-done';

class Published extends Component {

  render() {

    return (
      <div>

        <Helmet
          title="Admin Area: Published Photos"
          titleTemplate="%s - Hairpiq"
          defaultTitle="Hairpiq"
        />

        <div className="intro">
          <h1>Published</h1>
          <p>These hairpiqs are live!</p>
          <p>To unpublish one, hit the <strong>Cloud Off</strong> button ( <FileCloudOff /> ).</p>
        </div>

        <PublishedWell />

      </div>
    );
  }
}

export default Published;
