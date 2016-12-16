import React, { Component } from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

class Review extends Component {

  render() {

    return (
      <div>

        <Helmet
          title="Admin Area: Review Queue"
          titleTemplate="%s - Hairpiq"
          defaultTitle="Hairpiq"
        />

        <div className="uk-grid uk-grid-margin">

          <div className="uk-width-medium-10-10">
        
            Review Queue

          </div>
        
        </div>

      </div>
    );
  }
}

export default Review;
