import React, { Component } from 'react';
import { render } from 'react-dom';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Accordion from './Accordion';
var RetinaImage = require('react-retina-image');
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
var Iframe = require("../../../customized_node_modules/react-iframe-for-youtube");

class HeroSpace extends Component {

	constructor() {
		super();

		this.state = {
			open: false
		}

		this.handleToggle = this.handleToggle.bind(this);
		this.openLiveSite = this.openLiveSite.bind(this);
	}

	handleToggle = () => this.setState({open: !this.state.open});
	
	handleClose = () => {

		let _this = this;

		$('.close-accordion').addClass('disabled');

		setTimeout(function() {

			$('.close-accordion').removeClass('disabled');

			$('.uk-accordion-title.uk-active').click();
			_this.setState({open: false });

		},10);

	}

	componentDidMount() {

		this.handleClose();

	}

	openLiveSite(url) {
    
		window.open(url, "_blank");

	}
	
	render() {

		let close_button = (
			
			<div className="close-button-container">
	        	<div className="close-button">
	              <IconButton
	              	className="close-accordion"
	              	touch={true}
	              	onTouchTap={() => this.handleClose()}
	              	disableTouchRipple={true}
	              	>
	                <NavigationClose color="#ffffff" />
	              </IconButton>
	            </div>
            </div>

		)

		let black_love_experience_content = (
				
				<div className="brands black-love-experience">

					{close_button}
					
					<div className="uk-grid" data-uk-grid-match>
	                
						<div className="uk-width-medium-4-10">

							<p>
								<a
        							onTouchTap={() => this.openLiveSite('https://blacklove.splashthat.com/')}>
									<RetinaImage className="black-love-experience-logo" src={["/images/hero-space/brands/black-love-experience/logo.png", "/images/hero-space/brands/black-love-experience/2x/logo.png"]} />
								</a>
							</p>
							<p>Feb 18 2017 @ 7pm</p>
							<RaisedButton
								className="black-love-experience-button"
				                label="Buy Tickets"
				                labelColor="#210a09"
				                backgroundColor="#f7e6ea"
				                onTouchTap={() => this.openLiveSite('https://blacklove.splashthat.com/')}
				                />
						</div>

						<div className="uk-width-medium-6-10">

							<Paper>

								<Iframe
									url="//www.youtube.com/embed/T7ss5gON6Kk"
									width='560px'
									height='315px' />

							</Paper>

						</div>

	              	</div>

				</div>

			)

		let accordionsData = {
			_id: '507f191e810c19729de860ea',
			options: {
				showFirst: this.state.open,
				collapse: true,
				animate: false
			},
			data: [{
				title: 'Get $10 Off The Black Love Experience by 1/15/2017',
				content: black_love_experience_content
			},
			/*{
				title: 'MyTab2',
				content: <div><p>Lorem ipsum <span style={{color: "red"}}>dolores</span></p><button className="uk-button">Read more</button></div>
			},*/
			/*{
				title: 'My very very very long tab title 3',
				content: <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
			}*/
			]
		};
	
		return (

			<div className={this.state.open ? 'hero-space open' : 'hero-space'}>

				<div className="uk-container uk-container-center">

					<Accordion values={accordionsData} />

				</div>

			</div>

		)
	}
}

export default HeroSpace;