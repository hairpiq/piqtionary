import React, { Component } from 'react';
import { render } from 'react-dom';
import FlatButton from 'material-ui/FlatButton';
import FileDownloadIcon from 'material-ui/svg-icons/file/file-download';
import {orange700} from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';

class ShareMenu extends Component {

	componentDidMount() {
   
	    $(".button.facebook").click(function() {
	    	FB.ui({
			  method: 'share',
			  href: 'https://developers.facebook.com/docs/',
			}, function(response){});
	    });

	}
	
	render() {

		const params = this.props.data;

		// tumblr data
	    const description = "Stylename: " + params.stylename + ", IG Username:" + params.ig_username;
		const tumblr_link = "http://www.tumblr.com/share/link?url=http://hairpiq.com/p/" + params.id + '&t=' + description;

		return (

			<div className="share-menu margin-top-10">
				<a href={params.s3_url} target="_blank" download>
					<FlatButton
						className="button download"
						backgroundColor={orange700}
						hoverColor="#faba79"
				      	target="_blank"
				      	icon={<FontIcon className="icon-download" />}
				    />
			    </a>
			    <FlatButton
					className="button twitter"
					backgroundColor="#00aced"
					hoverColor="#79d4f6"
			      	href="https://twitter.com/share"
			      	target="_blank"
			      	icon={<FontIcon className="icon-twitter" />}
			    />
			    <FlatButton
					className="button facebook"
					backgroundColor="#3b5998"
					hoverColor="#98a8c9"
			      	href="#"
			      	target="_blank"
			      	icon={<FontIcon className="icon-facebook" />}
			    />
			    <FlatButton
					className="button tumblr"
					backgroundColor="#35465c"
					hoverColor="#959eaa"
			      	href={tumblr_link}
			      	target="_blank"
			      	icon={<FontIcon className="icon-tumblr" />}
			    />
			</div>

		)
	}
}

export default ShareMenu;
