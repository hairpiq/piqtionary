import React, { Component } from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import ShareMenu from './ShareMenu';

class DetailCard extends Component {

	render() {
		
		return (

			<div className="uk-grid uk-grid-collapse">

	            <div className="uk-width-medium-1-2">
	                
	                <div className="row">
		                <Paper className="photo">
							<img src="https://dev-piqtionary.s3.amazonaws.com/x5v2vimxvdejiqizhd69.jpg" />
		            	</Paper>
	            	</div>

	            </div>

	            <div className="uk-width-medium-1-2">
	                
	                <Paper className="detail-card">
	            		Details
	            	</Paper>

	            </div>

        	</div>

		)

	}
}

export default DetailCard;
