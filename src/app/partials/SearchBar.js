import React, { Component } from 'react';
import { render } from 'react-dom';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import {orange700} from 'material-ui/styles/colors';
import Services from '../services/'

const styles = {
  autoComplete: {
    width: '90%',
  }
}

class SearchBar extends Component {

  constructor(props) {
    super(props);

    var _this = this;

    Services.getKeywords().then(function(result) {

      _this.setState({ dataSource: result });

    });

    this.state = {
      dataSource: [],
    };
  }

  componentDidMount() {
   
    var _this = this;
    var input = $(".search-bar input");
    var search_bar = $(".search-bar");
    
    input.focus(function() {
    
      search_bar.addClass("focused");
    
    });
    
    input.blur(function() {
    
      search_bar.removeClass("focused");
    
    });

    $(".search-button").click(function() {

      _this.props.updateKeyword(input.attr('value'));

    });
    
  }

  render() {

    const icon = (
      <svg viewBox="0 0 24 24">
          <path fill="#ffffff" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.43,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.43C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,14C11.11,14 12.5,13.15 13.32,11.88C12.5,10.75 11.11,10 9.5,10C7.89,10 6.5,10.75 5.68,11.88C6.5,13.15 7.89,14 9.5,14M9.5,5A1.75,1.75 0 0,0 7.75,6.75A1.75,1.75 0 0,0 9.5,8.5A1.75,1.75 0 0,0 11.25,6.75A1.75,1.75 0 0,0 9.5,5Z" />
      </svg>
    );

    return (
      
      <div className="search-bar-container">

	       <AutoComplete
	        style={styles.autoComplete}
	        className="search-bar"
	        dataSource={this.state.dataSource}
	        filter={AutoComplete.caseInsensitiveFilter}
	        fullWidth={true}
	      />
	      <FlatButton
	        className="search-button"
	        styles={styles.button}
	        backgroundColor={orange700}
	        hoverColor="#faba79"
	        icon={icon}
	        />

      </div>
    );
  }
}

export default SearchBar;
