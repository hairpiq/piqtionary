import React, { Component } from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import ImageRemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';

class SiteFooter extends Component {

	linkTo(route) {

		browserHistory.push(route);

	}

	render() {
		return (

			<footer>

				<div className="footer">
					<p>Powered by <a onTouchTap={() => this.linkTo('/info')}>Hairpiq&reg; Ava Vision <ImageRemoveRedEye className="ava-vision-icon" color="#555555" /></a></p>
					<p>&copy; 2012-{new Date().getFullYear()} Hairpiq. All rights reserved.</p>
				</div>

			</footer>

		)
	}
}

export default SiteFooter;