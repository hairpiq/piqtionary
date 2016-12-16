import React, {Component} from 'react';
import { render } from 'react-dom';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router';

import NotificationMMS from 'material-ui/svg-icons/notification/mms';
import FileCloudOff from 'material-ui/svg-icons/file/cloud-off';
import FileCloudDone from 'material-ui/svg-icons/file/cloud-done';
import ActionDelete from 'material-ui/svg-icons/action/delete';

import Divider from 'material-ui/Divider';

class Nav extends Component {

	render() {

		return (

			<div>
				<Drawer
			        open={this.props.open}
			        docked={false}
			        onRequestChange={this.props.onRequestChange}
			    >
			        <MenuItem
			          onTouchTap={this.props.handleClose}
			          onClick={this.props.handleClose}
			          containerElement={<Link to="/admin/" />}
			          leftIcon={<NotificationMMS />}
			        >
			          Pending Requests
			        </MenuItem>
			        <MenuItem
			          onTouchTap={this.props.handleClose}
			          onClick={this.props.handleClose}
			          containerElement={<Link to="/admin/unpublished" />}
			          leftIcon={<FileCloudOff />}
			        >
			          Unpublished Hairpiqs
			        </MenuItem>
			        <MenuItem
			          onTouchTap={this.props.handleClose}
			          onClick={this.props.handleClose}
			          containerElement={<Link to="/admin/published" />}
			          leftIcon={<FileCloudDone />}
			        >
			          Published Hairpiqs
			        </MenuItem>
			        <Divider inset={true} />
			        <MenuItem
			          onTouchTap={this.props.handleClose}
			          onClick={this.props.handleClose}
			          containerElement={<Link to="/admin/trash" />}
			          leftIcon={<ActionDelete />}
			        >
			          Trash
			        </MenuItem>
		      	</Drawer>
		    </div>
		)

	}
}

export default Nav;