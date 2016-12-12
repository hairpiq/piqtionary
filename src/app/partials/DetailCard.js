import React, { Component } from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import ShareMenu from './ShareMenu';

class DetailCard extends Component {

	render() {
		
		return (

			<div className="detail-card-container">

	            <div className="uk-width-medium-8-10 uk-push-1-10">
	                
	                <Paper className="detail-card">
	            		
	            		<div className="uk-grid uk-grid-margin uk-grid-collapse">
							<div className="uk-width-medium-4-10 data-column">
								<div className="data">
									<div className="title">
					                  Style Name
					                </div>
					                <div className="text">
					                  Afro Puffs
					                </div>
					                <div className="title">
					                  IG Profile
					                </div>
					                <div className="text">
					                  @_wassupyaya
					                </div>
								</div>
								<div className="data">
									<Link to="#"><Chip className="chip">tag</Chip></Link>
									<Link to="#"><Chip className="chip">tagtag</Chip></Link>
									<Link to="#"><Chip className="chip">tag</Chip></Link>
									<Link to="#"><Chip className="chip">tagtagtagtag</Chip></Link>
									<Link to="#"><Chip className="chip">tag</Chip></Link>
								</div>
								<div className="data tertiary">
									<div className="title">
					                  Share with Friends
					                </div>
									<ShareMenu />
									<div className="title margin-top-20">
					                  Related Images
					                </div>
					                <div className="related-images margin-top-10">A, B, C</div>
			            		</div>
							</div>
							<div className="uk-width-medium-6-10">
								<div className="photo">
									<img src="https://dev-piqtionary.s3.amazonaws.com/x5v2vimxvdejiqizhd69.jpg" />
								</div>
							</div>
	            		</div>

	            	</Paper>

	            </div>

        	</div>

		)

	}
}

export default DetailCard;
