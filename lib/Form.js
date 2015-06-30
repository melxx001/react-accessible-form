'use strict';

var React = require('react');

var _require = require('./FormFields');

var Input = _require.Input;
var Select = _require.Select;
var CheckBox = _require.CheckBox;
var Button = _require.Button;
var Radio = _require.Radio;

var fields = {
    input: function input(options) {
        return React.createElement(Input, React.__spread({}, options));
    },
    select: function select(options) {
        return React.createElement(Select, React.__spread({}, options));
    },
    checkBox: function checkBox(options) {
        return React.createElement(CheckBox, React.__spread({}, options));
    } /*,
      button: function(options){
         return <Button {...options} />
      },
      radio: function(options){
         return <Radio {...options} />
      }*/
};

var Form = React.createClass({ displayName: 'Form',
    propTypes: {
        schemaInfo: React.PropTypes.shape({
            schema: React.PropTypes.object.isRequired,
            definition: React.PropTypes.string.isRequired
        }),
        formData: React.PropTypes.oneOfType([React.PropTypes.arrayOf(React.PropTypes.element)
        /*,React.PropTypes.shape({
            widget: React.PropTypes.string,
            type: React.PropTypes.string,
            label: React.PropTypes.string,
            placeHolder: React.PropTypes.string,
            id: React.PropTypes.string 
        })*/
        ]),
        formClassName: React.PropTypes.string
    },
    getDefaultProps: function getDefaultProps() {
        return {
            type: 'text',
            initialValue: ''
        };
    },
    getInitialState: function getInitialState() {
        return {
            errors: '',
            isValid: false
        };
    },
    _validate: function _validate() {},
    render: function render() {
        var formItems = [];

        if (this.props.schemaInfo && this.props.schemaInfo.schema && this.props.schemaInfo.schema) {
            var definitions = schema.definitions;
            Object.keys(definitions).map(function (form) {
                var properties = definitions[form].properties;
                Object.keys(properties).map(function (item, i) {
                    var formField = properties[item];
                    formItems.push();
                });
            });
        } else if (this.props.formData) {
            formItems = this.props.formData;
        }

        return React.createElement('div', { className: this.props.formClassName }, formItems);
    }
});

//                        <Input schema={schema} properties={properties} key={item} type={getType(formField.type, formField.format)} label={localization(item)} field={item} />