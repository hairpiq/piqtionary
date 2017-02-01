import React, {Component} from 'react';
import { render } from 'react-dom';
import {orange700, orange500, orange100, grey400, grey500, grey600, grey700, grey900} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import {browserHistory} from 'react-router';

import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import QuestionAnswerIcon from 'material-ui/svg-icons/action/question-answer';
import AccountCircleIcon from 'material-ui/svg-icons/action/account-circle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import PhotoLibraryIcon from 'material-ui/svg-icons/image/photo-library';
import VideoLibraryIcon from 'material-ui/svg-icons/av/video-library';
import InfoIcon from 'material-ui/svg-icons/action/info';
import ActionLockIcon from 'material-ui/svg-icons/action/lock';
import HelpIcon from 'material-ui/svg-icons/action/help';
import Divider from 'material-ui/Divider';

import Avatar from 'material-ui/Avatar';

import Modal from '../partials/Modal';
import SearchBar from '../partials/SearchBar';
import CreateButton from '../partials/hairpiq_creator/CreateButton';
import SiteFooter from '../partials/SiteFooter';

var RetinaImage = require('react-retina-image');

const styles = {
  appBar : {
    textAlign: 'left'
  },
  tabContent: {
    padding: '20px'
  },
  appBarIconButton : {
    color: grey700
  }
};

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: orange700,
    primary2Color: orange500,
    primary3Color: orange100,
    accent1Color: grey500,
    textColor: grey900,
    secondaryTextColor: grey600,
    borderColor: grey400
  }
});

class Main extends Component {

  constructor() {
    super();

    this.state = {
      indexChildren: {},
      is_logged_in: false,
      profile: {}
    }

    this.linkTo = this.linkTo.bind(this);
    this.logout = this.logout.bind(this);

  }

  linkTo(route) {

    browserHistory.push(route);
    
  }

  logout() {
    this.props.route.auth.logout();
    this.linkTo('/logout');
  }

  componentDidMount() {

    // compensate for javascript ugly page loading by removing
    // the loading class when this component finally mounts to page.
    $("#app").removeClass('loading');

    let auth = this.props.route.auth;

    this.setState({
      is_logged_in: auth.loggedIn()
    });

    let _this = this;

    if (auth.loggedIn()) {
      
      // if user_id not set, save into localStorage
      if (localStorage.getItem('profile') === null) {
      
        auth.on('profile_updated', function(e) {
          _this.setState({
            profile: auth.getProfile()
          })
        })

      } else {
      
        _this.setState({
          profile: auth.getProfile()
        })
      
      }

    }
    
  }

  componentWillReceiveProps(nextProps) {

    let auth = this.props.route.auth;
    let _this = this;

    if (auth.loggedIn()) {
      
      // if user_id not set, save into localStorage
      if (localStorage.getItem('profile') === null) {
      
        auth.removeAllListeners()
        auth.on('profile_updated', function(e) {
          
          _this.setState({
            profile: auth.getProfile()
          })

        })
      
      }
    }

    this.setState({
      is_logged_in: this.props.route.auth.loggedIn()
    });

    // if we changed routes...
    if ((
      nextProps.location.key !== this.props.location.key &&
      nextProps.location.state &&
      nextProps.location.state.modal
    )) {

      if (this.state.indexChildren.props === undefined)
          this.setState({
            indexChildren: this.props.children
          });
    }
  }

  render() {

    let { location } = this.props

    let isModal = (
      location.state &&
      location.state.modal &&
      (this.state.indexChildren.props !== undefined)
    )

    const logo = (
      <a
        onTouchTap={() => this.linkTo('/')}>
        <RetinaImage className="logo" src={["/images/hairpiq-site-logo.png", "/images/2x/hairpiq-site-logo.png"]} />
        <RetinaImage className="mobile-logo" src={["/images/hairpiq-site-mobile-logo.png", "/images/2x/hairpiq-site-mobile-logo.png"]} />
      </a>
    );

    const search_bar = (
      <SearchBar term={this.props.location.query.q ? this.props.location.query.q : ''} />
    );

    const standard_actions = (
      <div>
        {/*
        <IconButton iconStyle={styles.appBarIconButton} tooltip="Photos"><PhotoLibraryIcon /></IconButton>
        */}
        <IconButton
          className="info-page-button"
          onTouchTap={() => this.linkTo('/collection')}
          iconStyle={styles.appBarIconButton}
          tooltip="My Collection">
          <PhotoLibraryIcon />
        </IconButton>
        <IconButton
          className="profile-page-button"
          onTouchTap={() => this.linkTo('/' + this.state.profile.username)}
          iconStyle={styles.appBarIconButton}
          tooltip="My Profile">
          <Avatar
            src={this.state.profile.picture}
          />
        </IconButton>


        <IconMenu
          iconButtonElement={<IconButton iconStyle={styles.appBarIconButton} tooltip="Menu"><MoreVertIcon /></IconButton>}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          width={200}
        >
          <MenuItem
            primaryText="Send Feedback"
            rightIcon={<QuestionAnswerIcon />}
            onTouchTap={() => this.linkTo('/survey')}
          />
          <MenuItem
            primaryText="Info"
            rightIcon={<InfoIcon />}
            onTouchTap={() => this.linkTo('/info')}
          />
          <Divider />
          <MenuItem
            primaryText="Logout"
            onTouchTap={() => this.logout()}
          />
        </IconMenu>
      </div>
    )

    const login_button = (
      <IconButton
          className="login-button"
          onTouchTap={() => this.linkTo('/')}
          iconStyle={styles.appBarIconButton}
          tooltip="Login">
          <ActionLockIcon />
        </IconButton>
    );

    return (
      <div className="main">       
          <MuiThemeProvider muiTheme={muiTheme}>

            <div>

              {this.state.is_logged_in ?

              <div>

                <AppBar
                  className="app_bar"
                  showMenuIconButton={false}
                  title={logo}
                  children={search_bar}
                  iconElementRight={standard_actions}
                />

                <div className="main-container">

                {isModal ?
                  this.state.indexChildren :
                  this.props.children
                }

                </div>

                {isModal && (
                  <Modal isOpen={true} returnTo={location.state.returnTo} pathname={location.pathname} hairpiqs={location.state.hairpiqs}>
                    {this.props.children}
                  </Modal>
                )}

                {
                  this.props.location.pathname !== '/create' &&
                  this.props.location.pathname !== '/survey' &&
                  this.props.location.pathname !== '/settings' ?

                <CreateButton location={this.props.location} /> : null }

                <SiteFooter />

              </div>

              :

              <div>

                {this.props.location.pathname !== '/' ?
                
                <div>

                  <AppBar
                    className="app_bar"
                    showMenuIconButton={false}
                    title={logo}
                    iconElementRight={login_button}
                  />

                  <div className="main-container">

                  {isModal ?
                    this.state.indexChildren :
                    this.props.children
                  }

                  </div>

                  {isModal && (
                    <Modal isOpen={true} returnTo={location.state.returnTo} pathname={location.pathname} hairpiqs={location.state.hairpiqs}>
                      {this.props.children}
                    </Modal>
                  )}

                  <SiteFooter />

                </div>

                :

                <div className="main-container">
                
                  {this.props.children}

                </div>

                }

              </div>

              }

            </div>

          </MuiThemeProvider>
      </div>
    )
  }
};

export default Main;