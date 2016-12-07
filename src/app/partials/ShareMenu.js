import React, { Component } from 'react';
import { render } from 'react-dom';
import FlatButton from 'material-ui/FlatButton';

class ShareMenu extends Component {
	
	render() {

		//test data
	    var params = {
	      rendered_url: 'http://res.cloudinary.com/hairpiq/image/upload/co_black,e_colorize,g_north_west,l_logo,o_40,w_372,x_74,y_77/co_black,e_colorize,g_south_west,l_plate,o_25,x_360,y_148/co_white,g_south_west,l_text:Montserrat_62_bold:Test,x_390,y_234/co_white,g_south_west,l_text:Montserrat_50_letter_spacing_1:@averygoodidea,x_390,y_168/x5v2vimxvdejiqizhd69',
	      orig_photo_url: 'https://res.cloudinary.com/hairpiq/image/upload/v1480200843/x5v2vimxvdejiqizhd69.jpg',
	      s3_url: 'https://dev-piqtionary.s3.amazonaws.com/x5v2vimxvdejiqizhd69.jpg',
	      stylename: 'Test',
	      ig_username: '@averygoodidea',
	      id: '12345'
	    };

		const InstagramIcon = (
			<svg style="width:24px;height:24px" viewBox="0 0 24 24">
			   <path fill="#ffffff" d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
			</svg>
		);

		const TwitterIcon = (
			<svg style="width:24px;height:24px" viewBox="0 0 24 24">
			    <path fill="#ffffff" d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />
			</svg>
		);

		const FacebookIcon = (
			<svg style="width:24px;height:24px" viewBox="0 0 24 24">
			    <path fill="#ffffff" d="M17,2V2H17V6H15C14.31,6 14,6.81 14,7.5V10H14L17,10V14H14V22H10V14H7V10H10V6A4,4 0 0,1 14,2H17Z" />
			</svg>
		);

		const TumblrIcon = (
			<svg style="width:24px;height:24px" viewBox="0 0 32 32">
				<path fill="#ffffff" d="M18.001 14l-0 7.318c0 1.857-0.024 2.927 0.173 3.453 0.195 0.524 0.685 1.067 1.218 1.381 0.709 0.425 1.517 0.637 2.428 0.637 1.62 0 2.577-0.214 4.179-1.267v4.811c-1.366 0.642-2.558 1.019-3.666 1.279-1.109 0.258-2.308 0.388-3.596 0.388-1.463 0-2.327-0.184-3.45-0.552-1.124-0.371-2.083-0.9-2.876-1.579-0.795-0.685-1.344-1.413-1.652-2.182s-0.46-1.888-0.46-3.351v-11.222h-4.295v-4.531c1.256-0.408 2.661-0.993 3.556-1.755 0.899-0.764 1.618-1.678 2.16-2.748 0.543-1.067 0.917-2.429 1.121-4.079h5.159l-0 8h7.999v6h-7.999z"></path>
			</svg>
		);

	    const description = "Stylename: " + params.stylename + ", IG Username:" + params.ig_username;
		const tumblr_link = "http://www.tumblr.com/share/link?url=http://hairpiq.com/p/" + params.id + '&t=' + description;

		return (

			<div className="share-menu margin-top-10">
				<FlatButton
					className="button"
					backgroundColor="#bd3381"
					hoverColor="#d648a1"
			      	href="#"
			      	target="_blank"
			      	icon={InstagramIcon}
			    />
			    <FlatButton
					className="button"
					backgroundColor="#00aced"
					hoverColor="#00c8f6"
			      	href="#"
			      	target="_blank"
			      	icon={TwitterIcon}
			    />
			    <FlatButton
					className="button"
					backgroundColor="#3b5998"
					hoverColor="#5276b7"
			      	href="#"
			      	target="_blank"
			      	icon={FacebookIcon}
			    />
			    <FlatButton
					className="button tumblr"
					backgroundColor="#35465c"
					hoverColor="#4a607a"
			      	href={tumblr_link}
			      	target="_blank"
			      	icon={TumblrIcon}
			    />
			</div>

		)
	}
}

export default ShareMenu;
