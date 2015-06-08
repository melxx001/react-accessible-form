'use strict';

var React = require('react');
var Input = require('./formfields/Input');
var Select = require('./formfields/Select');

// Simulate api call
var data = require('../example/data/BuildJSONSchemaFormData.json');

// Form field types
var formFieldType = {
	string: 'text',
	number: 'text',
	email: 'email',
	password: 'password',
	object: {
		date: 'date'
	}
};

// Get the form field type
function getType() {
	var type = arguments[0] === undefined ? 'string' : arguments[0];
	var format = arguments[1] === undefined ? '' : arguments[1];

	type = type.toLowerCase();
	if (type === 'object' && format) {
		return formFieldType[type][format];
	}

	return formFieldType[type];
}

function localization(type) {
	return type + ' Field';
}

var Formfields = {
	input: function input(options, key) {
		return React.createElement(Input, React.__spread({ key: key }, options));
	},
	select: function select(options, key) {
		//options.key = options.key || key
		return React.createElement(Select, React.__spread({ key: key }, options));
	}
};

// Will be in a different file.
// Did not take in consideration the error section in the swagger doc yet.
var definitions = data.FormDef;
var formItems = [];
definitions.map(function (fieldInfo, i) {
	var fieldType = fieldInfo.fieldType.toLowerCase();
	formItems.push(Formfields[fieldType](fieldInfo, i));
});

var Form = React.createClass({ displayName: 'Form',
	render: function render() {
		return React.createElement('div', null, formItems);
	}
});

module.exports = Form;