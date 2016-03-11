/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React from 'react';
import _ from 'underscore';
import Request from 'request';

import ConfGlobal from 'conf/local.json';

// Views / Components

import Popover from 'material-ui/lib/popover/popover';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

export default class Login extends React.Component {

  static contextTypes = {
      client: React.PropTypes.object,
      muiTheme: React.PropTypes.object,
      router: React.PropTypes.object,
      siteProps: React.PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false,
      username: null,
      password: null
    };

    this._handleOpen = this._handleOpen.bind(this);
    this._handleClose = this._handleClose.bind(this);
    this._handleLogin = this._handleLogin.bind(this);
  }

  _handleOpen(event){

    event.preventDefault();

    this.setState({
      anchorEl: event.currentTarget,
      open: true
    });
  }

  _handleClose(){
    this.setState({
      open: false
    });
  }

  _handleLogin() {
    var username = this.refs.username.getValue();
    var password = this.refs.password.getValue();

    if ( username !== null && password !== null) {

      var _this = this;

      // TODO: Better way of handling this
      Request({url: ConfGlobal.baseURL + "/logout", method: "GET"}, function (error, response, body) {
        _this.context.client.login({auth: {method: 'basic', username: username, password: password}}).then((user) => {
          if ( user.isAnonymous ) {
            console.log("You're a guest!");
            //Request({url: ConfGlobal.baseURL + "/view_home.faces", method: "HEAD"});
          } else {
            console.log(user.properties.username);
          }

          // Close box
          _this._handleClose();

        }).catch((error) => { throw error });
      });
    }
  }

  render() {
    return (
      <div style={{display: "inline-block", paddingRight: "10px"}}>
        <FlatButton label={this.props.label} onTouchTap={this._handleOpen} />

        <Popover open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this._handleClose}>

          <div style={{padding:20}}>

            <h2>Sign in</h2>

            <div><TextField ref="username" hintText="Username:" /></div>
            <div><TextField ref="password" type="password" hintText="Password:" /></div>

            <RaisedButton onTouchTap={this._handleClose} primary={false} label="Cancel"/> 
            <RaisedButton primary={true} onTouchTap={this._handleLogin} label="Sign in"/>

          </div>

        </Popover>

      </div>
    );
  }
}