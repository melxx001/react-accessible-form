'use strict';

var React = require('react');
var Input = require('./formfields/Input');
var Select = require('./formfields/Select');
var swagger = {
  schema: require('../example/data/Index.json'),
  definition: '#/definitions/Expenses'
};

var Form = React.createClass({ displayName: 'Form',
  _onChange: function _onChange() {
    console.log('Parent _onchange');
  },
  render: function render() {
    return React.createElement('div', null, React.createElement(Input, { required: true, minLength: 3, maxLength: 10, validation: 'blur', onChange: this._onChange, preLabel: 'Expense Type1', id: 'id-1' }), React.createElement(Input, { minLength: 10, onChange: this._onChange, preLabel: 'Expense Type2', id: 'id-2' }), React.createElement(Input, { minLength: 10, validation: 'change', postLabel: 'Expense Type3', id: 'id-3' }), React.createElement(Input, { isNumber: true, minLength: 10, validation: 'none', label: 'Expense Type4', id: 'id-4' }), React.createElement(Input, { isNumber: true, minLength: 10, postLabel: 'Expense Type5' }), React.createElement(Select, { options: [['', ''], ['1', 'option1'], ['2', 'option2']], required: true, preLabel: 'Expense Type6' }), React.createElement(Select, { options: [['', ''], ['1', 'option1'], ['2', 'option2']], postLabel: 'Expense Type7' }), React.createElement(Input, { isNumber: true, minLength: 10, label: 'ReportName', swagger: swagger, field: 'ReportName' }), React.createElement(Input, { isNumber: true, minLength: 10, label: 'ReportAmount', swagger: swagger, field: 'ReportAmount' }), React.createElement(Select, { options: [['0', '--'], ['10', 'option1'], ['20', 'option2']], label: 'ReportItems', swagger: swagger, field: 'ReportItems' }), React.createElement(Input, { label: 'ReportDate', swagger: swagger, field: 'ReportDate' }), React.createElement(Select, { options: [['false', '--'], ['true', 'TRUE'], ['false', 'FALSE']], label: 'ReportSubmitted', swagger: swagger, field: 'ReportSubmitted' }), React.createElement(Input, { width: 20, isNumber: true, minLength: 10, label: 'Expense Type6' }));
  }
});

module.exports = Form;