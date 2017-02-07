import React, { Component } from 'react';
import { render } from 'react-dom';
import {green600, grey400, grey700} from 'material-ui/styles/colors';
import {browserHistory} from 'react-router';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import LazyLoad from 'react-lazyload';
import NavigationCheckIcon from 'material-ui/svg-icons/navigation/check';
import AddToPhotosIcon from 'material-ui/svg-icons/image/add-to-photos';
import HairtipsIcon from 'material-ui/svg-icons/editor/format-list-bulleted';
import ActionNoteAddIcon from 'material-ui/svg-icons/action/note-add';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';

const styles = {
  appBarIconButton : {
    color: grey700
  }
};

class ResultItem extends Component {

  constructor() {
    super();

    this.state = {
      favorite_status: ''
    }

    this.linkTo = this.linkTo.bind(this);

  }

  proxyUrl = (s3_url) => {

    return '/h/' + s3_url.split('.com/')[1];
  }
  
  linkTo(id) {
    browserHistory.push({
      pathname: `/p/${id}`,
      state: { modal: true, returnTo: this.props.location.pathname, hairpiqs: this.props.hairpiqs }
    });
  }

  editHairtip(id) {
    browserHistory.push({
      pathname: `/edit-hairtip/${id}`,
      state: { modal: true, returnTo: this.props.location.pathname }
    });
  }

  render() {
    
    const { listItem, favorites } = this.props;

    let _this = this;
    let is_favorited = false

    for (var i in favorites)
      if (favorites[i].hairpiq_id === listItem._id) {
        is_favorited = true
        break
      }

    return (
      <Paper key={this.props.key} className="hairpiq-paper">
        <div>
          <a
            key={listItem._id}
            onTouchTap={() => this.linkTo(listItem._id)}
            >
            <LazyLoad height={200} offset={100} once>
              <img src={this.proxyUrl(listItem.s3_url)} />
            </LazyLoad>
          </a>
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
        <div className="dashed"/>

        <IconButton
          onTouchTap={() => {
                this.editHairtip(listItem._id)
              }}
          iconStyle={styles.appBarIconButton}>
          <ActionNoteAddIcon />
        </IconButton>
        

      </Paper>
    )
  }
}

export default ResultItem;