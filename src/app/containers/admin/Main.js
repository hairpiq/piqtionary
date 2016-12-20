import React, {Component} from 'react';
import { render } from 'react-dom';
import {deepOrange500, grey300, grey900} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import { Link } from 'react-router';
import IconButton from 'material-ui/IconButton';

import ImagePhotoLibrary from 'material-ui/svg-icons/image/photo-library';
import AVVideoLibrary from 'material-ui/svg-icons/av/video-library';
import ActionLaunch from 'material-ui/svg-icons/action/launch';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';

import {browserHistory} from 'react-router';
import NavTabs from '../../partials/admin/NavTabs';

import CreateButton from '../../partials/CreateButton';


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

    var initialSelectedIndex = 0;

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
      initialSelectedIndex: initialSelectedIndex
    };

    this.linkTo = this.linkTo.bind(this);
  }

  linkTo(route) {

    browserHistory.push(route);
    
  }

  render() {

    const logo = (
      <Link to="/admin/"><RetinaImage className="logo" src={["/assets/images/hairpiq-site-logo.png", "/assets/images/2x/hairpiq-site-logo.png"]} /></Link>
    );

    const standard_actions = (
      <div>
        {/*
        <IconButton iconStyle={styles.appBarIconButton} tooltip="Photos"><ImagePhotoLibrary /></IconButton>
        <IconButton iconStyle={styles.appBarIconButton} tooltip="Videos"><AVVideoLibrary /></IconButton>
        */}
        <IconButton href="/" target="_blank" iconStyle={styles.appBarIconButton} tooltip="Live Site"><ActionLaunch /></IconButton>
      </div>
    )

    return (
      <div className="admin">        
          <MuiThemeProvider muiTheme={muiTheme}>

            <div>

              <AppBar
                className="app_bar"
                title={logo}
                showMenuIconButton={false}
                iconElementRight={standard_actions}
              />

              <NavTabs
                initialSelectedIndex={this.state.initialSelectedIndex}
                onActive={this.linkTo}
              />

              <div className="main-container">

              {this.props.children}

              </div>

              <CreateButton />

            </div>

          </MuiThemeProvider>
      </div>
    )
  }
};

export default Main;