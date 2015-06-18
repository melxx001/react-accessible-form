'use strict';

var React = require('react');
var Input = require('./formfields/InputTest');
var Select = require('./formfields/SelectTest');

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
	time: function time(options, key) {
		return React.createElement(Input, React.__spread({ type: 'time', key: key }, options));
	},
	datetime: function datetime(options, key) {
		return React.createElement(Input, React.__spread({ type: 'datetime', key: key }, options));
	},
	datetimelocal: function datetimelocal(options, key) {
		return React.createElement(Input, React.__spread({ type: 'datetime-local', key: key }, options));
	},
	date: function date(options, key) {
		return React.createElement(Input, React.__spread({ type: 'date', key: key }, options));
	},
	email: function email(options, key) {
		return React.createElement(Input, React.__spread({ type: 'email', key: key }, options));
	},
	password: function password(options, key) {
		return React.createElement(Input, React.__spread({ type: 'password', key: key }, options));
	},
	hidden: function hidden(options, key) {
		return React.createElement(Input, React.__spread({ type: 'hidden', key: key }, options));
	},
	image: function image(options, key) {
		return React.createElement(Input, React.__spread({ type: 'image', key: key }, options));
	},
	number: function number(options, key) {
		return React.createElement(Input, React.__spread({ type: 'text', key: key }, options));
	},
	/*radio: function(options, key){
 	return <Radio key={key} {...options} />
 },*/
	/*checkbox: function(options, key){
 	return <CheckBox key={key} {...options} />
 },*/
	file: function file(options, key) {
		return React.createElement(Input, React.__spread({ type: 'file', key: key }, options));
	},
	range: function range(options, key) {
		return React.createElement(Input, React.__spread({ type: 'range', key: key }, options));
	},
	telephone: function telephone(options, key) {
		return React.createElement(Input, React.__spread({ type: 'tel', key: key }, options));
	},
	url: function url(options, key) {
		return React.createElement(Input, React.__spread({ type: 'url', key: key }, options));
	},
	button: function button(options, key) {
		return React.createElement(Input, React.__spread({ type: 'button', key: key }, options));
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