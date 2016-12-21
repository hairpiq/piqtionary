import React, { Component } from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import TrashedWell from '../../partials/admin/TrashedWell';
import ActionDeleteForever from 'material-ui/svg-icons/action/delete-forever';
import FileCloudOff from 'material-ui/svg-icons/file/cloud-off';

class Trash extends Component {

  render() {

    return (
      <div>

        <Helmet
          title="Admin Area: Trash"
          titleTemplate="%s - Hairpiq"
          defaultTitle="Hairpiq"
        />

        <div className="intro">
          <h1>Trash</h1>
          <p>Hairpiqs that are marked for deletion.</p>
          <p>To restore one, hit the <strong>Cloud Off</strong> button ( <FileCloudOff /> ). To delete forever, hit the <strong>Delete</strong> button (<ActionDeleteForever />).</p>
        </div>

        <TrashedWell />

      </div>
    );
  }
}

export default Trash;
