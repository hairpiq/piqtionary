import React, { Component } from 'react';
import { render } from 'react-dom';
import SearchBar from '../partials/SearchBar';
import DetailCard from '../partials/DetailCard';
import Helmet from 'react-helmet';
import CreateAHairpiqButton from '../partials/CreateAHairpiqButton';

const styles = {
  autoComplete: {
    width: '90%'
  }
}

class Photo extends Component {

  handleUpdateInput = (value) => {
    this.setState({
      dataSource: [
        value,
        value + value,
        value + value + value,
      ],
    });
  };

  render() {

    //test data
    var params = {
      rendered_url: 'http://res.cloudinary.com/hairpiq/image/upload/co_black,e_colorize,g_north_west,l_logo,o_40,w_372,x_74,y_77/co_black,e_colorize,g_south_west,l_plate,o_25,x_360,y_148/co_white,g_south_west,l_text:Montserrat_62_bold:Test,x_390,y_234/co_white,g_south_west,l_text:Montserrat_50_letter_spacing_1:@averygoodidea,x_390,y_168/x5v2vimxvdejiqizhd69',
      orig_photo_url: 'https://res.cloudinary.com/hairpiq/image/upload/v1480200843/x5v2vimxvdejiqizhd69.jpg',
      s3_url: 'https://dev-piqtionary.s3.amazonaws.com/x5v2vimxvdejiqizhd69.jpg',
      stylename: 'Test',
      ig_username: '@averygoodidea',
      id: '12345'
    }

    const description = "Stylename: " + params.stylename + ", IG Username:" + params.ig_username;

    return (
      <div>

        <Helmet
          title={params.stylename}
          titleTemplate="%s - Hairpiq"
          defaultTitle="Hairpiq"
          meta={[
              /* Facebook Open Graph Object Data */
              {"name": "description", "content": description},
              {"property": "og:url",  "content": "http://hairpiq.com/p/" + params.id},
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

        <div className="uk-grid uk-grid-margin uk-grid-collapse">
            <div className="uk-width-medium-6-10 uk-push-2-10">
              
              <SearchBar />

            </div>

        </div>

        <div className="uk-grid uk-grid-margin uk-grid-collapse">

          <DetailCard />
          
        </div>

        <CreateAHairpiqButton />

      </div>
    );
  }
}

export default Photo;
