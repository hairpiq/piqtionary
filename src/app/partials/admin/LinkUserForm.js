import React, { Component } from 'react';
import { render } from 'react-dom';
import Autosuggest from 'react-autosuggest';
import AdminServices from '../../services/admin';
import Avatar from 'material-ui/Avatar';
import SvgIcon from 'material-ui/SvgIcon';
import {grey600} from 'material-ui/styles/colors';


const LinkUserIcon = (props) => {

   return (
      
      <SvgIcon {...props}>
        <path d="M18,19H6V17.6C6,15.6 10,14.5 12,14.5C14,14.5 18,15.6 18,17.6M12,7A3,3 0 0,1 15,10A3,3 0 0,1 12,13A3,3 0 0,1 9,10A3,3 0 0,1 12,7M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z" />
      </SvgIcon>
      
    )

}

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestionValue(suggestion) {
	return suggestion.name;
}

function renderSuggestion(suggestion) {

  return (
  	<span className={"suggestion-content " + suggestion._id}>
  		<Avatar
  			className="picture"
  			src={suggestion.picture}
  		/>
  		<div className="data-container">
  			<div className="fullname">{suggestion.fullname}</div>
    		<div className="username">{suggestion.username}</div>
    	</div>
    	<LinkUserIcon className="icon" color={grey600} />
    </span>
  );

}

class LinkUserForm extends Component {

	constructor() {
		
		super()

		this.state = {
			value: '',
			suggestions: [],
			keywords: [],
		}

	}

	onChange = (event, { newValue, method }) => {
	 
		this.setState({
		  value: newValue
		});
	
	};

	onSuggestionsFetchRequested = ({ value }) => {
	
		this.setState({
		  suggestions: this.getSuggestions(value)
		});
	
	};

	onSuggestionsClearRequested = () => {
	
		this.setState({
		  suggestions: []
		});
	
	};

	getSuggestions(value) {
	
		const escapedValue = escapeRegexCharacters(value.trim());

		if (escapedValue === '') {
		  return [];
		}

		const regex = new RegExp('^' + escapedValue, 'i');

		return this.state.keywords.filter(keyword => regex.test(keyword.name));
	
	}

	onSuggestionSelected(event, obj) {

		this.props.setUserData(obj.suggestion)

	}

	componentDidMount() {
		
		var _this = this;

	    // get keywords for AutoComplete
	    AdminServices.getAllUserData().then(function(result) {

	      var keywords = [];
	      for (var i in result) 
	        keywords.push({
	        	name: result[i].fullname, // 'name seems to be a reserved value for the AutoSuggest Component. Remove name the AutoSuggest throws an error when a suggestion is selected.'
	        	username: result[i].username,
	        	_id: result[i]._id,
	        	fullname: result[i].fullname,
	        	picture: result[i].picture,
	        	auth0_user_id: result[i].auth0_user_id
	        });

	      _this.setState({ keywords: keywords});

	    }).catch(function(error) {
	      console.log(error);
	      reject(new Error(error));
	    });

	}

	render() {

		const { value, suggestions } = this.state;

		const inputProps = {
			placeholder: "search user by Full Name",
			value,
			onChange: this.onChange
		};

		return (

			<div className="identify-user-search-bar-container">

				<Autosuggest
		          suggestions={suggestions}
		          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
		          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
		          getSuggestionValue={getSuggestionValue}
		          renderSuggestion={renderSuggestion}
		          inputProps={inputProps}
		          onSuggestionSelected={this.onSuggestionSelected.bind(this)}
		        />

			</div>

		)

	}

}

export default LinkUserForm;