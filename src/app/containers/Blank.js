import React, {Component} from 'react';
import { render } from 'react-dom';
import {orange700, orange500, orange100, grey400, grey500, grey600, grey700, grey900} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

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

class Blank extends Component {

  componentDidMount() {

    // compensate for javascript ugly page loading by removing
    // the loading class when this component finally mounts to page.
    $("#app").removeClass('loading');
    
  }

  render() {

    return (
      <div className="main">       
          <MuiThemeProvider muiTheme={muiTheme}>

            <div>

              <div className="main-container">
                
                {this.props.children}

              </div>

            </div>

          </MuiThemeProvider>
      </div>
    )
  }
};

export default Blank;