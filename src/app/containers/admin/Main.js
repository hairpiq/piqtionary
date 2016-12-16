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

import Nav from '../../partials/admin/Nav';

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
    this.state = {open: false};

    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleToggle = () => this.setState({open: !this.state.open});
  handleClose = () => this.setState({open: false});

  render() {

    const logo = (
      <Link to="/admin/"><RetinaImage className="logo" src={["/assets/images/hairpiq-site-logo.png", "/assets/images/2x/hairpiq-site-logo.png"]} /></Link>
    );

    const menu_icon = (
      <IconButton
        onTouchTap={this.handleToggle}
        onClick={this.handleToggle}
      >
        <NavigationMenu />
      </IconButton>
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
                title={logo}
                iconElementLeft={menu_icon}
                iconElementRight={standard_actions}
              />

              <div className="main-container">

              {this.props.children}

              </div>

              <Nav
                open={this.state.open}
                onRequestChange={this.handleClose}
                handleClose={this.handleClose}
              />

            </div>

          </MuiThemeProvider>
      </div>
    )
  }
};

export default Main;