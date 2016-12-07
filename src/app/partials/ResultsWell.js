import React, { Component } from 'react';
import { render } from 'react-dom';
import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {orange700} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';
import { Link } from 'react-router';

const styles = {
  
}

class ResultsWell extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
    };
  }

  handleUpdateInput = (value) => {
    this.setState({
      dataSource: [
        value,
        value + value,
        value + value + value,
      ],
    });
  }

  componentDidMount() {
   
    
  }

  render() {

    const itemHTML = () => {
    
    //test data
    var params = {
      rendered_url: 'http://res.cloudinary.com/hairpiq/image/upload/co_black,e_colorize,g_north_west,l_logo,o_40,w_372,x_74,y_77/co_black,e_colorize,g_south_west,l_plate,o_25,x_360,y_148/co_white,g_south_west,l_text:Montserrat_62_bold:Test,x_390,y_234/co_white,g_south_west,l_text:Montserrat_50_letter_spacing_1:@averygoodidea,x_390,y_168/x5v2vimxvdejiqizhd69',
      orig_photo_url: 'https://res.cloudinary.com/hairpiq/image/upload/v1480200843/x5v2vimxvdejiqizhd69.jpg',
      s3_url: 'https://dev-piqtionary.s3.amazonaws.com/x5v2vimxvdejiqizhd69.jpg',
      stylename: 'Test',
      ig_username: '@averygoodidea'
    }

    // test populate items
    var items = [];
    for (var i = 0; i < 10; i++) {
      items.push(params);
      console.log(items[i]);
    }

    var _itemHtml = items.map(function (listItem, i) {
      console.log('i: ' + i);
      console.log(listItem);
      console.log(listItem._id);
        return (
          <div className="uk-width-small-1-3 uk-width-medium-1-4 hairpiq-paper-container">
            <Paper key={i} className="hairpiq-paper">
              {/*listItem.rendered_url*/}
              <Link to="/p/"><img src={listItem.rendered_url} /></Link>
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

      return _itemHtml;

    }

    return (
      
      <div>

        <div className="results-well-container">

          <FloatingActionButton backgroundColor={orange700} className="button-create-a-hairpiq">
            <ContentAdd />
          </FloatingActionButton>

           <div className="uk-grid uk-grid-margin" data-uk-grid-match data-uk-grid-margin>

            {itemHTML()}

          </div>
        
        </div>

      </div>
    );
  }
}

export default ResultsWell;
