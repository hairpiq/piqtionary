import React, { Component } from 'react';
import { render } from 'react-dom';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import {orange700} from 'material-ui/styles/colors';
import Services from '../services/';
import SearchIcon from 'material-ui/svg-icons/action/search';

const styles = {
  autoComplete: {
    width: '100%',
  }
}

class SearchBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
    };
  }

  componentDidMount() {
   
    var _this = this;

    // get keywords for AutoComplete
    Services.getKeywords().then(function(result) {

      _this.setState({ dataSource: result });

    }).catch(function(error) {
      console.log(error);
      reject(new Error(error));
    });

    // update keyword state in parent container
    $(".search-button").click(function() {

      _this.props.updateKeyword(input.attr('value'));

    });

    // on focus, highlight the search field
    var input = $(".search-bar input");
    var search_bar = $(".search-bar");
    
    input.focus(function() {
    
      search_bar.addClass("focused");
    
    });
    
    input.blur(function() {
    
      search_bar.removeClass("focused");
    
    });
    
  }

  render() {

    return (
      
      <div className="search-bar-container">

	       <AutoComplete
	        style={styles.autoComplete}
	        className="search-bar"
	        dataSource={this.state.dataSource}
	        filter={AutoComplete.caseInsensitiveFilter}
	        fullWidth={true}
          zDepth={1}
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
