import React, { Component } from 'react';
import { render } from 'react-dom';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import ActionDeleteForever from 'material-ui/svg-icons/action/delete-forever';
import FileCloudOff from 'material-ui/svg-icons/file/cloud-off';
import ActionRestore from 'material-ui/svg-icons/action/restore';
import NotificationMMS from 'material-ui/svg-icons/notification/mms';
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

    const renderRestoreIcon = () => {
      if (listItem.hasOwnProperty('pending_id'))
        return <NotificationMMS color={grey600} />
      else if (listItem.hasOwnProperty('approved_id'))
        return <FileCloudOff color={grey600} />
    }

    const getImageUrl = () => {
      return listItem.s3_url + (listItem.hasOwnProperty('pending_id') ? '?' + new Date().getTime().toString() : '');
    }

		return (

      <Paper className="approved-hairpiq">
        <div className="photo">
          <a href={listItem.s3_url} target="_blank">
          <LazyLoad height={200} offset={100} once>
            <img src={getImageUrl()} />
          </LazyLoad>
          </a>
        </div>
        <div className="detail-info">
          <div className="publish-hairpiq-container">
            <a className="publish-hairpiq-button">
              <IconButton className="publish-hairpiq" onTouchTap={this.restoreItem}>
                {renderRestoreIcon()}
              </IconButton>
            </a>
          </div>
          <div className="delete-hairpiq-container">
            <a className="delete-hairpiq-button" onTouchTap={this.deleteItem}>
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