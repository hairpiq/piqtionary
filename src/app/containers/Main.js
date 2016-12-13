/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, {Component} from 'react';
import {deepOrange500, grey700} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import { Link } from 'react-router';
import PhotoLibraryIcon from 'material-ui/svg-icons/image/photo-library';
import VideoLibraryIcon from 'material-ui/svg-icons/av/video-library';
import InfoIcon from 'material-ui/svg-icons/action/info';

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
  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false,
    };
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  }

  handleTouchTap = () => {
    this.setState({
      open: true,
    });
  }

  render() {

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

    function handleActive() {
      alert();
    }


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

            {this.props.children}

          </div>

        </MuiThemeProvider>

      </div>
    );
  }
}

export default Main;
