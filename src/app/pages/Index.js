import React, { Component } from 'react';
import { render } from 'react-dom';
import SearchBar from '../partials/SearchBar';
import ResultsWell from '../partials/ResultsWell';

const styles = {
  autoComplete: {
    width: '90%'
  }
}

class Index extends Component {

  handleUpdateInput = (value) => {
    this.setState({
      dataSource: [
        value,
        value + value,
        value + value + value,
      ],
    });
  };

  render() {

    return (
      <div>

        <div className="uk-grid uk-grid-margin">
            <div className="uk-width-medium-6-10 uk-push-2-10 margin-top-20">
              
              <SearchBar />

            </div>

        </div>

        <div className="uk-grid uk-grid-margin">

          <div className="uk-width-medium-10-10 margin-top-20">
        
            <ResultsWell />

          </div>
        
        </div>

      </div>
    );
  }
}

export default Index;
