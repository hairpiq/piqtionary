import React, { Component } from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import SplashItem from '../partials/SplashItem';
import LoginForm from '../partials/LoginForm';
import SiteFooter from '../partials/SiteFooter';
import {browserHistory} from 'react-router';
import CircularProgress from 'material-ui/CircularProgress';
import {grey400, orange700} from 'material-ui/styles/colors';


class Signin extends Component {

  componentDidMount() {

    if (this.props.route.auth.loggedIn())
      browserHistory.replace('/')

    // if not rendered in modal
      // fix the width of the layout
    if ($('.modal').length > 0)
      $('.modal-inner').addClass('signin');

  }

  componentWillReceiveProps(nextProps) {

    if (this.props.route.auth.loggedIn())
      browserHistory.replace('/')

    // if not rendered in modal
      // fix the width of the layout
    if ($('.modal').length > 0)
      $('.modal-inner').addClass('login');

  }

  render() {

    const strip_entries = (

      <div>

        {/* 

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
            s3_url: "https://dev-piqtionary.s3.amazonaws.com/galgzakzpg8kmhfybnej.jpg",
            stylename: "Twist Bangs and Puff",
          }}
        />
        <SplashItem
          listItem={{
            _id: "5884ffd28516685c6087d544",
            ig_username: "@curlyyhair.killa",
            publish_status: "published",
            s3_url: "https://dev-piqtionary.s3.amazonaws.com/hq6wxjrebimfzuxokivq.jpg",
            stylename: "Twist Bangs and Puff",
          }}
        />

        */}

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
        <SplashItem
          listItem={{
            ig_username: "@tassie8",
            s3_url: "https://piqtionary.s3.amazonaws.com/cgwzwike7kxdcgl5sgk9.jpg",
            stylename: "Curls",
          }}
        />
        <SplashItem
          listItem={{
            ig_username: "@huffbali_",
            s3_url: "https://piqtionary.s3.amazonaws.com/ksl1ue4eoqhydncd8mkb.jpg",
            stylename: "Twisted Locs",
          }}
        />

      </div>

    )

    return (
      <div>

        <Helmet
          defaultTitle="Hairpiq"
        />
          
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

      </div>
    );
  }
}

export default Signin;
