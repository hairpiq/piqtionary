import React, { Component } from 'react';
import { render } from 'react-dom';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import {orange700} from 'material-ui/styles/colors';
import Services from '../services/';
import SearchIcon from 'material-ui/svg-icons/action/search';
import Autosuggest from 'react-autosuggest';
import { Link } from 'react-router';

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
      term: '',
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

    // on focus, highlight the search field
    var input = $(".react-autosuggest__input");
    var search_bar_container = $(".search-bar-container");
    
    input.focus(function() {
    
      search_bar_container.addClass("focused");
    
    });
    
    input.blur(function() {
    
      search_bar_container.removeClass("focused");
    
    });

    // set the state here so that the term is loaded on page refresh
    this.setState({value: this.props.term});

  }

  resetStateForTerm(term) {
    this.setState({
      term: term,
      value: term
    });
  }

  render() {

    const { value, suggestions } = this.state;

    // an anti-pattern to include this here? Well how else am I gonna populate the text field on refresh, huh?
    if (this.state.term !== undefined && this.state.term !== this.props.term)
      this.resetStateForTerm(this.props.term);

    const inputProps = {
      placeholder: "what hairstyle would you like to see?",
      value,
      onChange: this.onChange
    };

    const destination = () => {
      return (this.state.value.length > 0 ? '/q/' + this.state.value : '/');
    }

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
        <Link className="search-button-link" to={destination}>
	      <FlatButton
	        className="search-button"
	        backgroundColor={orange700}
	        hoverColor="#faba79"
          rippleColor="#ffffff"
	        icon={<SearchIcon className='icon' />}
	        />
        </Link>

      </div>
    );
  }
}

export default SearchBar;
