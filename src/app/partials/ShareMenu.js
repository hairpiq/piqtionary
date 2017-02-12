import React, { Component } from 'react';
import { render } from 'react-dom';
import FlatButton from 'material-ui/FlatButton';
import FileDownloadIcon from 'material-ui/svg-icons/file/file-download';
import {orange700} from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';
import Services from '../services/';

class ShareMenu extends Component {

	constructor() {
		super()

		this.state = {
			tumblr_href: ''
		}
	}

	componentDidMount() {

		let params = {
			url: location.href
		}

		let _this = this;

		Services.hairpiqCreator.shortenUrl(params).then(function(result) {
   
		    $(".button.facebook").click(function(e) {

		    	e.preventDefault()

		    	FB.ui({
				  method: 'share',
				  href: result.shortened_url,
				}, function(response){});
		    });

		    // tumblr data
			let tumblr_href = "http://www.tumblr.com/share/link?url=" + result.shortened_url;

			if (_this.props.data) {
			    let params = _this.props.data;
			    let description = "Stylename: " + params.stylename + ", IG Username:" + params.ig_username;
			    tumblr_href = tumblr_href + '&t=' + description;
			}

		    _this.setState({
		    	tumblr_href: tumblr_href
		    })

	    })

	}

	proxyUrl = (s3_url) => {

		if (s3_url)
			return '/h/' + s3_url.split('.com/')[1];
	}
	
	render() {

		const params = this.props.data;

		return (

			<div className="share-menu margin-top-10">
				<a href={this.proxyUrl(params.s3_url)} target="_blank" download>
					<FlatButton
						className="button download"
						backgroundColor={orange700}
						hoverColor="#faba79"
				      	target="_blank"
				      	onTouchTap={() => {

				      		ga('send', {
							  hitType: 'event',
							  eventCategory: 'Share Menu',
							  eventAction: 'download',
							  eventLabel: 'Download Hairpiq'
							});

				      	}}
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
			      	icon={<FontIcon className="icon-facebook" />}
			    />
			    <FlatButton
					className="button tumblr"
					backgroundColor="#35465c"
					hoverColor="#959eaa"
			      	href={this.state.tumblr_href}
			      	target="_blank"
			      	icon={<FontIcon className="icon-tumblr" />}
			    />
			</div>

		)
	}
}

export default ShareMenu;
