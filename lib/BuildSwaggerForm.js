'use strict';

var React = require('react');
var Input = require('./formfields/InputTest');

// Simulate api call
var schema = require('../example/data/BuildSwaggerForm.json');

// Form field types
var formFieldType = {
    string: 'text',
    number: 'number',
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

// Will be in a different file.
// Did not take in consideration the error section in the swagger doc yet.
var definitions = schema.definitions;
var formItems = [];
Object.keys(definitions).map(function (form) {
    var properties = definitions[form].properties;
    Object.keys(properties).map(function (item, i) {
        var formField = properties[item];
        formItems.push(React.createElement(Input, { schema: schema, properties: properties, key: item, type: getType(formField.type, formField.format), label: localization(item), field: item }));
    });
});

var Form = React.createClass({ displayName: 'Form',
    render: function render() {
        return React.createElement('div', null, formItems);
    }
});

module.exports = Form;