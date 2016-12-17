import React, { Component } from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

class ResultItem extends Component {
  render() {
    const listItem = this.props.listItem;

    return (
      <Paper key={this.props.key} className="hairpiq-paper">
        <div>
          <Link
            key={listItem._id}
            to={{
              pathname: `/p/${listItem._id}`,
              state: { modal: true, returnTo: this.props.location.pathname, hairpiqs: this.props.hairpiqs }
            }}
          >
            <img src={listItem.s3_url} />
          </Link>
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