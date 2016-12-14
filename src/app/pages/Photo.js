import React, { Component } from 'react';
import { render } from 'react-dom';
import Services from '../services';
import SearchBar from '../partials/SearchBar';
import Helmet from 'react-helmet';
import DetailCard from '../partials/DetailCard';

class Photo extends Component {

  constructor() {
    super();

    this.state = {
      data: {}
    }
  }

  componentDidMount() {

      var _this = this;

      // add id
      var params = {
        _id: this.props.params.id
      }

      // get keywords for AutoComplete
      Services.getById(params).then(function(result) {

        _this.setState({ data: result[0]});

      }).catch(function(error) {
        console.log(error);
      });
  }

  renderMetaData() {
    if(this.state.data.stylename) {
      
      const params = this.state.data;
      const description = "Stylename: " + params.stylename + ", IG Username:" + params.ig_username;

      return <Helmet
            title={params.stylename}
            titleTemplate="%s - Hairpiq"
            defaultTitle="Hairpiq"
            meta={[
                /* Facebook Open Graph Object Data */
                {"name": "description", "content": description},
                {"property": "og:url",  "content": "http://hairpiq.com/p/" + params._id},
                {"property": "og:type", "content": "article"},
                {"property": "og:image", "content": params.s3_url},
                {"property": "fb:app_id", "content": "1055815611207867"},
                /* Twitter Summary Card Data */
                {"property": "twitter:card", "content": "summary_large_image"},
                {"property": "twitter:site", "content": "@hairpiq"},
                {"property": "twitter:creator", "content": "@hairpiq"},
                {"property": "twitter:title", "content": "hairpiq"},
                {"property": "twitter:description", "content": description},
                {"property": "twitter:image", "content": params.s3_url}
            ]}
          />
    }
  }

  render() {

    return (
      <div>

        {this.renderMetaData()}
          
          <DetailCard
            data={this.state.data}
          />

      </div>
    )
  }
}

export default Photo;