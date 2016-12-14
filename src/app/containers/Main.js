import React, {Component} from 'react';
import { render } from 'react-dom';
import {deepOrange500, grey700} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import { Link } from 'react-router';
import IconButton from 'material-ui/IconButton';
import PhotoLibraryIcon from 'material-ui/svg-icons/image/photo-library';
import VideoLibraryIcon from 'material-ui/svg-icons/av/video-library';
import InfoIcon from 'material-ui/svg-icons/action/info';
import Modal from '../partials/Modal';

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
    primary1Color: '#ffffff',
    accent1Color: deepOrange500
  }
});

class Main extends Component {

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

  render() {
    let { location } = this.props

    let isModal = (
      location.state &&
      location.state.modal &&
      this.previousChildren
    )

    const logo = (
      <Link to="/"><RetinaImage className="logo" src={["/assets/images/hairpiq-site-logo.png", "/assets/images/2x/hairpiq-site-logo.png"]} /></Link>
    );

    const standardActions = (
      <div>
        {/*
        <IconButton iconStyle={styles.appBarIconButton} tooltip="Photos"><PhotoLibraryIcon /></IconButton>
        <IconButton iconStyle={styles.appBarIconButton} tooltip="Videos"><VideoLibraryIcon /></IconButton>
        */}
        <IconButton iconStyle={styles.appBarIconButton} tooltip="More Info"><InfoIcon /></IconButton>
      </div>
    )

    return (
      <div>        
          <MuiThemeProvider muiTheme={muiTheme}>

            <div>

              <AppBar
                className="app_bar"
                title={logo}
                showMenuIconButton={false}
                iconElementRight={standardActions}
              />

              {isModal ?
                this.previousChildren :
                this.props.children
              }

              {isModal && (
                <Modal isOpen={true} returnTo={location.state.returnTo}>
                  {this.props.children}
                </Modal>
              )}

            </div>

          </MuiThemeProvider>
      </div>
    )
  }
};

export default Main;