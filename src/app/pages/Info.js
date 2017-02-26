import React, { Component } from 'react';
import { render } from 'react-dom';
import Paper from 'material-ui/Paper';
import Helmet from 'react-helmet';
import MobileTearSheet from '../partials/MobileTearSheet';
import ImageRemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
var Iframe = require("../../../customized_node_modules/react-iframe-for-youtube");

class Info extends Component {

  render() {

    return (
      <div className="info-page">
        
        <Helmet
          title="Company Info"
          titleTemplate="%s - Hairpiq"
          defaultTitle="Hairpiq"
        />

        <div className="uk-grid uk-grid-margin">

          <div className="uk-width-medium-8-10 uk-push-1-10">
            
            <Paper className="content-container">

              <div className="content">
                <h1>Company Info</h1>
                <p>Hairpiq makes taking care of your hair easier.</p>
                <p>We provide high-quality and accurate information that is relevant to your specific needs, and we're able to do it through Ava Vision.</p>
                 <MobileTearSheet>
                  <div className="ava-vision-tear-sheet">
                    <h2>Hairpiq&reg; Ava Vision<ImageRemoveRedEye className="ava-vision-icon" color="#555555" /></h2>
                    <Divider />
                    <p>Hairpiq&reg; Ava Vision is <strong>Artifically Intelligent Hairstyle Analysis Software</strong> that enables Hairpiq to detect a hairstyle in a photograph, automatically.</p>
                    <p>Through Ava Vision, Hairpiq can provide predictive analysis on photos which leads to <strong>highly accurate suggested products, services and related capabilities</strong>.</p>
                  </div>
                </MobileTearSheet>

                <h2>Benefits</h2>
                
                <div className="uk-grid uk-grid-margin">

                  <div className="uk-width-medium-1-1">

                    <Paper className="benefit">

                      <Iframe
                        url="//www.youtube.com/embed/svSC_plPjmI"
                        width='100%'
                        height='315px' />

                        <h3>Your Hairstyle Search Engine</h3>
                        <p>Search unique and interesting hairstyle inspiration with credit to the creators and/or wearers (No stealing photos).</p>

                    </Paper>

                  </div>

                  <div className="uk-width-medium-1-1">

                    <Paper className="benefit">

                      <Iframe
                        url="//www.youtube.com/embed/Y8t_3xDlXaE"
                        width='100%'
                        height='315px' />

                        <h3>Hairpiq Ava Vision</h3>
                        <p>Powered by Hairpiq Ava Vision, our Artifically Intelligent Hairstyle Analysis Software detects a hairstyle in a photograph AUTOMATICALLY, making hashtags a thing of the past.</p>

                    </Paper>

                  </div>

                  <div className="uk-width-medium-1-1">

                    <Paper className="benefit">

                      <Iframe
                        url="//www.youtube.com/embed/xZRRy5PkD5U"
                        width='100%'
                        height='315px' />

                        <h3>Create A Hairpiq</h3>
                        <p>You can now create your own Hairpiq, with your own photos. Keep for yourself, your social network or for your portfolio. You can also apply to have your Hairpiq featured on hairpiq.com, home to all the styles you know and love.</p>

                    </Paper>

                  </div>

                  <div className="uk-width-medium-1-1">

                    <Paper className="benefit">

                      <Iframe
                        url="//www.youtube.com/embed/NFy_ueq-5ko"
                        width='100%'
                        height='315px' />

                        <h3>Discover Unique Events</h3>
                        <p>With countless events going on, it can be hard to find out what's poppin'. Hairpiq is here for the culture and will be highlighting unique events and exclusive deals!</p>

                    </Paper>

                  </div>

                </div>

                <h2>Contact Info</h2>
                <Divider />
                <p>For all business related enquires, please email:<br /><a href="mailto:info@hairpiq.com">info@hairpiq.com</a></p>
                <p>Or call:<br /><a href="tel:+14434247747">+1-443-424-7747</a></p>
                
                <h2>Team</h2>

                <List>
                  <Divider />
                  <ListItem
                    className="team-member"
                    disabled={true}
                    leftAvatar={
                      <Avatar
                        src="/images/info-page/avatar-avery-smith.jpg"
                        size={100}
                      />
                    }
                  > 
                    <div className="team-member-info">
                      <p><strong>Avery Smith</strong> <br />
                        CTO/CEO <br />
                        <a href="mailto:avery@hairpiq.com">avery@hairpiq.com</a>
                      </p>
                    </div>
                  </ListItem>
                  <Divider />
                  <ListItem
                    className="team-member"
                    disabled={true}
                    leftAvatar={
                      <Avatar
                        src="/images/info-page/avatar-shinavia-mckinney.jpg"
                        size={100}
                      />
                    }
                  > 
                    <div className="team-member-info">
                      <p><strong>Shinavia McKinney</strong> <br />
                        Chief Operating Officer <br />
                        <a href="mailto:shinavia@hairpiq.com">shinavia@hairpiq.com</a>
                      </p>
                    </div>
                  </ListItem>
                  <Divider />
                  <ListItem
                    className="team-member"
                    disabled={true}
                    leftAvatar={
                      <Avatar
                        src="/images/info-page/avatar-orchadia-mclean.jpg"
                        size={100}
                      />
                    }
                  > 
                    <div className="team-member-info">
                      <p><strong>Orchadia McLean</strong> <br />
                        Director of Business Development <br />
                        <a href="mailto:kadi@hairpiq.com">kadi@hairpiq.com</a>
                      </p>
                    </div>
                  </ListItem>
                  <Divider />
                  <ListItem
                    className="team-member"
                    disabled={true}
                    leftAvatar={
                      <Avatar
                        src="/images/info-page/avatar-alvin-lowe.jpg"
                        size={100}
                      />
                    }
                  > 
                    <div className="team-member-info">
                      <p><strong>Alvin Lowe</strong> <br />
                        Director of Digital Media <br />
                        <a href="mailto:alvin@hairpiq.com">alvin@hairpiq.com</a>
                      </p>
                    </div>
                  </ListItem>
                  <Divider />
                  <ListItem
                    className="team-member"
                    disabled={true}
                    leftAvatar={
                      <Avatar
                        src="/images/info-page/avatar-ashley-crews.jpg"
                        size={100}
                      />
                    }
                  > 
                    <div className="team-member-info">
                      <p><strong>Ashley Crews</strong> <br />
                        Lead Ava Vision Trainer <br />
                        <a href="mailto:ashley@hairpiq.com">ashley@hairpiq.com</a>
                      </p>
                    </div>
                  </ListItem>
                  <Divider />
                </List>

              </div>

            </Paper>

          </div>

        </div>

      </div>
    );
  }
}

export default Info;
