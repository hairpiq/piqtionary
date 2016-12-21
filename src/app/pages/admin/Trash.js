import React, { Component } from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';

class Trash extends Component {

  render() {

    return (
      <div>

        <Helmet
          title="Admin Area: Trash"
          titleTemplate="%s - Hairpiq"
          defaultTitle="Hairpiq"
        />

        <h1>Trash</h1>

      </div>
    );
  }
}

export default Trash;
