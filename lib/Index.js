'use strict';

var React = require('react');
var Input = require('./formfields/Input');

var Form = React.createClass({ displayName: 'Form',
  _onChange: function _onChange() {
    console.log('Parent _onchange');
  },
  render: function render() {
    return React.createElement('div', null, React.createElement(Input, { onChange: this._onChange, preLabel: 'Expense Type1', id: 'id-1' }), React.createElement(Input, { postLabel: 'Expense Type2', id: 'id-2' }), React.createElement(Input, { label: 'Expense Type2', id: 'id-2' }));
  }
});

module.exports = Form;