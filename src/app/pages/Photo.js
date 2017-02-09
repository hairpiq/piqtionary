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
      data: {},
      should_scroll_to_hairtip: false
    }
  }

  proxyUrl = (s3_url) => {

    if (s3_url)
      return '/h/' + s3_url.split('.com/')[1];
  
  }

  componentDidMount() {

    if (this.props.hairpiq === undefined) {

      var _this = this;

      // add id
      var params = {
        _id: this.props.params.id
      }

      Services.getById(params).then(function(result) {

        _this.setState({ data: result[0]});

      }).catch(function(error) {
        console.log(error);
      });

    }

    if (this.props.params.hairtip !== undefined)
      this.setState({
        should_scroll_to_hairtip: true
      })

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
                {"property": "og:image", "content": this.proxyUrl(params.s3_url)},
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
            data={this.props.hairpiq || this.state.data}
            should_scroll_to_hairtip={this.state.should_scroll_to_hairtip}
          />

      </div>
    )
  }
}

export default Photo;