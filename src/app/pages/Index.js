import React, { Component } from 'react';
import { render } from 'react-dom';
import ResultsWell from '../partials/ResultsWell';
import Helmet from 'react-helmet';
import HeroSpace from '../partials/HeroSpace';
import SplashItem from '../partials/SplashItem';
import LoginForm from '../partials/LoginForm';
import SiteFooter from '../partials/SiteFooter';
import {browserHistory} from 'react-router';
import CircularProgress from 'material-ui/CircularProgress';
import {grey400, orange700} from 'material-ui/styles/colors';


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

  componentWillReceiveProps(nextProps) {

    this.setState({
      is_logged_in: this.props.route.auth.loggedIn()
    });

  }

  render() {

    let {is_logged_in} = this.state;

    return (
      <div>

        <Helmet
          defaultTitle="Hairpiq"
        />

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
                is_logged_in={is_logged_in}
                auth={this.props.route.auth}
              />

            </div>
        
          </div>

        </div>

      </div>
    );
  }
}

export default Index;
