import React, { Component } from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router'
import AppBar from 'material-ui/AppBar';
import { Toolbar, ToolbarTitle } from 'material-ui/Toolbar';
import { List, ListItem } from 'material-ui/List';

class Page extends Component {

  render() {
    return (
      <div>
        <AppBar title="About" />
        <Toolbar>
          <ToolbarTitle text="Container: SampleContainer 2"/>
        </Toolbar>
        <List>
          <ListItem><Link to="/">Home</Link></ListItem>
          <ListItem><Link to="/about">About</Link></ListItem>
          <ListItem><Link to="/blog">Blog</Link></ListItem>
        </List>
      </div>
    );
  }
}

export default Page;
