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

    const strip_entries = (

      <div>

        <SplashItem
          listItem={{
            ig_username: "@naturallynefertiti",
            s3_url: "https://piqtionary.s3.amazonaws.com/ycda4hhudghrbokwujud.jpg",
            stylename: "Afro",
          }}
        />
        <SplashItem
          listItem={{
            ig_username: "@napturally_tamed",
            s3_url: "https://piqtionary.s3.amazonaws.com/klnbxswlzglzpdzirudz.jpg",
            stylename: "Perm Rod Set Updo",
          }}
        />
        <SplashItem
          listItem={{
            ig_username: "@everythingmich",
            s3_url: "https://piqtionary.s3.amazonaws.com/woshamxizv3b7avxgs2g.jpg",
            stylename: "Side Updo",
          }}
        />
        <SplashItem
          listItem={{
            ig_username: "@curlyyhair.killa",
            s3_url: "https://piqtionary.s3.amazonaws.com/tc286wiqkorb9pjqo93r.jpg",
            stylename: "Twist Bangs and Puff",
          }}
        />

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
        
        :
          
        <div className="splash-page">

          <div className="left-col">
            <div className="strip">
              {strip_entries}
              { /*repeat strip entries for smooth looping animation */}
              {strip_entries}
            </div>
          </div>

          <div className="right-col">
            
            <LoginForm auth={this.props.route.auth} />

            <SiteFooter />

          </div>

        </div>

        }

      </div>
    );
  }
}

export default Index;
