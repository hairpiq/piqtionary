import React, { Component } from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

class Review extends Component {

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

export default Review;
