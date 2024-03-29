import React, { Component } from 'react';
import { render } from 'react-dom';
import InfiniteScroll from 'react-infinite-scroller';
import Services from '../services/';
import ResultItem from './ResultItem';
import CircularProgress from 'material-ui/CircularProgress';
import {grey400, orange700} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import { browserHistory } from 'react-router';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';

class ResultsWell extends Component {

  constructor(props) {
      
      super(props);

      this.state = {
          hairpiqs: [],
          page_num: 0,
          hasMoreItems: true,
          term: this.props.term,
          result_status: '',
          auth0_user_id: '',
          favorites: undefined,
          hairtips: undefined,
          snackbar: {
            open: false,
            message: ''
          },
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

      let result_status = (_this.state.hairpiqs.length === 0 && result.length === 0 ? 'none' : 'results-found');
      _this.setState({
        result_status: result_status
      });   

    }).catch(function(error) {
      console.log(error);
    });
  }

  getTertiaryData() {

    let _this = this;

    let auth0_user_id = JSON.parse(localStorage.getItem('profile')).user_id

    let params = {
      auth0_user_id: auth0_user_id,
    }

    let arr = []

    arr.push(new Promise(function(resolve, reject) {

      Services.getFavorites(params).then(function(result) {

        resolve(result)

      }).catch(function(e) {
        
        console.log(e)
        reject(e)

      })

    }))

    arr.push(new Promise(function(resolve, reject) {

      Services.hairtips.getAll().then(function(result) {

        resolve(result)

      }).catch(function(e) {
      
        console.log(e)
        reject(e)
      
      })

    }))

    Promise.all(arr).then( function(results) {

      _this.setState({
        favorites: results[0],
        hairtips: results[1]
      })
      
    })

  }

  componentDidMount() {

    let _this = this

    if (JSON.parse(localStorage.getItem('profile')) !== null) {

      this.setState({
        hairpiqs: [],
        page_num: 0
      }, function() {
        _this.getTertiaryData()
      })

    } else {

      Services.hairtips.getAll().then(function(result) {

         _this.setState({
          hairtips: result
        })

      }).catch(function(e) {
      
        console.log(e)
      
      })

    }

  }

  componentWillReceiveProps(nextProps) {

   if (JSON.parse(localStorage.getItem('profile')) !== null) {

      let _this = this

      let auth0_user_id = JSON.parse(localStorage.getItem('profile')).user_id

      let params = {
        auth0_user_id: auth0_user_id,
      }

      let arr = []

      arr.push(new Promise(function(resolve, reject) {

        Services.getFavorites(params).then(function(result) {

          _this.setState({
            favorites: result,
          })

        }).catch(function(e) {
          
          console.log(e)

        })

      }))

      
    }

  }

  addToFavorites(hairpiq_id) {


    if (hairpiq_id === 'not-logged-in') {

      this.setState({
        snackbar: {
            open: true,
            message: 'log in to add to favorites!'
        }
      })

    } else {

      let _this = this;
      let auth0_user_id = JSON.parse(localStorage.getItem('profile')).user_id

      let params = {
        auth0_user_id: auth0_user_id,
        hairpiq_id: hairpiq_id
      }

      return new Promise (function(resolve, reject) {

        Services.addToFavorites(params).then(function(result){

          // Gently notify the user of their limit.

          _this.setState({
            favorites: result,
            snackbar: {
                open: true,
                message: 'added to favorites'
            }
          },
          function() {

            resolve(result)

          })

        }).catch(function(e) {

          console.log(e)
          reject(e)

        })

      })

    }

  }

  removeFromFavorites(hairpiq_id) {

    let _this = this;
    let auth0_user_id = JSON.parse(localStorage.getItem('profile')).user_id

   let params = {
      auth0_user_id: auth0_user_id,
      hairpiq_id: hairpiq_id
    }

    return new Promise (function(resolve, reject) {
    
      Services.removeFromFavorites(params).then(function(result){

        _this.setState({
          favorites: result,
          snackbar: {
              open: true,
              message: 'removed from favorites!'
          }
        },
        function() {

          resolve(result)

        })

      }).catch(function(e) {

        console.log(e)
        reject(e)

      })

    })

  }

  closeSnackbar = () => {
    this.setState({
        snackbar: { 
        open: false
      }
    });
  };

  // resetting the state forces the InfiniteScroll Component to re-render
  // with the below values
  
  resetStateForTerm(term) {
    this.setState({
      hairpiqs: [],
      page_num: 0,
      hasMoreItems: true,
      term: term,
      result_status: ''
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

   
    if (this.state.is_logged_in && this.state.favorites !== undefined) {

      var items = [];
      this.state.hairpiqs.map((listItem, i) => {
        items.push(
            
            <div className="hairpiq-paper-container uk-width-small-1-3 uk-width-medium-1-4">
              <ResultItem
                key={listItem.id}
                listItem={listItem}
                location={this.props.location}
                hairpiqs={this.state.hairpiqs}
                favorites={this.state.favorites}
                hairtips={this.state.hairtips}
                addToFavorites={this.addToFavorites.bind(this)}
                removeFromFavorites={this.removeFromFavorites.bind(this)}
                is_logged_in={this.props.is_logged_in}
              />
            </div>

        );
      });

    }

    if (!this.state.is_logged_in && this.state.hairtips !== undefined) {

      var items = [];
      this.state.hairpiqs.map((listItem, i) => {
        items.push(
            
            <div className="hairpiq-paper-container uk-width-small-1-3 uk-width-medium-1-4">
              <ResultItem
                key={listItem.id}
                listItem={listItem}
                location={this.props.location}
                hairpiqs={this.state.hairpiqs}
                favorites={this.state.favorites}
                hairtips={this.state.hairtips}
                addToFavorites={this.addToFavorites.bind(this)}
                removeFromFavorites={this.removeFromFavorites.bind(this)}
                is_logged_in={this.props.is_logged_in}
              />
            </div>

        );
      });

    }

    return (
      
      <div>

        <div className="results-well-container">

          {this.state.result_status === 'none' ?

          <div className="uk-grid uk-grid-margin" data-uk-grid-match data-uk-grid-margin>
            <div className="uk-width-medium-6-10 uk-push-2-10">
              <Paper>
                <div className="uk-alert uk-alert-success">
                  <p>We're sorry that nothing returned, and are actively working to improve our search results.</p>
                  <p>Please take a moment to tell us what you'd like to see on hairpiq.com.</p>
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
              </Paper>
            </div>
          </div>

          :

          <div>

            {this.state.is_logged_in && this.state.favorites !== undefined ?
            <InfiniteScroll
                pageStart={0}
                loadMore={this.loadItems.bind(this)}
                hasMore={this.state.hasMoreItems}
                loader={loader}>

                <div className="uk-grid uk-grid-margin" data-uk-grid-match data-uk-grid-margin>
                    {items}
                </div>
            </InfiniteScroll>
            :
            null }

            {!this.state.is_logged_in && this.state.hairtips !== undefined ?
            <InfiniteScroll
                pageStart={0}
                loadMore={this.loadItems.bind(this)}
                hasMore={this.state.hasMoreItems}
                loader={loader}>

                <div className="uk-grid uk-grid-margin" data-uk-grid-match data-uk-grid-margin>
                    {items}
                </div>
            </InfiniteScroll>
            :
            null }

          </div>

          }
        
        </div>

        <Snackbar
          className="snackbar"
          open={this.state.snackbar.open}
          message={this.state.snackbar.message}
          autoHideDuration={1000}
          onRequestClose={this.closeSnackbar}
        />

      </div>
    );
  }
}

export default ResultsWell;
