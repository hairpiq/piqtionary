import React, { Component } from 'react';
import { render } from 'react-dom';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import {orange700} from 'material-ui/styles/colors';
import Services from '../services/';
import SearchIcon from 'material-ui/svg-icons/action/search';
import Autosuggest from 'react-autosuggest';

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestionValue(suggestion) {
    return suggestion.name;
  }

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name}</span>
  );
}

class SearchBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: []
    };
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

  componentDidMount() {

    var _this = this;

    // get keywords for AutoComplete
    Services.getKeywords().then(function(result) {

      var keywords = [];
      for (var i in result)
        keywords.push({name: result[i]});

      _this.setState({ keywords: keywords});

    }).catch(function(error) {
      console.log(error);
      reject(new Error(error));
    });
   
    // update keyword state in parent container
    $(".search-button").click(function() {

      _this.props.updateKeyword(_this.state.value);

    });

    // on focus, highlight the search field
    var input = $(".react-autosuggest__input");
    var search_bar_container = $(".search-bar-container");
    
    input.focus(function() {
    
      search_bar_container.addClass("focused");
    
    });
    
    input.blur(function() {
    
      search_bar_container.removeClass("focused");
    
    });

        
  }

  render() {

    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "what hair style would you like to see?",
      value,
      onChange: this.onChange
    };

    return (
      
      <div className="search-bar-container">

        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
	      <FlatButton
	        className="search-button"
	        backgroundColor={orange700}
	        hoverColor="#faba79"
          rippleColor="#ffffff"
	        icon={<SearchIcon className='icon' />}
	        />

      </div>
    );
  }
}

export default SearchBar;
