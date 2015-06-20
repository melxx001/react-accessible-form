'use strict';

var React = require('react');
var Input = require('./formfields/Input');

var Form = React.createClass({ displayName: 'Form',
  render: function render() {
    return React.createElement('div', null, React.createElement(Input, { schema: this.props, type: 'text', preLabel: 'Expense Type1', id: 'id-1', sequence: '1', field: 'id' }), React.createElement(Input, { schema: this.props, type: 'text', postLabel: 'Expense Type2', id: 'id-2', sequence: '2', field: 'sequence' }), React.createElement(Input, { schema: this.props, type: 'text', label: 'Expense Type2', id: 'id-2', sequence: '2', field: 'ctrlType' }));
  }
});

module.exports = Form;