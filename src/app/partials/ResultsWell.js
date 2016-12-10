import React, { Component } from 'react';
import { render } from 'react-dom';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import { Link } from 'react-router';
import InfiniteScroll from 'react-infinite-scroller';
import Services from '../services/'

class ResultsWell extends Component {

  constructor(props) {
      
      super(props);

      this.state = {
          hairpiqs: [],
          page_num: 0,
          hasMoreItems: true,
          keyword: ''
      };

  }

  loadItems(page) {

    var _this = this;

    var hairpiqs = _this.state.hairpiqs;

    var params = {
      page_num: this.state.page_num
    }

    if(this.state.keyword.length > 0)
      params.keyword = this.state.keyword;

    Services.getList(params).then(function(result) {
      
      if(result.length > 0) {
        result.map((hairpiq) => {
          
            hairpiqs.push(hairpiq);
          
          });

        _this.setState({
          hairpiqs: hairpiqs,
          page_num: _this.state.page_num + 1
        });
      } else {
        _this.setState({
            hasMoreItems: false
        });
      }

    });
  }

  // resetting the state forces the InfiniteScroll Component to re-render
  // with the below values
  
  resetStateForKeyword(keyword) {
    this.setState({
      hairpiqs: [],
      page_num: 0,
      hasMoreItems: true,
      keyword: keyword
    });
  }

  render() {

    // if the keyword that is passed as a prop is DIFFERENT than the keyword in this component state
      // reset this component state with this new keyword.
    if (this.state.keyword !== this.props.keyword)
      this.resetStateForKeyword(this.props.keyword);

    const loader = <div className="loader">Loading ...</div>;

    var items = [];
      this.state.hairpiqs.map((listItem, i) => {
        items.push(
            
            <div className="hairpiq-paper-container uk-width-small-1-3 uk-width-medium-1-4">
              <Paper key={i} className="hairpiq-paper">
                <Link to={"/p/?id=" + listItem._id}><img src={listItem.s3_url} /></Link>
                <div className="hairpiq-data">
                  <div className="title">
                    Style Name
                  </div>
                  <div className="text">
                    {listItem.stylename}
                  </div>
                </div>
                <Divider />
                <div className="hairpiq-data">
                  <div className="title">
                    IG Profile
                  </div>
                  <div className="text">
                    {listItem.ig_username}
                  </div>
                </div>            
              </Paper>
            </div>

        );
    });

    return (
      
      <div>

        <div className="results-well-container">

          <InfiniteScroll
              pageStart={0}
              loadMore={this.loadItems.bind(this)}
              hasMore={this.state.hasMoreItems}
              loader={loader}>

              <div className="uk-grid uk-grid-margin" data-uk-grid-match data-uk-grid-margin>
                  {items}
              </div>
          </InfiniteScroll>
        
        </div>

      </div>
    );
  }
}

export default ResultsWell;
