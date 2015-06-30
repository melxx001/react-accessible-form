'use strict';

var React = require('react');

var _require = require('./FormFields');

var Input = _require.Input;
var Select = _require.Select;
var CheckBox = _require.CheckBox;
var Button = _require.Button;
var Radio = _require.Radio;

var swagger = {
  schema: require('../example/data/Index.json'),
  definition: '#/definitions/Expenses'
};

var Form = React.createClass({ displayName: 'Form',
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
    return React.createElement('div', null, React.createElement(Input, { required: true, minLength: 3, maxLength: 10, validationEvent: 'blur', onChange: this._onChange, preLabel: 'Expense Type1', id: 'id-1' }), React.createElement(Input, { minLength: 10, onChange: this._onChange, preLabel: 'Expense Type2', id: 'id-2' }), React.createElement(Input, { minLength: 10, validationEvent: 'change', postLabel: 'Expense Type3', id: 'id-3' }), React.createElement(Input, { isNumber: true, minLength: 10, validationEvent: 'none', label: 'Expense Type4', id: 'id-4' }), React.createElement(Input, { id: 'id-5', isNumber: true, minLength: 10, postLabel: 'Expense Type5' }), React.createElement(Select, { id: 'id-6', options: [['', ''], ['1', 'option1'], ['2', 'option2']], required: true, preLabel: 'Expense Type6' }), React.createElement(Select, { id: 'id-7', options: [['', ''], ['1', 'option1'], ['2', 'option2']], postLabel: 'Expense Type7' }), React.createElement(Input, { id: 'id-8', isNumber: true, minLength: 10, label: 'ReportName', swagger: swagger, field: 'ReportName' }), React.createElement(Input, { id: 'id-9', isNumber: true, minLength: 10, label: 'ReportAmount', swagger: swagger, field: 'ReportAmount' }), React.createElement(Select, { id: 'id-10', options: [['0', '--'], ['10', 'option1'], ['20', 'option2']], label: 'ReportItems', swagger: swagger, field: 'ReportItems' }), React.createElement(Input, { id: 'id-11', label: 'ReportDate', swagger: swagger, field: 'ReportDate' }), React.createElement(Select, { id: 'id-12', options: [['false', '--'], ['true', 'TRUE'], ['false', 'FALSE']], label: 'ReportSubmitted', swagger: swagger, field: 'ReportSubmitted' }), React.createElement(Input, { id: 'id-13', width: 20, isNumber: true, minLength: 10, label: 'Expense Type6' }), React.createElement(Input, { id: 'id-14', label: 'Disabled', disabled: true, initialValue: 'DISABLED' }), React.createElement(Input, { id: 'id-15', label: 'ReadOnly', readOnly: true, initialValue: 'READONLY' }), React.createElement(CheckBox, { id: 'id-16', label: 'Checkbox1', required: true, value: 'Checkbox1' }), React.createElement(CheckBox, { id: 'id-17', label: 'Checkbox2', checked: true, value: 'Checkbox2' }), React.createElement(Button, { id: 'id-18', value: 'Button1' }), React.createElement(Button, { id: 'id-19', value: 'Button2', type: 'submit', disabled: true }), React.createElement(Button, { id: 'id-20', value: 'Button3', type: 'reset' }),
    /*<Radio label="Radio1" name="radio" checked={true} value="Radio1" />
    <Radio label="Radio2" name="radio" value="Radio2" />
    <Radio label="Radio3" name="radio3" value="Radio3" />*/
    React.createElement(Input, {
      id: 'id-21',
      label: 'customvalidation',
      customValidation: this._validate }));
  }
});

module.exports = Form;