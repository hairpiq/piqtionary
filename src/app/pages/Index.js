import React, { Component } from 'react';
import { render } from 'react-dom';
import SearchBar from '../partials/SearchBar';
import ResultsWell from '../partials/ResultsWell';
import Helmet from 'react-helmet';
import CreateAHairpiqButton from '../partials/CreateAHairpiqButton';


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

        <Helmet
          defaultTitle="Hairpiq"
        />

        <div className="uk-grid uk-grid-margin uk-grid-collapse">
            <div className="uk-width-medium-6-10 uk-push-2-10 margin-top-20">
              
              <SearchBar />

            </div>

        </div>

        <div className="uk-grid uk-grid-margin">

          <div className="uk-width-medium-10-10 margin-top-20">
        
            <ResultsWell />

          </div>
        
        </div>

        <CreateAHairpiqButton />

      </div>
    );
  }
}

export default Index;