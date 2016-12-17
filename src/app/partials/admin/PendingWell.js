import React, { Component } from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import InfiniteScroll from 'react-infinite-scroller';
import Services from '../../services/admin/';
import PendingItem from './PendingItem';
import Dialog from 'material-ui/Dialog';

class PendingWell extends Component {

  constructor(props) {
      
      super(props);

      this.state = {
          hairpiqs: [],
          page_num: 0,
          hasMoreItems: true
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

    Services.getPendingList(params).then(function(result) {
      
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

  render() {

    const loader = <div className="loader">Loading ...</div>;

    var items = [];
      this.state.hairpiqs.map((listItem, i) => {
        items.push(
            
            <div className="uk-width-medium-6-10 uk-push-2-10">
              <PendingItem
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

        <div className="pending-request-container">

          <InfiniteScroll
              pageStart={0}
              loadMore={this.loadItems.bind(this)}
              hasMore={this.state.hasMoreItems}
              loader={loader}>

              <div className="uk-grid" data-uk-grid-match data-uk-grid-margin>
                  {items}
              </div>
          </InfiniteScroll>
        
        </div>

      </div>
    );
  }
}

export default PendingWell;
