import React, {Component} from 'react';
import { render } from 'react-dom';
import {orange700, orange500, orange100, grey400, grey500, grey600, grey700, grey900} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import {browserHistory} from 'react-router';
import IconButton from 'material-ui/IconButton';
import PhotoLibraryIcon from 'material-ui/svg-icons/image/photo-library';
import VideoLibraryIcon from 'material-ui/svg-icons/av/video-library';
import InfoIcon from 'material-ui/svg-icons/action/info';
import Modal from '../partials/Modal';
import SearchBar from '../partials/SearchBar';
import CreateButton from '../partials/hairpiq_creator/CreateButton';

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
      indexChildren: {}
    }

    this.linkTo = this.linkTo.bind(this);

  }

  linkTo(route) {

    browserHistory.push(route);
    
  }

  componentDidMount() {

    // compensate for javascript ugly page loading by removing
    // the loading class when this component finally mounts to page.
    $("#app").removeClass('loading');
    
  }

  componentWillReceiveProps(nextProps) {
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
        <RetinaImage className="logo" src={["/assets/images/hairpiq-site-logo.png", "/assets/images/2x/hairpiq-site-logo.png"]} />
      </a>
    );

    const search_bar = (
      <SearchBar term={this.props.params.term ? this.props.params.term : ''} />
    );

    const standard_actions = (
      <div>
        {/*
        <IconButton iconStyle={styles.appBarIconButton} tooltip="Photos"><PhotoLibraryIcon /></IconButton>
        <IconButton iconStyle={styles.appBarIconButton} tooltip="Videos"><VideoLibraryIcon /></IconButton>
        */}
        <IconButton iconStyle={styles.appBarIconButton} tooltip="More Info"><InfoIcon /></IconButton>
      </div>
    )

    return (
      <div className="main">       
          <MuiThemeProvider muiTheme={muiTheme}>

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

              {this.props.location.pathname !== '/create' ?
              <CreateButton location={this.props.location} /> : null }

            </div>

          </MuiThemeProvider>
      </div>
    )
  }
};

export default Main;