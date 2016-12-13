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
          term: this.props.term
      };

  }

  loadItems(page) {

    var _this = this;

    // get list of hairpiqs
    var hairpiqs = _this.state.hairpiqs;

    // add page_num
    var params = {
      page_num: this.state.page_num
    }

    // if the term state has changed, include it
    if(this.state.term !== undefined && this.state.term.length > 0)
      params.term = this.state.term;


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

    }).catch(function(error) {
      console.log(error);
      reject(new Error(error));
    });
  }

  // resetting the state forces the InfiniteScroll Component to re-render
  // with the below values
  
  resetStateForTerm(term) {
    this.setState({
      hairpiqs: [],
      page_num: 0,
      hasMoreItems: true,
      term: term
    });
  }

  render() {

    // if the term that is passed as a prop is DIFFERENT than the term in this component state
      // reset this component state with this new ter,.
    if (this.state.term !== this.props.term)
      this.resetStateForTerm(this.props.term);

    const loader = <div className="loader">Loading ...</div>;

    var items = [];
      this.state.hairpiqs.map((listItem, i) => {
        items.push(
            
            <div className="hairpiq-paper-container uk-width-small-1-3 uk-width-medium-1-4">
              <Paper key={i} className="hairpiq-paper">
                <div>
                  <a href={'/p/' + listItem._id + '/'}><img src={listItem.s3_url} /></a>
                </div>
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
