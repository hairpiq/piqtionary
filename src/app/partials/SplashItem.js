import React, { Component } from 'react';
import { render } from 'react-dom';
import {browserHistory} from 'react-router';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import LazyLoad from 'react-lazyload';

class SplashItem extends Component {

  constructor() {
    super();

    this.linkTo = this.linkTo.bind(this);
  }

  proxyUrl = (s3_url) => {

    return '/h/' + s3_url.split('.com/')[1];
  }
  
  linkTo(id) {
    browserHistory.push({
      pathname: `/p/${id}`,
      state: { modal: true, returnTo: this.props.location.pathname, hairpiqs: this.props.hairpiqs }
    });
  }

  render() {
    const listItem = this.props.listItem;

    return (
      <Paper key={this.props.key} className="hairpiq-paper">
        <div>
          <img src={this.proxyUrl(listItem.s3_url)} />
        </div>
        <div className="hairpiq-data">
          <div className="title">
            Style Name
          </div>
          <div className="text">
            {listItem.stylename}
          </div>
        </div>
        <Divider />
        <div className="hairpiq-data">
          <div className="title">
            IG Profile
          </div>
          <div className="text">
            {listItem.ig_username}
          </div>
        </div>            
      </Paper>
    )
  }
}

export default SplashItem;