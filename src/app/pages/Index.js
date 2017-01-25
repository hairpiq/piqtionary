import React, { Component } from 'react';
import { render } from 'react-dom';
import ResultsWell from '../partials/ResultsWell';
import Helmet from 'react-helmet';
import HeroSpace from '../partials/HeroSpace';
import LoginForm from '../partials/LoginForm';
import SiteFooter from '../partials/SiteFooter';

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

    let {is_logged_in} = this.state;

    const home_layout = (

      <div>

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

    )

    return (
      <div>

        <Helmet
          defaultTitle="Hairpiq"
        />

        {is_logged_in ?

          {home_layout} 
        
        :

        <div className="splash-page">
          <div className="uk-grid">

            <div className="uk-width-medium-1-5 uk-push-1-5">
              Photo Strip
            </div>

            <div className="uk-width-medium-2-5 uk-push-1-5">
              
              <LoginForm />

              <SiteFooter />

            </div>

          </div>
        </div>

        }

      </div>
    );
  }
}

export default Index;
