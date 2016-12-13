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

  constructor() {
    super();

    this.state = {
      keyword : ''
    }

  }

  updateKeyword(keyword) {

    this.setState({
      keyword: keyword
    })

  }

  render() {

    return (
      <div>

        <Helmet
          defaultTitle="Hairpiq"
        />

        <div className="uk-grid uk-grid-margin uk-grid-collapse">
            <div className="uk-width-medium-6-10 uk-push-2-10">
              
              <SearchBar
                updateKeyword={this.updateKeyword.bind(this)}
              />

            </div>

        </div>

        <div className="uk-grid uk-grid-margin">

          <div className="uk-width-medium-10-10">
        
            <ResultsWell
              keyword={this.state.keyword}
            />

          </div>
        
        </div>

        <CreateAHairpiqButton />

      </div>
    );
  }
}

export default Index;
