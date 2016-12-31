import React, { Component } from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import FileDownloadIcon from 'material-ui/svg-icons/file/file-download';
import {orange700} from 'material-ui/styles/colors';
import ShareMenu from './ShareMenu';
import RelatedItems from './RelatedItems';

class DetailCard extends Component {

	constructor() {
		super();

		this.linkTo = this.linkTo.bind(this);
	}

	proxyUrl = (s3_url) => {

		if (s3_url)
			return '/h/' + s3_url.split('.com/')[1];
	
	}

	linkTo(route) {

		browserHistory.push(route);

	}

	render() {

		const params = this.props.data;
		
		return (

			<div className="detail-card">

				<div className="left-col">
					<div className="photo">
						<Paper className="paper" zDepth={2}>
							<img src={this.proxyUrl(params.s3_url)} />
						</Paper>
					</div>
				</div>
				<div className="right-col">
					<div className="detail-info">
						<div className="data-container">
							<div className="title">
			                  Style Name
			                </div>
			                <div className="text">
			                  {params.stylename}
			                </div>
			                <div className="title">
			                  IG Profile
			                </div>
			                <div className="text">
			                  {params.ig_username}
			                </div>
						</div>
						<Divider />
						<div className="data-container tag-cloud">

							<a onTouchTap={() => this.linkTo('/q/test')}><Chip className="chip">test</Chip></a>
							<a onTouchTap={() => this.linkTo('/q/tagtag')}><Chip className="chip">tagtag</Chip></a>
							<a onTouchTap={() => this.linkTo('/q/tag')}><Chip className="chip">tag</Chip></a>
							<a onTouchTap={() => this.linkTo('/q/tagtagtagtag')}><Chip className="chip">tagtagtagtag</Chip></a>
							<a onTouchTap={() => this.linkTo('/q/tagtagtag')}><Chip className="chip">tagtagtag</Chip></a>

						</div>
						<Divider />
						<div className="data-container">
							<div className="title">
			                  Share with Friends
			                </div>
			                <ShareMenu
			                	data={params}
			                />
			            </div>
			            <Divider />
			            <div className="data-container">
							<div className="title">
			                  Related Hairpiqs
			                </div>
			                <RelatedItems
			                	data={params}
			                />
			            </div>
					</div>
				</div>


        	</div>

		)

	}
}

export default DetailCard;
