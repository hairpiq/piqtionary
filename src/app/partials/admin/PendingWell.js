import React, { Component } from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import InfiniteScroll from 'react-infinite-scroller';
import Services from '../../services/admin/';
import PendingItem from './PendingItem';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

class PendingWell extends Component {

  constructor(props) {
      
      super(props);

      this.state = {
          hairpiqs: [],
          page_num: 0,
          hasMoreItems: true,
          dialog: {
            open: false,
            title: '',
            message: '',
            action: ''
          },
          hairpiq: {}
      };

      this.handleOpen = this.handleOpen.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.handleDialog = this.handleDialog.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.resetStateForWell = this.resetStateForWell.bind(this);

  }

  handleOpen = () => {
    this.setState({dialog: {open: true}});
  };

  handleClose = () => {
    this.setState({dialog: {open: false }});
  };

  handleDialog(obj) {

    var title;
    var message;

    switch (obj.action) {
      case 'REJECT':

        title = 'REJECT HAIRPIQ';
        message = 'Are you sure you want to reject this hairpiq? Doing so will send it to the Trash Section.';

        break;

      case 'UPDATE':

        title = 'UPDATE HAIRPIQ';
        message = 'Are you sure you want to update this hairpiq? This will allow you to modify the text in the image.';

        break;

      case 'APPROVE':

        title = 'APPROVE HAIRPIQ';
        message = 'Are you sure you want to approve this hairpiq? Doing so will send it to the Unpublished Section.';

        break;
    }

    this.setState({
      dialog: {
        open: true,
        title: title,
        message: message,
        action: obj.action
      },
      hairpiq: obj.hairpiq
    });
  }

  handleSubmit() {

    const action = this.state.dialog.action;
    const hairpiq = this.state.hairpiq;
    const _this = this;

    $('.pending-request-dialog').addClass('disabled');
    
    switch (action) {
      case 'REJECT':

        Services.moveToTrash(hairpiq).then(function(result) {
           $('.pending-request-dialog').removeClass('disabled');
          _this.resetStateForWell();
        });

        break;

      case 'UPDATE':

        Services.update(hairpiq).then(function(result) {
          $('.pending-request-dialog').removeClass('disabled');
          _this.resetStateForWell();
        });

        break;

      case 'APPROVE':

        Services.approve(hairpiq).then(function(result) {
          $('.pending-request-dialog').removeClass('disabled');
          _this.resetStateForWell();
        });

        break;
    }

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

  // resetting the state forces the InfiniteScroll Component to re-render
  // with the below values
  
  resetStateForWell() {
    this.setState({
      hairpiqs: [],
      page_num: 0,
      hasMoreItems: true,
      dialog: {
        open: false
      }
    });
  }

  render() {

    const loader = <div className="loader">Loading ...</div>;

    var items = [];
      this.state.hairpiqs.map((listItem, i) => {
        items.push(
            
            <div className="uk-width-medium-1-2">
              <PendingItem
                key={i}
                listItem={listItem}
                location={this.props.location}
                hairpiqs={this.state.hairpiqs}
                handleDialog={this.handleDialog}
              />
            </div>

        );
    });

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleSubmit}
        onClick={this.handleSubmit}
      />,
    ];

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

        <div>
          <Dialog
            title={this.state.dialog.title}
            actions={actions}
            modal={false}
            open={this.state.dialog.open}
            onRequestClose={this.handleClose}
            actionsContainerClassName="pending-request-dialog">
            {this.state.dialog.message}
          </Dialog>
        </div>

      </div>
    );
  }
}

export default PendingWell;
