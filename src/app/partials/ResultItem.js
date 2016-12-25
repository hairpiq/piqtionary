import React, { Component } from 'react';
import { render } from 'react-dom';
import {browserHistory} from 'react-router';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import LazyLoad from 'react-lazyload';

class ResultItem extends Component {

  constructor() {
    super();

    this.linkTo = this.linkTo.bind(this);
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
          <a
            key={listItem._id}
            onTouchTap={() => this.linkTo(listItem._id)}
            >
            <LazyLoad height={200} offset={100} once>
              <img src={listItem.s3_url} />
            </LazyLoad>
          </a>
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

export default ResultItem;