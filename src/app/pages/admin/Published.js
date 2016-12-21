import React, { Component } from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import PublishedWell from '../../partials/admin/PublishedWell';

class Published extends Component {

  render() {

    return (
      <div>

        <Helmet
          title="Admin Area: Published Photos"
          titleTemplate="%s - Hairpiq"
          defaultTitle="Hairpiq"
        />

        <h1>Published</h1>

        <PublishedWell />

      </div>
    );
  }
}

export default Published;
