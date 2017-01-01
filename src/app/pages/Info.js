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
                <p>Hairpiq provides the portion of 3 billion internet users who have trouble finding hair care information suitable to them with the most comprehensive high-quality and accurate hair care information relevant to their specific needs.</p>
                 <p>And we're able to do that because of Ava Vision.</p>
                 <MobileTearSheet>
                  <div className="ava-vision-tear-sheet">
                    <h2><ImageRemoveRedEye className="ava-vision-icon" color="#555555" />Hairpiq&reg; Ava Vision</h2>
                    <Divider />
                    <p>Hairpiq&reg; Ava Vision is <strong>Artifically Intelligent Hairstyle Analysis Software</strong> that enables Hairpiq to detect a hairstyle in a photograph, automatically.</p>
                    <p>Through Ava Vision, Hairpiq can provide predictive analysis on photos which leads to <strong>highly accurate suggested products, services and related capabilities</strong>.</p>
                  </div>
                </MobileTearSheet>

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
                        Tech Lead, CEO, Founder <br />
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
                        Lead Photographer <br />
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
                  <ListItem
                    className="team-member"
                    disabled={true}
                    leftAvatar={
                      <Avatar
                        src="/images/info-page/avatar-jackson-gabriel.jpg"
                        size={100}
                      />
                    }
                  > 
                    <div className="team-member-info">
                      <p><strong>Jackson Gabriel</strong> <br />
                        Senior Web Developer <br />
                        <a href="mailto:jackson@hairpiq.com">jackson@hairpiq.com</a>
                      </p>
                    </div>
                  </ListItem>
                  <Divider />
                </List>

                <h2>Contact Info</h2>
                <p>For all business related enquires, please email:</p>
                <p><a href="mailto:info@hairpiq.com">info@hairpiq.com</a></p>
                <p>Or call:</p>
                <p><a href="tel:+14434247747">+1-443-424-7747</a></p>

              </div>

            </Paper>

          </div>

        </div>

      </div>
    );
  }
}

export default Info;
