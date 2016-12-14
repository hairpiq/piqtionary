import React, { Component } from 'react';
import { render } from 'react-dom';
import Services from '../services';

const PICTURES = [
  { id: 0, src: 'http://placekitten.com/601/601' },
  { id: 1, src: 'http://placekitten.com/610/610' },
  { id: 2, src: 'http://placekitten.com/620/620' }
]

class Picture extends Component {

	constructor() {
		super();

		this.state = {
			data: {}
		}
	}

	componentDidMount() {

	    var _this = this;

	    // add id
	    var params = {
	      _id: this.props.params.id
	    }

	    console.log(this.props.params.id);

	    // get keywords for AutoComplete
	    Services.getById(params).then(function(result) {

	    	console.log('A');
	    	console.log(result);

	     /* var keywords = [];
	      for (var i in result)
	        keywords.push({name: result[i]});

	      _this.setState({ keywords: keywords});

	      */

	    }).catch(function(error) {
	      console.log(error);
	      reject(new Error(error));
	    });
	}

	render() {

		return (
		  <div>
		    <img src='https://dev-piqtionary.s3.amazonaws.com/x5v2vimxvdejiqizhd69.jpg' style={{ height: '80%' }} />
		  </div>
		)
	}
}

module.exports = Picture;