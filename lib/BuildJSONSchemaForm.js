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
	edit: function edit(options, key) {
		return React.createElement(Input, React.__spread({ type: 'text', key: key }, options));
	},
	picklist: function picklist(options, key) {
		return React.createElement(Select, React.__spread({ key: key }, options));
	}
};

// Will be in a different file.
// Did not take in consideration the error section in the swagger doc yet.
var definitions = data.FormDef;
var formItems = [];
definitions.sort(function (a, b) {
	if (a.sequence > b.sequence) {
		return 1;
	}

	if (a.sequence < b.sequence) {
		return -1;
	}

	return 0;
}).map(function (fieldInfo, i) {
	var ctrlType = fieldInfo.ctrlType.toLowerCase();
	formItems.push(Formfields[ctrlType](fieldInfo, i));
});

var Form = React.createClass({ displayName: 'Form',
	render: function render() {
		return React.createElement('div', null, formItems);
	}
});

module.exports = Form;