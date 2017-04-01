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
import Services from '../../services/';
import {Card, CardHeader} from 'material-ui/Card';

class TrashedItem extends Component {

  constructor() {
    super();

    this.state = {
      user_data: undefined
    }

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

  setUserData = (user_data) => {

    this.setState({
      user_data: user_data
    })
   
  }

  componentDidMount() {
    
    let params = {
      auth0_user_id: this.props.listItem.auth0_user_id
    }

    let _this = this;

    Services.getUserData(params).then(function(result) {

      let user_data = result[0]

      _this.setUserData(user_data)

    });

  }

	render() {

    const listItem = this.props.listItem;
    const user_data = this.state.user_data

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

      <Card>

        {user_data !== undefined ?
        
        <CardHeader
          title={user_data.fullname}
          subtitle={user_data.username}
          avatar={user_data.picture}
        />

        : null }

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

      </Card>

    )
	}
}

export default TrashedItem;