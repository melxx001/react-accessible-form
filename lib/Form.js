'use strict';

var React = require('react');
var debug = require('debug')('react-accessible-form');
//var Actions = require('../../areas/shared/FormValidation/FormValidationActions');
var validator = require('./validation');
var formValidation = new validator();

function getFormData() {
    var form = arguments[0] === undefined ? {} : arguments[0];

    var formData = {
        postData: {},
        formData: {}
    };

    Object.keys(form).forEach(function (item) {
        if (form[item].name) {
            formData.formData[form[item].name] = {
                value: form[item].value,
                dataset: form[item].dataset
            };

            formData.postData[form[item].name] = form[item].value;
        }
    });

    return formData;
}

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
        formClassName: React.PropTypes.string,
        method: React.PropTypes.string,
        action: React.PropTypes.string,
        validationEvent: React.PropTypes.string,
        overrideValidation: React.PropTypes.func
    },
    getDefaultProps: function getDefaultProps() {
        return {
            method: 'POST',
            action: '',
            validationEvent: ''
        };
    },
    getInitialState: function getInitialState() {
        return {
            errors: [],
            isValid: false,
            isSubmitting: false,
            reset: false,
            validation: {}
        };
    },
    _validate: function _validate() {
        var event = arguments[0] === undefined ? { target: {} } : arguments[0];

        return formValidation.serverValidate(getFormData(event.target).formData, this.props.children, this.props.overrideValidation);
    },
    _onSubmit: function _onSubmit(event) {
        var _this = this;

        event.preventDefault();

        if (this.state.isSubmitting) {
            debug('Form already submitted');
            return;
        }

        // This is because event.target is null when
        // doing var evt = event;
        var evt = { target: event.target };

        this.setState({
            isSubmitting: true,
            reset: false,
            isValid: false,
            errors: [],
            validation: this.props.validation !== 'none' ? this._validate(event) : {}
        }, function () {
            // Run the parent onSubmit if it exists
            if (_this.props.onSubmit) {
                debug('Running parent submit method');
                _this.props.onSubmit(_this);
            }
        });
    },
    _onReset: function _onReset() {
        this.setState({
            isSubmitting: false,
            isValid: false,
            errors: [],
            reset: true
        });
    },
    render: function render() {
        var _this2 = this;

        var children = React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {
                reset: _this2.state.reset,
                formValidation: _this2.state.reset ? {} : {
                    complete: true,
                    results: _this2.state.validation,
                    status: 'FormValidation ended'
                }
            });
        });

        return React.createElement('form', {
            id: this.props.id,
            className: this.props.formClassName,
            action: this.props.action,
            method: this.props.method,
            onSubmit: this._onSubmit,
            onReset: this._onReset,
            'data-is-valid': this.state.isValid,
            'data-is-submitting': this.state.isSubmitting,
            validationEvent: this.props.validationEvent
        }, children);
    }
});

module.exports = Form;