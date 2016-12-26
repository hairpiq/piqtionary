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

class PendingItem extends Component {

  constructor() {
    super();

    this.state = {
      stylename: '',
      ig_username: ''
    }

    this.rejectItem = this.rejectItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.approveItem = this.approveItem.bind(this);
    this.resetText = this.resetText.bind(this);
    this.handleStylenameChange = this.handleStylenameChange.bind(this);
    this.handleIGUsernameChange = this.handleIGUsernameChange.bind(this);
    
  }

  rejectItem() {

    this.props.handleDialog({
        action: 'REJECT',
        hairpiq: this.props.listItem
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

    this.props.handleDialog({
        action: 'APPROVE',
        hairpiq: this.props.listItem
      });
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

    console.log('AA');
    console.log(listItem);

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
            onClick={this.resetText}>
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
                onClick={this.updateItem}
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

      if (!isTextBeingEdited) {
        return <RaisedButton
                className="button approve"
                label="Approve"
                labelColor="#ffffff"
                backgroundColor={green600}
                onClick={this.approveItem}
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
          <div className="reset-text-container">
          {renderResetTextButton()}
          </div>
          <div className="delete-request-container">
            <a className="delete-request-button" onClick={this.rejectItem}>
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