import React, { Component } from 'react';
import { render } from 'react-dom';

class Title extends Component {

	render() {

		return (
			<h3 className="uk-accordion-title" >{this.props.title}</h3>
		)
	}

}

class Content extends Component {

	render() {

		return (
			<div className="uk-accordion-content">
		    	{this.props.content}
		    </div>
		)
	}

}

class Accordion extends Component {
	
	componentDidMount() {

		UIkit.accordion(
	    	$('.uk-accordion'), 
	      	{
	      		collapse: this.props.values.options.collapse,
	      		animate: this.props.values.options.animate,
	      		showFirst: this.props.values.options.showFirst
	      	}
	    );
	}

	render() {

		return (

			<div className="uk-accordion" data-uk-accordion="">
		    {this.props.values.data.map(function(data,i) {
				return (
					<div key={i}>
						<Title title={data.title} />
						<Content content={data.content} />
					</div>
				)
			})}
		    </div>

		)
	
	}

}

export default Accordion;
