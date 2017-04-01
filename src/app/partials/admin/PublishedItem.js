import React, { Component } from 'react';
import { render } from 'react-dom';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import FileCloudOff from 'material-ui/svg-icons/file/cloud-off';
import {grey600} from 'material-ui/styles/colors';
import LazyLoad from 'react-lazyload';
import Services from '../../services/';
import {Card, CardHeader} from 'material-ui/Card';

class PublishedItem extends Component {

  constructor() {
    super();

    this.state = {
      user_data: undefined
    }

    this.rejectItem = this.rejectItem.bind(this);
    this.unPublishItem = this.unPublishItem.bind(this);

  }

  rejectItem() {

    this.props.handleDialog({
        action: 'REJECT',
        hairpiq: this.props.listItem
      });
  }

  unPublishItem() {

    this.props.handleDialog({
        action: 'UNPUBLISH',
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
                <img src={listItem.s3_url} />
              </LazyLoad>
            </a>
          </div>
          <div className="detail-info">
            <div className="publish-hairpiq-container">
              <a className="publish-hairpiq-button">
                <IconButton className="publish-hairpiq" onTouchTap={this.unPublishItem}>
                  <FileCloudOff color={grey600} />
                </IconButton>
              </a>
            </div>
            {/*<div className="delete-hairpiq-container">
              <a className="delete-hairpiq-button" onTouchTap={this.rejectItem}>
                <IconButton className="delete-hairpiq">
                  <ActionDelete color={grey600} />
                </IconButton>
              </a>
            </div>*/}
          </div>
        </Paper>
      
      </Card>

    )
	}
}

export default PublishedItem;