import React, { Component } from 'react';
import { render } from 'react-dom';
import Services from '../services/';
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

class Page extends Component {

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

      _this.setState({ keywords: keywords });

    }).catch(function(error) {
      console.log(error);
      reject(new Error(error));
    });

  }

  render() {

    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Type 'c'",
      value,
      onChange: this.onChange
    };

    return (
      <div>
        <Autosuggest 
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps} />
      </div>
    );
  }
}

export default Page;
