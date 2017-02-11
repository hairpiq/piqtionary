import React, { Component } from 'react';
import { render } from 'react-dom';
import ResultsWell from '../partials/ResultsWell';
import Helmet from 'react-helmet';
import HeroSpace from '../partials/HeroSpace';
import SplashItem from '../partials/SplashItem';
import LoginForm from '../partials/LoginForm';
import SiteFooter from '../partials/SiteFooter';
import {browserHistory} from 'react-router';

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
              is_logged_in={is_logged_in}
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

        { is_logged_in ?

          <div>

            {home_layout} 

          </div>
        
        : null }

        { !is_logged_in ?
          
        <div className="splash-page">

          <div className="left-col">
            <div className="strip">
              <SplashItem
                listItem={{
                  _id: "5884ffd28516685c6087d544",
                  ig_username: "@curlyyhair.killa",
                  publish_status: "published",
                  s3_url: "https://dev-piqtionary.s3.amazonaws.com/exbclo4ytos9zbg8yttz.jpg",
                  stylename: "Twist Bangs and Puff",
                }}
              />
              <SplashItem
                listItem={{
                  _id: "5884ffd28516685c6087d544",
                  ig_username: "@curlyyhair.killa",
                  publish_status: "published",
                  s3_url: "https://dev-piqtionary.s3.amazonaws.com/v4drwif6adude07bobmt.jpg",
                  stylename: "Twist Bangs and Puff",
                }}
              />
              <SplashItem
                listItem={{
                  _id: "5884ffd28516685c6087d544",
                  ig_username: "@curlyyhair.killa",
                  publish_status: "published",
                  s3_url: "https://dev-piqtionary.s3.amazonaws.com/llhsufy0edxlam7d68km.jpg",
                  stylename: "Twist Bangs and Puff",
                }}
              />
              <SplashItem
                listItem={{
                  _id: "5884ffd28516685c6087d544",
                  ig_username: "@curlyyhair.killa",
                  publish_status: "published",
                  s3_url: "https://dev-piqtionary.s3.amazonaws.com/qm8ssoz2jjk1yl4uyhvp.jpg",
                  stylename: "Twist Bangs and Puff",
                }}
              />
              <SplashItem
                listItem={{
                  _id: "5884ffd28516685c6087d544",
                  ig_username: "@curlyyhair.killa",
                  publish_status: "published",
                  s3_url: "https://dev-piqtionary.s3.amazonaws.com/exbclo4ytos9zbg8yttz.jpg",
                  stylename: "Twist Bangs and Puff",
                }}
              />
              <SplashItem
                listItem={{
                  _id: "5884ffd28516685c6087d544",
                  ig_username: "@curlyyhair.killa",
                  publish_status: "published",
                  s3_url: "https://dev-piqtionary.s3.amazonaws.com/v4drwif6adude07bobmt.jpg",
                  stylename: "Twist Bangs and Puff",
                }}
              />
              <SplashItem
                listItem={{
                  _id: "5884ffd28516685c6087d544",
                  ig_username: "@curlyyhair.killa",
                  publish_status: "published",
                  s3_url: "https://dev-piqtionary.s3.amazonaws.com/llhsufy0edxlam7d68km.jpg",
                  stylename: "Twist Bangs and Puff",
                }}
              />
              <SplashItem
                listItem={{
                  _id: "5884ffd28516685c6087d544",
                  ig_username: "@curlyyhair.killa",
                  publish_status: "published",
                  s3_url: "https://dev-piqtionary.s3.amazonaws.com/qm8ssoz2jjk1yl4uyhvp.jpg",
                  stylename: "Twist Bangs and Puff",
                }}
              />
            </div>
          </div>

          <div className="right-col">
            
            <LoginForm auth={this.props.route.auth} />

            <SiteFooter />

          </div>

        </div>

        : null }

      </div>
    );
  }
}

export default Index;
