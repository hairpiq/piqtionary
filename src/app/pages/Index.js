import React, { Component } from 'react';
import { render } from 'react-dom';
import SearchBar from '../partials/SearchBar';
import ResultsWell from '../partials/ResultsWell';
import Helmet from 'react-helmet';
import HeroSpace from '../partials/HeroSpace';

class Index extends Component {

  constructor() {
    super();

    this.state = {
      is_logged_in: false
    }

  }

  componentDidMount() {

    this.setState({
      is_logged_in: this.props.route.auth.loggedIn()
    });

  }

  render() {

    console.log('A');
    console.log('is_logged_in: ' + this.state.is_logged_in);

    return (
      <div>

        <Helmet
          defaultTitle="Hairpiq"
        />

        {this.props.location.pathname === '/' ?
        <HeroSpace />
        :
        <div className="no-hero-space" />
        }

        <div className="uk-grid">

          <div className="uk-width-medium-10-10">
        
            <ResultsWell
              term={this.props.location.query.q ? this.props.location.query.q : ''}
              location={this.props.location}
            />

          </div>
        
        </div>

      </div>
    );
  }
}

export default Index;
