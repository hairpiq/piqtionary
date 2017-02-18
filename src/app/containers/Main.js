import React, {Component} from 'react';
import { render } from 'react-dom';
import {orange700, orange500, orange100, grey300, grey400, grey500, grey600, grey700, grey900} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import {browserHistory} from 'react-router';

import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import CloudIcon from 'material-ui/svg-icons/file/cloud';
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
      previousChildren: {},
      is_logged_in: false,
      profile: {},
      is_profile_loaded: false
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

  openAdminSite() {

    browserHistory.push({
      pathname: '/admin',
      state: { role: 'admin' }
    })

  }

  componentDidMount() {

    // compensate for javascript ugly page loading by removing
    // the loading class when this component finally mounts to page.
    $("#app").removeClass('loading');

    let auth = this.props.route.auth;

    this.setState({
      is_logged_in: auth.loggedIn(),
    });

    let _this = this;

    if (auth.loggedIn()) {
      
      // if user_id not set, save into localStorage
      if (localStorage.getItem('profile') === null) {
      
        auth.on('profile_updated', function(e) {
          _this.setState({
            profile: auth.getProfile(),
            is_profile_loaded: true
          })
        })

      } else {
      
        _this.setState({
          profile: auth.getProfile(),
          is_profile_loaded: true
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
            profile: auth.getProfile(),
            is_profile_loaded: true
          })

        })
      
      } else {
        this.setState({
            profile: JSON.parse(localStorage.getItem('profile')),
            is_profile_loaded: true
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


        if (nextProps.location.state.modal === true) {

          // remember the previous page children to render under the modal     
          if (this.state.previousChildren.props === undefined) {

            this.setState({
              previousChildren: this.props.children
            });

          }

        }
      }
  }

  onModalClose() {

    // clear previous page children rendered under the modal
    this.setState({
      previousChildren: {}
    })

  }

  render() {

    let { is_profile_loaded, profile } = this.state;
    let is_admin = false;
    
    if (is_profile_loaded)
        if (profile.app_metadata !== undefined)
          if (profile.app_metadata.roles !== undefined)
            if (profile.app_metadata.roles[0] === 'admin' && profile.email_verified)
              is_admin = true;

    let { location } = this.props

    let isModal = (
      location.state &&
      location.state.modal &&
      (this.state.previousChildren.props !== undefined)
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

        {is_profile_loaded ? 

          <span>

            <IconButton
              className="favorites-page-button"
              onTouchTap={() => this.linkTo('/favorites')}
              iconStyle={styles.appBarIconButton}>
              <PhotoLibraryIcon />
            </IconButton>


            <IconButton
              className="profile-page-button"
              onTouchTap={() => this.linkTo('/' + this.props.route.auth.getProfile().app_metadata.username)}
              iconStyle={styles.appBarIconButton}>
              <Avatar
                src={this.state.profile.picture}
              />
            </IconButton>

          </span> : null }

        <div className="more-menu">
          
          <IconMenu
            iconButtonElement={<IconButton iconStyle={styles.appBarIconButton}><MoreVertIcon /></IconButton>}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            width={200}
          >
            {is_admin ?

            <div>

              <MenuItem
                primaryText="Admin Area"
                rightIcon={<CloudIcon />}
                onTouchTap={() => this.openAdminSite()}
              />

              <Divider />

            </div>

            : null }

            <MenuItem
              className="mobile-favorites-page-button"
              primaryText="My Favorites"
              rightIcon={<PhotoLibraryIcon />}
              onTouchTap={() => this.linkTo('/favorites')}
            />

            <MenuItem
              className="mobile-profile-page-button"
              primaryText="My Profile"
              rightIcon={<Avatar
                          src={this.state.profile.picture}
                        />}
              onTouchTap={() => this.linkTo('/' + this.props.route.auth.getProfile().app_metadata.username)}
            />

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
      </div>
    )

    const login_buttons = (
      
      <div className="login-buttons">

        <FlatButton
          className="signup-button"
          label="Sign Up"
          backgroundColor={orange700}
          hoverColor="#faba79"
          rippleColor="#ffffff"
          onTouchTap={() => this.linkTo({
            pathname: 'signin',
            state: { modal: true, returnTo: this.props.location.pathname }
          })}
        />

        <FlatButton
          className="login-button"
          label="Log In"
          backgroundColor={grey300}
          onTouchTap={() => this.linkTo({
            pathname: 'signin',
            state: { modal: true, returnTo: this.props.location.pathname }
          })}
        />

         <IconButton
          className="info-page-button"
          onTouchTap={() => this.linkTo('/info')}
          iconStyle={styles.appBarIconButton}>
          <InfoIcon />
        </IconButton>

      </div>
    );

    return (
      <div className="main">       
          <MuiThemeProvider muiTheme={muiTheme}>

            <div className={this.state.is_logged_in ? 'logged-in' : 'logged-out'}>

              {this.props.location.pathname !== '/signin' ?
                    
              <AppBar
                className="app_bar"
                showMenuIconButton={false}
                title={logo}
                children={search_bar}
                iconElementRight={this.state.is_logged_in ? standard_actions : login_buttons}
              /> : null }

              <div className="main-container">

              {isModal ?
                this.state.previousChildren :
                this.props.children
              }

              </div>

              {isModal && (
                <Modal isOpen={true} returnTo={location.state.returnTo} pathname={location.pathname} hairpiqs={location.state.hairpiqs} onClose={this.onModalClose.bind(this)}>
                  {this.props.children}
                </Modal>
              )}

              {
                this.props.location.pathname !== '/create' &&
                this.props.location.pathname !== '/survey' &&
                this.props.location.pathname !== '/settings' &&
                this.props.location.pathname !== '/signin' &&
                this.props.location.pathname !== '/add-hairtip' &&
                this.props.location.pathname.split('/')[1] !== 'add-hairtip' &&
                this.props.location.pathname !== '/edit-hairtip' &&
                this.props.location.pathname.split('/')[1] !== 'edit-hairtip' ?

              <CreateButton
                location={this.props.location}
                is_logged_in={this.state.is_logged_in}
              /> : null }

              {this.props.location.pathname !== '/signin' ?

              <SiteFooter /> : null }

            </div>

          </MuiThemeProvider>
      </div>
    )
  }
};

export default Main;