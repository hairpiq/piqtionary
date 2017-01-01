import React, { Component } from 'react';
import { render } from 'react-dom';
import InfiniteScroll from 'react-infinite-scroller';
import Services from '../services/';
import ResultItem from './ResultItem';
import CircularProgress from 'material-ui/CircularProgress';
import {grey400, orange700} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import { browserHistory } from 'react-router';

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

  linkTo(returnToPathname) {
    browserHistory.push({
        pathname: '/survey',
        state: {
          modal: true,
          returnTo: returnToPathname
        }
    });
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

    const loader = (
      <div className="loader">
        <CircularProgress color={grey400} />
      </div>
    );

    var items = [];
      this.state.hairpiqs.map((listItem, i) => {
        items.push(
            
            <div className="hairpiq-paper-container uk-width-small-1-3 uk-width-medium-1-4">
              <ResultItem
                key={i}
                listItem={listItem}
                location={this.props.location}
                hairpiqs={this.state.hairpiqs}
              />
            </div>

        );
    });

    return (
      
      <div>

        <div className="results-well-container">

          {this.props.term.length > 0 && items.length === 0 ?

          <div className="uk-grid uk-grid-margin" data-uk-grid-match data-uk-grid-margin>
            <div className="uk-width-medium-6-10 uk-push-2-10">
              <div className="uk-alert uk-alert-success">
                <p>We're sorry that nothing returned, and are actively working to improve our search results</p>
                <p>Please take a moment to tell us what you'd like to see on hairpiq.com</p>
                <p>
                  <FlatButton
                    onTouchTap={() => this.linkTo(this.props.location.pathname)}
                    className="survey-button"
                    label="Tell Us"
                    backgroundColor={orange700}
                    hoverColor="#faba79"
                    rippleColor="#ffffff" />
                </p>
              </div>
            </div>
          </div>

          :

          <InfiniteScroll
              pageStart={0}
              loadMore={this.loadItems.bind(this)}
              hasMore={this.state.hasMoreItems}
              loader={loader}>

              <div className="uk-grid uk-grid-margin" data-uk-grid-match data-uk-grid-margin>
                  {items}
              </div>
          </InfiniteScroll>

          }
        
        </div>

      </div>
    );
  }
}

export default ResultsWell;
