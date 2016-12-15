import React, { Component } from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import FileDownloadIcon from 'material-ui/svg-icons/file/file-download';
import {orange700} from 'material-ui/styles/colors';
import ShareMenu from './ShareMenu';
import RelatedItems from './RelatedItems';

class DetailCard extends Component {

	render() {

		const params = this.props.data;
		
		return (

			<div>

				<div className="parent left-col">
					<div className="child photo">
						<Paper className="paper" zDepth={4}>
							<img src={params.s3_url} />
						</Paper>
					</div>
				</div>
				<div className="parent right-col">
					<div className="child detail-info">
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
						<div className="data-container">
							<Link to="/q/test"><Chip className="chip">test</Chip></Link>
							<Link to="/q/tagtag"><Chip className="chip">tagtag</Chip></Link>
							<Link to="/q/tag"><Chip className="chip">tag</Chip></Link>
							<Link to="/q/tagtagtagtag"><Chip className="chip">tagtagtagtag</Chip></Link>
							<Link to="/q/tagtagtag"><Chip className="chip">tagtagtag</Chip></Link>
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
