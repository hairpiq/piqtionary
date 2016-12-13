import React, { Component } from 'react';
import { render } from 'react-dom';
import SearchBar from '../partials/SearchBar';
import ResultsWell from '../partials/ResultsWell';
import Helmet from 'react-helmet';
import CreateAHairpiqButton from '../partials/CreateAHairpiqButton';

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

    console.log('A');
    console.log(this.props.params.term);

    var term = '';
    if(this.props.params.term !== undefined)
      term = this.props.params.term;

    return (
      <div>

        <Helmet
          defaultTitle="Hairpiq"
        />

        <div className="uk-grid uk-grid-margin uk-grid-collapse">
            <div className="uk-width-medium-6-10 uk-push-2-10">
              
              <SearchBar
                term={term}
              />

            </div>

        </div>

        <div className="uk-grid uk-grid-margin">

          <div className="uk-width-medium-10-10">
        
            <ResultsWell
              term={term}
            />

          </div>
        
        </div>

        <CreateAHairpiqButton />

      </div>
    );
  }
}

export default Index;
