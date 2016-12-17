import React, { Component } from 'react';
import { render } from 'react-dom';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import {orange700, green600, grey600} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';

class PendingItem extends Component {

  constructor() {
    super();

    this.rejectItem = this.rejectItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.approveItem = this.approveItem.bind(this);
    
  }

  rejectItem() {

    this.props.handleDialog({
        action: 'REJECT',
        'id': this.props.listItem._id
      });
  }

  updateItem() {

    this.props.handleDialog({
        action: 'UPDATE',
        'id': this.props.listItem._id
      });
  }

  approveItem() {

    this.props.handleDialog({
        action: 'APPROVE',
        'id': this.props.listItem._id
      });
  }

	render() {

    const listItem = this.props.listItem;

		return (

      <Paper key={this.props.key} className="pending-request">
        <div className="delete-request-container">
          <a className="delete-request-button" onClick={this.rejectItem}>
            <IconButton className="delete-request">
              <ActionDelete color={grey600} />
            </IconButton>
          </a>
        </div>
        <div className="photo">
          <a href={listItem.rendered_url} target="_blank"><img src={listItem.rendered_url} /></a>
        </div>
        <div className="detail-info">
          <div className="data-container">
            <TextField
              hintText="update here"
              floatingLabelText="Style Name"
              floatingLabelFixed={true}
              fullWidth={true}
              defaultValue={listItem.stylename}
            />
            <TextField
              hintText="update here"
              floatingLabelText="IG Username"
              floatingLabelFixed={true}
              fullWidth={true}
              defaultValue={listItem.ig_username}
            />
          </div>
        </div>
        <div className="toolbar">
          <RaisedButton
              className="button update"
              label="Update"
              labelColor="#ffffff"
              backgroundColor={orange700}
              onClick={this.updateItem}
          />
          <RaisedButton
              className="button approve"
              label="Approve"
              labelColor="#ffffff"
              backgroundColor={green600}
              onClick={this.approveItem}
          />
        </div>
      </Paper>
    )
	}
}

export default PendingItem;