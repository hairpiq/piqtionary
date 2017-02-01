import React, {Component} from 'react';
import { render } from 'react-dom';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router';

import Subheader from 'material-ui/Subheader';
import NotificationMMS from 'material-ui/svg-icons/notification/mms';
import ImageRemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';

import Divider from 'material-ui/Divider';

class Nav extends Component {

	render() {

		return (

			<div>
				<Drawer
			        open={this.props.open}
			        docked={false}
			        onRequestChange={this.props.onRequestChange}>
 					<Subheader>Admin Area</Subheader>
			        <MenuItem
			          onTouchTap={this.props.handleClose}
			          containerElement={<Link to={{
											      pathname: "/admin",
											      state: { role: 'admin' }
											    }} />}
			          leftIcon={<NotificationMMS />}
			        >
			          Moderate
			        </MenuItem>
			        <MenuItem
			          onTouchTap={this.props.handleClose}
			          containerElement={<Link to={{
											      pathname: "/admin/ava-vision",
											      state: { role: 'admin' }
											    }} />}
			          leftIcon={<ImageRemoveRedEye />}
			        >
			          Ava Vision
			        </MenuItem>
		      	</Drawer>
		    </div>
		)

	}
}

export default Nav;