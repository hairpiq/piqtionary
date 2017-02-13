import React, {Component} from 'react';
import { render } from 'react-dom';
import {deepOrange500, grey300, grey900} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import { Link } from 'react-router';
import IconButton from 'material-ui/IconButton';

import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import AVVideoLibrary from 'material-ui/svg-icons/av/video-library';
import ActionLaunch from 'material-ui/svg-icons/action/launch';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';

import {browserHistory} from 'react-router';
import NavSlider from '../../partials/admin/NavSlider';
import NavTabs from '../../partials/admin/NavTabs';

import Modal from '../../partials/admin/Modal';
import CreateButton from '../../partials/admin/hairpiq_creator/CreateButton';

import Services from '../../services/admin/';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';

var RetinaImage = require('react-retina-image');

const styles = {
  appBar : {
    textAlign: 'left'
  },
  tabContent: {
    padding: '20px'
  },
  appBarIconButton : {
    color: grey300
  }
};

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: grey900,
    accent1Color: deepOrange500
  }
});

class Main extends Component {

  constructor(props) {
    super(props);

    var initialSelectedIndex = -1;

    switch (this.props.location.pathname) {
      case '/admin':
        initialSelectedIndex = 0;
        break;
      case '/admin/unpublished':
        initialSelectedIndex = 1;
        break;
      case '/admin/published':
        initialSelectedIndex = 2;
        break;
      case '/admin/trash':
        initialSelectedIndex = 3;
        break;
    }
    
    this.state = {
      initialSelectedIndex: initialSelectedIndex,
      open: false,
      updatingKeywords: false,
      keywordsRefreshed: false
    };

    this.linkTo = this.linkTo.bind(this);
    this.openLiveSite = this.openLiveSite.bind(this);
    this.refreshKeywords = this.refreshKeywords.bind(this);
  }

  linkTo(route) {

    browserHistory.push({
      pathname: route,
      state: { role: 'admin' }
    })
    
  }

  openLiveSite() {
    
    window.open("/", "_blank");

  }

  refreshKeywords() {

    let _this = this;

    this.setState({
      updatingKeywords: true
    });
    
    Services.refreshKeywords().then(function(result) {
      
      _this.setState({
        keywordsRefreshed: true
      });

    });

  }

  handleKeywordsRefreshedRequestClose = () => {
    this.setState({
      keywordsRefreshed: false,
      updatingKeywords: false
    });
  }

  componentDidMount() {

    // compensate for javascript ugly page loading by removing
    // the loading class when this component finally mounts to page.
    $("#app").removeClass('loading');

    // this area of the site is for admin's only
    let location = this.props.location;

    if (
      location.state === undefined ||
      location.state.role === undefined ||
      location.state.role !== 'admin'
      ) {
      
      this.linkTo('/')

    } 

    
  }

  componentWillReceiveProps(nextProps) {
    // if we changed routes...
    if ((
      nextProps.location.key !== this.props.location.key &&
      nextProps.location.state &&
      nextProps.location.state.modal
    )) {
      // save the old children (just like animation)
      this.previousChildren = this.props.children
    }
  }

  handleToggle = () => this.setState({open: !this.state.open});

  handleClose = () => this.setState({open: false});

  render() {

    let { location } = this.props

    let isModal = (
      location.state &&
      location.state.modal &&
      this.previousChildren
    )

    const logo = (
      <a
        onTouchTap={() => this.linkTo('/admin')}>
        <RetinaImage className="logo" src={["/images/hairpiq-site-logo.png", "/images/2x/hairpiq-site-logo.png"]} />
      </a>
    );

    const standard_actions = (
      <div>
        <IconButton 
          onTouchTap={() => this.refreshKeywords()}
          iconStyle={styles.appBarIconButton}
          tooltip="Refresh Keywords"
          disabled={this.state.updatingKeywords}>
          {this.state.updatingKeywords ? 
            <CircularProgress size={20} color={styles.appBarIconButton.color} />
          : <NavigationRefresh /> }
        </IconButton>
        <IconButton
          onTouchTap={() => this.openLiveSite()}
          iconStyle={styles.appBarIconButton}
          tooltip="Live Site">
          <ActionLaunch />
        </IconButton>
      </div>
    )

    return (
      <div className="admin">        
          <MuiThemeProvider muiTheme={muiTheme}>

            <div>

              <AppBar
                className="app_bar"
                title={logo}
                iconElementRight={standard_actions}
                onLeftIconButtonTouchTap={this.handleToggle}
              />

              {this.props.location.pathname !== '/admin/ava-vision' ?
              <NavTabs
                initialSelectedIndex={this.state.initialSelectedIndex}
                onActive={this.linkTo}
              /> : null }

              <div className="main-container">

              {isModal ?
                this.previousChildren :
                this.props.children
              }

              </div>
              
              {isModal && (
                <Modal isOpen={true} returnTo={location.state.returnTo} pathname={location.pathname} hairpiqs={location.state.hairpiqs}>
                  {this.props.children}
                </Modal>
              )}

              {this.props.location.pathname !== '/admin/create' ?
              <CreateButton location={this.props.location} /> : null }

              <NavSlider
                open={this.state.open}
                onRequestChange={(open) => this.setState({open})}
                handleClose={() => this.handleClose()}
              />

              <Snackbar
                open={this.state.keywordsRefreshed}
                message="Keywords Refreshed"
                autoHideDuration={4000}
                onRequestClose={this.handleKeywordsRefreshedRequestClose}
              />

            </div>

          </MuiThemeProvider>
      </div>
    )
  }
};

export default Main;