import React, {Component} from 'react';
import { render } from 'react-dom';
import {Tabs, Tab} from 'material-ui/Tabs';

import NotificationMMS from 'material-ui/svg-icons/notification/mms';
import FileCloudOff from 'material-ui/svg-icons/file/cloud-off';
import FileCloudDone from 'material-ui/svg-icons/file/cloud-done';
import ActionDelete from 'material-ui/svg-icons/action/delete';

class NavTabs extends Component {

	constructor() {
		super();

		this.onActive = this.onActive.bind(this);
	}

	onActive(tab) {
		const route = tab.props['data-route'];
		this.props.onActive(route);
	}

	render() {

		return (
			<Tabs
				onChange={this.props.onChange}
				initialSelectedIndex={this.props.initialSelectedIndex}>
                <Tab
                  icon={<NotificationMMS />}
                  data-route="/admin"
                  onActive={this.onActive}
                />
                <Tab
                  icon={<FileCloudOff />}
                  data-route="/admin/unpublished"
                  onActive={this.onActive}
                />
                <Tab
                  icon={<FileCloudDone />}
                  data-route="/admin/published"
                  onActive={this.onActive}
                />
                <Tab
                  icon={<ActionDelete />}
                  data-route="/admin/trash"
                  onActive={this.onActive}
                />
              </Tabs>
		)
	}
}

export default NavTabs;