'use strict';

var React = require('react');
var debug = require('debug')('react-accessible-form:generate');

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

var GenerateFormFields = React.createClass({ displayName: 'GenerateFormFields',
    propTypes: {
        data: React.PropTypes.object.isRequired
    },
    _getData: function _getData(definitions) {
        var formFields = [];

        if (definitions) {
            definitions.sort(function (a, b) {
                if (a.sequence > b.sequence) {
                    return 1;
                }

                if (a.sequence < b.sequence) {
                    return -1;
                }

                return 0;
            }).forEach(function (fieldInfo, i) {
                var ctrlType = fieldInfo.ctrlType.toLowerCase();
                if (fieldInfo.pattern) {
                    fieldInfo['validationPattern'] = fieldInfo.pattern;
                }

                formFields.push(FormFieldTypes[ctrlType](fieldInfo, i));
            });
        }

        return formFields;
    },
    getDefaultProps: function getDefaultProps() {
        return {
            data: {
                formDef: []
            }
        };
    },
    render: function render() {
        var formFields = this._getData(this.props.data.formDef);

        return React.createElement('div', null, formFields);
    }
});

module.exports = GenerateFormFields;