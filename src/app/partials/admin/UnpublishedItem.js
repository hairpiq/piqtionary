import React, { Component } from 'react';
import { render } from 'react-dom';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import FileCloudDone from 'material-ui/svg-icons/file/cloud-done';
import {grey600} from 'material-ui/styles/colors';

class UnpublishedItem extends Component {

  constructor() {
    super();

    this.rejectItem = this.rejectItem.bind(this);
    this.publishItem = this.publishItem.bind(this);

  }

  rejectItem() {

    this.props.handleDialog({
        action: 'REJECT',
        hairpiq: this.props.listItem
      });
  }

  publishItem() {

    this.props.handleDialog({
        action: 'PUBLISH',
        hairpiq: this.props.listItem
      });
  }

	render() {

    const listItem = this.props.listItem;

		return (

      <Paper className="approved-hairpiq">
        <div className="photo">
          <a href={listItem.s3_url} target="_blank"><img src={listItem.s3_url} /></a>
        </div>
        <div className="detail-info">
          <div className="publish-hairpiq-container">
            <a className="publish-hairpiq-button">
              <IconButton className="publish-hairpiq" onClick={this.publishItem}>
                <FileCloudDone color={grey600} />
              </IconButton>
            </a>
          </div>
          <div className="delete-hairpiq-container">
            <a className="delete-hairpiq-button" onClick={this.rejectItem}>
              <IconButton className="delete-hairpiq">
                <ActionDelete color={grey600} />
              </IconButton>
            </a>
          </div>
        </div>
      </Paper>
    )
	}
}

export default UnpublishedItem;