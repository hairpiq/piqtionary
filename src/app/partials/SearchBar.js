import React, { Component } from 'react';
import { render } from 'react-dom';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import {orange700} from 'material-ui/styles/colors';
import Services from '../services/';
import SearchIcon from 'material-ui/svg-icons/action/search';
import Autosuggest from 'react-autosuggest';
import { browserHistory } from 'react-router';
import TouchRipple from 'material-ui/internal/TouchRipple';

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

    this.linkTo = this.linkTo.bind(this);

  }

  linkTo(params) {
    console.log(params);

    browserHistory.push(params);
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

  componentWillReceiveProps(nextProps) {
    
    if (nextProps.hasOwnProperty('term'))
      this.setState({
        value: nextProps.term
      })

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
   // if (this.state.term !== undefined && this.state.term !== this.props.term)
     // this.resetStateForTerm(this.props.term);

    const inputProps = {
      placeholder: "what hairstyle would you like to see?",
      value,
      onChange: this.onChange
    };

    const destination = (this.state.value.length > 0 ? '/q/' + this.state.value : '/');

    //const link = <Link className="search-button-link" to={destination} />

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
        {/*<Link className="search-button-link" to={destination}>
          <div className="flat-button-styles search-button">
            <SearchIcon className='icon' /> <span>Search</span>
          </div>
        </Link>*/}
        <a className="search-button-link" onTouchTap={() => this.linkTo(destination)}>
	      <FlatButton
	        className="search-button"
	        backgroundColor={orange700}
	        hoverColor="#faba79"
          rippleColor="#ffffff"
	        icon={<SearchIcon className='icon' />}
	        />
        </a>
      </div>
    );
  }
}

export default SearchBar;
