import React, { Component } from 'react';
import { render } from 'react-dom';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionLock from 'material-ui/svg-icons/action/lock';
import ContentBackspace from 'material-ui/svg-icons/content/backspace';
import {green600, grey100, grey600} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import LazyLoad from 'react-lazyload';
import SvgIcon from 'material-ui/SvgIcon';

class PendingItem extends Component {

  constructor() {
    super();

    this.state = {
      stylename: '',
      ig_username: '',
      user_data: undefined
    }

    this.rejectItem = this.rejectItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.approveItem = this.approveItem.bind(this);
    this.resetText = this.resetText.bind(this);
    this.handleStylenameChange = this.handleStylenameChange.bind(this);
    this.handleIGUsernameChange = this.handleIGUsernameChange.bind(this);
    
  }

  rejectItem() {

    let hairpiq = Object.assign({},this.props.listItem)
    if (this.state.user_data !== undefined)
      hairpiq.auth0_user_id = this.state.user_data.auth0_user_id

    this.props.handleDialog({
        action: 'REJECT',
        hairpiq: hairpiq
      });
  }

  updateItem() {

    var listItem = this.props.listItem;
    listItem.updated_stylename = this.state.stylename;
    listItem.updated_ig_username = this.state.ig_username;

    this.props.handleDialog({
        action: 'UPDATE',
        hairpiq: listItem
      });
  }

  approveItem() {

    let hairpiq = Object.assign({},this.props.listItem)
    if (this.state.user_data !== undefined)
      hairpiq.auth0_user_id = this.state.user_data.auth0_user_id

    this.props.handleDialog({
        action: 'APPROVE',
        hairpiq: hairpiq
      });
  }

  linkUser = () => {

    let user_data  = this.state.user_data

    this.props.handleDialog({
      action: 'LINK_USER',
      hairpiq: this.props.listItem,
      user_data: user_data,
      setUserData: (user_data) => this.setUserData(user_data)
    });
  
  }

  setUserData = (user_data) => {

    this.setState({
      user_data: user_data
    })
   
  }

  resetText() {

    this.setState({
      stylename: this.props.listItem.stylename,
      ig_username: this.props.listItem.ig_username
    });

  }

  handleStylenameChange(e) {

    this.setState({
      stylename: e.target.value
    });

  }

  handleIGUsernameChange(e) {

    this.setState({
      ig_username: e.target.value
    });

  }

  componentDidMount() {
    
    this.resetText();

  }

	render() {

    const listItem = this.props.listItem;
    const isTextBeingEdited = (this.state.stylename !== listItem.stylename || this.state.ig_username !== listItem.ig_username)
    const isPrerendered = (listItem.rendered_url === undefined || listItem.rendered_url.length === 0);
    const user_data = this.state.user_data

    const LinkUserIcon = (props) => {

       return (
          
          <SvgIcon {...props}>
            <path d="M18,19H6V17.6C6,15.6 10,14.5 12,14.5C14,14.5 18,15.6 18,17.6M12,7A3,3 0 0,1 15,10A3,3 0 0,1 12,13A3,3 0 0,1 9,10A3,3 0 0,1 12,7M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z" />
          </SvgIcon>
          
        )

    }

    const renderLinkUserButton = () => {

      if (listItem.auth0_user_id === undefined || listItem.auth0_user_id === null) {
        
        return (

          <a className="identify-user-button" onTouchTap={this.linkUser}>
            <IconButton
              className="identify-user"
              tooltip={user_data !== undefined ? user_data.fullname : 'Link User'}
              disabled={!(listItem.auth0_user_id === undefined || listItem.auth0_user_id === null)}
            >
              <LinkUserIcon color={user_data !== undefined ? green600 : grey600} />
            </IconButton>
          </a>

        )

      } else {
        
        return (

          <IconButton className="identify-user" disabled={true} tooltip="User is Linked Already">
            <LinkUserIcon />
          </IconButton>

        )

      }

    }

    const renderResetTextButton = () => {
      if (isPrerendered) {
        return  <IconButton
                    className="reset-text locked"
                    tooltip="Prerendered. Can't edit."
                    disableTouchRipple={true}>
                  <ActionLock color="#b3b3b3" />
                </IconButton>
      } else if (isTextBeingEdited) {
        return (
          <a
            className="reset-text-button"
            onTouchTap={this.resetText}>
            <IconButton
              className="reset-text"
              tooltip="Reset text to saved state.">
              <ContentBackspace color={grey600} />
            </IconButton>
          </a>
        )
      } else {
        return (
          <IconButton className="reset-text" disabled="true">
            <ContentBackspace />
          </IconButton>
        )
      }
    }

    const renderUpdateButton = () => {

      if (isTextBeingEdited) {
        return <RaisedButton
                className="button update"
                label="Update"
                labelColor="#ffffff"
                primary={true}
                onTouchTap={this.updateItem}
                />
      } else {
        return <RaisedButton
                className="button update"
                label="Update"
                disabled={true}
                disabledBackgroundColor={grey100}
                />
      }
    }

    const renderApproveButton = () => {

      if (!isTextBeingEdited && !(listItem.auth0_user_id === undefined && user_data === undefined)) {
        return <RaisedButton
                className="button approve"
                label="Approve"
                labelColor="#ffffff"
                backgroundColor={green600}
                onTouchTap={this.approveItem}
                />
      } else {
        return <RaisedButton
                className="button approve"
                label="Approve"
                disabled={true}
                disabledBackgroundColor={grey100}
                />
      }
    }

		return (

      <Paper className="pending-request">
        <div className="photo">
          <a href={listItem.s3_url} target="_blank">
            <LazyLoad height={200} offset={100} once>
              <img src={listItem.s3_url + '?' + new Date().getTime().toString()} />
            </LazyLoad>
          </a>
        </div>
        <div className="detail-info">
          <div className="identify-user-container">
            {renderLinkUserButton()}
          </div>
          <div className="reset-text-container">
            {renderResetTextButton()}
          </div>
          <div className="delete-request-container">
            <a className="delete-request-button" onTouchTap={this.rejectItem}>
              <IconButton className="delete-request" tooltip="Move to Trash.">
                <ActionDelete color={grey600} />
              </IconButton>
            </a>
          </div>
          <div className="data-container">
            <TextField
              id={'stylename-' + this.props.listItem._id}
              hintText="update here"
              floatingLabelText="Style Name"
              floatingLabelFixed={true}
              fullWidth={true}
              value={this.state.stylename}
              defaultValue={this.state.stylename}
              onChange={this.handleStylenameChange}
              disabled={isPrerendered}
              />
            <TextField
              id={'ig_username-' + this.props.listItem._id}
              hintText="update here"
              floatingLabelText="IG Username"
              floatingLabelFixed={true}
              fullWidth={true}
              value={this.state.ig_username}
              defaultValue={this.state.ig_username}
              onChange={this.handleIGUsernameChange}
              disabled={isPrerendered}
              />
          </div>
        </div>
        <div className="toolbar">
          {renderUpdateButton()}
          {renderApproveButton()}
        </div>
      </Paper>
    )
	}
}

export default PendingItem;