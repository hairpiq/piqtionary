import React from 'react';
import {render} from 'react-dom';

var routes = require('./src/app/routes/routes.js');

// Render the main app react component into the app div.
// For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
render(routes, document.getElementById('app'));
