'use strict';

var React = require('react/addons');
var Form = require('../../lib');

var App = React.createClass({ displayName: 'App',
  componentDidMount: function componentDidMount() {},
  render: function render() {
    return React.createElement('div', null, React.createElement(Form, null));
  }
});

/* Module.exports instead of normal dom mounting */
module.exports = App;

/* do something */