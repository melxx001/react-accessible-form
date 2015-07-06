'use strict';

var React = require('react');
var debug = require('debug')('react-accessible-form:schema');

var _require = require('./FormFields');

var Input = _require.Input;
var Select = _require.Select;
var CheckBox = _require.CheckBox;
var Button = _require.Button;

var FormFieldTypes = {
    edit: function edit(options, key) {
        return React.createElement(Input, React.__spread({ type: 'text', key: 'gen' + key, id: '__' + options.name }, options));
    },
    time: function time(options, key) {
        return React.createElement(Input, React.__spread({ type: 'time', key: 'gen' + key, id: '__' + options.name }, options));
    },
    datetime: function datetime(options, key) {
        return React.createElement(Input, React.__spread({ type: 'datetime', key: 'gen' + key, id: '__' + options.name }, options));
    },
    datetimelocal: function datetimelocal(options, key) {
        return React.createElement(Input, React.__spread({ type: 'datetime-local', key: 'gen' + key, id: '__' + options.name }, options));
    },
    date: function date(options, key) {
        return React.createElement(Input, React.__spread({ type: 'date', key: 'gen' + key, id: '__' + options.name }, options));
    },
    email: function email(options, key) {
        return React.createElement(Input, React.__spread({ type: 'email', key: 'gen' + key, id: '__' + options.name }, options));
    },
    password: function password(options, key) {
        return React.createElement(Input, React.__spread({ type: 'password', key: 'gen' + key, id: '__' + options.name }, options));
    },
    hidden: function hidden(options, key) {
        return React.createElement(Input, React.__spread({ type: 'hidden', key: 'gen' + key, id: '__' + options.name }, options));
    },
    image: function image(options, key) {
        return React.createElement(Input, React.__spread({ type: 'image', key: 'gen' + key, id: '__' + options.name }, options));
    },
    number: function number(options, key) {
        return React.createElement(Input, React.__spread({ type: 'text', key: 'gen' + key, id: '__' + options.name }, options));
    },
    checkbox: function checkbox(options, key) {
        return React.createElement(CheckBox, React.__spread({ key: 'gen' + key, id: '__' + options.name }, options));
    },
    telephone: function telephone(options, key) {
        return React.createElement(Input, React.__spread({ type: 'tel', key: 'gen' + key, id: '__' + options.name }, options));
    },
    url: function url(options, key) {
        return React.createElement(Input, React.__spread({ type: 'url', key: 'gen' + key, id: '__' + options.name }, options));
    },
    button: function button(options, key) {
        return React.createElement(Button, React.__spread({ key: 'gen' + key, id: '__' + options.name }, options));
    },
    picklist: function picklist(options, key) {
        return React.createElement(Select, React.__spread({ key: 'gen' + key, id: '__' + options.name }, options));
    }
};

var FormFieldsSchema = React.createClass({ displayName: 'FormFieldsSchema',
    propTypes: {
        schema: React.PropTypes.object.isRequired,
        definition: React.PropTypes.string.isRequired
    },
    _getData: function _getData() {
        var formFields = [];
        var schema = this.props.schema;

        if (!schema.definitions || !this.props.definition) {
            return [];
        }

        var elements = schema.definitions[this.props.definition];

        if (!(elements && elements.properties)) {
            return [];
        }

        var requiredField = elements.required || [];
        var properties = elements.properties;

        Object.keys(properties).forEach(function (property) {
            var field = properties[property];
            var options = field;
            options = {
                label: property,
                name: property,
                options: field['enum'] ? field['enum'].map(function (value) {
                    return [value, value];
                }) : '',
                validationPattern: field.pattern
            };

            formFields.push(FormFieldTypes[field['enum'] ? 'picklist' : 'edit'](options, property));
        });

        return formFields;
    },
    getDefaultProps: function getDefaultProps() {
        return {
            schema: {},
            definition: ''
        };
    },
    render: function render() {
        var formFields = this._getData();

        return React.createElement('div', null, formFields);
    }
});

module.exports = FormFieldsSchema;