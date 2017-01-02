import React, { Component } from 'react';
import { render } from 'react-dom';
import SearchBar from '../partials/SearchBar';
import ResultsWell from '../partials/ResultsWell';
import Helmet from 'react-helmet';
import HeroSpace from '../partials/HeroSpace';

class Index extends Component {

  render() {

    return (
      <div>

        <Helmet
          defaultTitle="Hairpiq"
        />

        <HeroSpace />

        <div className="uk-grid uk-grid-margin">

          <div className="uk-width-medium-10-10">
        
            <ResultsWell
              term={this.props.params.term ? this.props.params.term : ''}
              location={this.props.location}
            />

          </div>
        
        </div>

      </div>
    );
  }
}

export default Index;
