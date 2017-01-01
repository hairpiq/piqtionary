import React, { Component } from 'react';
import { render } from 'react-dom';
import SearchBar from '../partials/SearchBar';
import ResultsWell from '../partials/ResultsWell';
import Helmet from 'react-helmet';

var Iframe = require("react-iframe");

class Survey extends Component {

  render() {

    return (
      <div>

        <Helmet
          title="Make Hairpiq Better"
          defaultTitle="Hairpiq"
        />
        
        <Iframe
          url="https://hairpiq.typeform.com/to/Oo6Ql9"
          width='100%'
          height='500px' />

      </div>
    );
  }
}

export default Survey;
