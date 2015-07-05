'use strict';

var React = require('react');

var _require = require('./FormFields');

var Form = _require.Form;
var Input = _require.Input;
var Select = _require.Select;
var CheckBox = _require.CheckBox;
var Button = _require.Button;
var Radio = _require.Radio;

var swagger = {
  schema: require('../example/data/Index.json'),
  definition: '#/definitions/Expenses'
};

var Component = React.createClass({ displayName: 'Component',
  _onChange: function _onChange() {
    console.log('Parent _onchange');
  },
  _validate: function _validate(input) {
    if (input > 100) {
      return {
        result: false,
        message: 'Custom validation failed'
      };
    } else {
      return {
        result: true,
        message: ''
      };
    }
  },
  render: function render() {
    return React.createElement(Form, null, React.createElement(Input, { name: 'type1', required: true, minLength: 3, maxLength: 10, validationEvent: 'blur', onChange: this._onChange, preLabel: 'Expense Type1', id: 'id-1' }), React.createElement(Input, { name: 'type2', minLength: 10, onChange: this._onChange, preLabel: 'Expense Type2', id: 'id-2' }), React.createElement(Input, { name: 'type3', minLength: 10, validationEvent: 'change', postLabel: 'Expense Type3', id: 'id-3' }), React.createElement(Input, { name: 'type4', isNumber: true, minLength: 10, validationEvent: 'none', label: 'Expense Type4', id: 'id-4' }), React.createElement(Input, { name: 'type5', id: 'id-5', isNumber: true, minLength: 10, postLabel: 'Expense Type5' }), React.createElement(Select, { name: 'type6', id: 'id-6', options: [['', ''], ['1', 'option1'], ['2', 'option2']], required: true, preLabel: 'Expense Type6' }), React.createElement(Select, { name: 'type7', id: 'id-7', options: [['', ''], ['1', 'option1'], ['2', 'option2']], postLabel: 'Expense Type7' }), React.createElement(Input, { name: 'type8', id: 'id-8', isNumber: true, minLength: 10, label: 'ReportName', swagger: swagger, field: 'ReportName' }), React.createElement(Input, { name: 'type9', id: 'id-9', isNumber: true, minLength: 10, label: 'ReportAmount', swagger: swagger, field: 'ReportAmount' }), React.createElement(Select, { name: 'type10', id: 'id-10', options: [['0', '--'], ['10', 'option1'], ['20', 'option2']], label: 'ReportItems', swagger: swagger, field: 'ReportItems' }), React.createElement(Input, { name: 'type11', id: 'id-11', label: 'ReportDate', swagger: swagger, field: 'ReportDate' }), React.createElement(Select, { name: 'type12', id: 'id-12', options: [['false', '--'], ['true', 'TRUE'], ['false', 'FALSE']], label: 'ReportSubmitted', swagger: swagger, field: 'ReportSubmitted' }), React.createElement(Input, { name: 'type13', id: 'id-13', width: 20, isNumber: true, minLength: 10, label: 'Expense Type6' }), React.createElement(Input, { name: 'type14', id: 'id-14', label: 'Disabled', disabled: true, initialValue: 'DISABLED' }), React.createElement(Input, { name: 'type15', id: 'id-15', label: 'ReadOnly', readOnly: true, initialValue: 'READONLY' }), React.createElement(CheckBox, { name: 'type16', id: 'id-16', label: 'Checkbox1', required: true, value: 'Checkbox1' }), React.createElement(CheckBox, { name: 'type17', id: 'id-17', label: 'Checkbox2', checked: true, value: 'Checkbox2' }),
    /*<Radio label="Radio1" name="radio" checked={true} value="Radio1" />
    <Radio label="Radio2" name="radio" value="Radio2" />
    <Radio label="Radio3" name="radio3" value="Radio3" />*/
    React.createElement(Input, {
      name: 'type18',
      id: 'id-21',
      label: 'customvalidation',
      customValidation: this._validate }), React.createElement(Button, { id: 'id-18', value: 'Button1', disabled: true }), React.createElement(Button, { id: 'id-19', value: 'submit', type: 'submit' }), React.createElement(Button, { id: 'id-20', value: 'reset', type: 'reset' }));
  }
});

module.exports = Component;