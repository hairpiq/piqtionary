import React, { Component } from 'react';
import { render } from 'react-dom';
import {browserHistory} from 'react-router';

class LoggedOut extends Component {

	componentDidMount() {

		browserHistory.replace('/');

	}

	render() {
		return <div />
	}
}

export default LoggedOut;