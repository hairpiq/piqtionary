import React, { Component } from 'react';
import { render } from 'react-dom';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import ActionDeleteForever from 'material-ui/svg-icons/action/delete-forever';
import FileCloudOff from 'material-ui/svg-icons/file/cloud-off';
import ActionRestore from 'material-ui/svg-icons/action/restore';
import {grey600} from 'material-ui/styles/colors';
import LazyLoad from 'react-lazyload';

class TrashedItem extends Component {

  constructor() {
    super();

    this.deleteItem = this.deleteItem.bind(this);
    this.restoreItem = this.restoreItem.bind(this);

  }

  deleteItem() {

    this.props.handleDialog({
        action: 'DELETE',
        hairpiq: this.props.listItem
      });
  }

  restoreItem() {

    this.props.handleDialog({
        action: 'RESTORE',
        hairpiq: this.props.listItem
      });
  }

	render() {

    const listItem = this.props.listItem;

		return (

      <Paper className="approved-hairpiq">
        <div className="photo">
          <a href={listItem.s3_url} target="_blank">
          <LazyLoad height={200} offset={100} once>
            <img src={listItem.s3_url} />
          </LazyLoad>
          </a>
        </div>
        <div className="detail-info">
          <div className="publish-hairpiq-container">
            <a className="publish-hairpiq-button">
              <IconButton className="publish-hairpiq" onClick={this.restoreItem}>
                <ActionRestore color={grey600} />
              </IconButton>
            </a>
          </div>
          <div className="delete-hairpiq-container">
            <a className="delete-hairpiq-button" onClick={this.deleteItem}>
              <IconButton className="delete-hairpiq">
                <ActionDeleteForever color={grey600} />
              </IconButton>
            </a>
          </div>
        </div>
      </Paper>
    )
	}
}

export default TrashedItem;