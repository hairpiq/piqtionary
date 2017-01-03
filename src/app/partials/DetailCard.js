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
import Services from '../services/';
import CircularProgress from 'material-ui/CircularProgress';
import ImageRemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';

class DetailCard extends Component {

	constructor() {
		super();

		this.state = {
			
			tags: []

		}

		this.linkTo = this.linkTo.bind(this);
		this.onImageLoaded = this.onImageLoaded.bind(this);

	}

	proxyUrl = (s3_url) => {

		if (s3_url)
			return '/h/' + s3_url.split('.com/')[1];
	
	}

	linkTo(route) {

		browserHistory.push(route);

	}

	onImageLoaded(url) {

		var _this = this;

		const params = {
			photo_url: this.props.data.s3_url
		}

		Services.hairpiqCreator.getTags(params).then(function(result) {

			_this.setState({
			  	tags: result
			});

		});

	}

	componentWillReceiveProps(nextProps) {

		this.setState({
			tags: []
		})

	}


	render() {

		const params = this.props.data;

		const tag_links = [];
	      this.state.tags.map((tag, i) => {
	        tag_links.push(
	            
	            <a key={i} onTouchTap={() => this.linkTo('/search?q=' + tag.name.replace('-', '%20') )}>
	            	<Chip className="chip">{tag.name.replace('-', ' ')}</Chip>
	            </a>

	        );
	    });

	     const ava_dialog = (
	     	<div className="ava-vision-dialog">
    			<div className="message-bubble">
    				<CircularProgress className="progress" size={20} /> analyzing hair...
    			</div>
    			<div className="message-author">Ava Vision<ImageRemoveRedEye className="ava-vision-icon" color="#555555" /></div>
    		</div>
    		)

	    const tags = (
	    	<div>
		    	<div className="data-container tag-cloud">
		    		{tag_links.length > 0 ? tag_links : ava_dialog}
		    	</div>
		    	<Divider />
	    	</div>
	    )
		
		return (

			<div className="detail-card">

				<div className="left-col">
					<div className="photo">
						<Paper className="paper" zDepth={2}>
							<img src={this.proxyUrl(params.s3_url)} onLoad={this.onImageLoaded}/>
						</Paper>
					</div>
				</div>
				<div className="right-col">
					<div className="detail-info">
						<div className="data-container">
							<div className="stylename-mobile-col">
								<div className="title">
				                  Style Name
				                </div>
				                <div className="text">
				                  {params.stylename}
				                </div>
			                </div>
			                <div className="credit-mobile-col">
				                <div className="title">
				                  IG Profile
				                </div>
				                <div className="text">
				                  {params.ig_username}
				                </div>
			                </div>
						</div>
						<Divider />
						{tags}
						<div className="data-container">
							<div className="title">
			                  Share with Friends
			                </div>
			                <ShareMenu
			                	data={params}
			                />
			            </div>
			            {/*<Divider />
			            <div className="data-container">
							<div className="title">
			                  Related Hairpiqs
			                </div>
			                <RelatedItems
			                	data={params}
			                />
			            </div>*/}
					</div>
				</div>


        	</div>

		)

	}
}

export default DetailCard;
