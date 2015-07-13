'use strict';

var React = require('react');
var validator = require('../validation');
var formValidation = new validator();

var Select = React.createClass({ displayName: 'Select',
    propTypes: {
        required: React.PropTypes.bool,
        name: React.PropTypes.string.isRequired,
        label: React.PropTypes.node,
        prelabel: React.PropTypes.node,
        postlabel: React.PropTypes.node,
        groupClassName: React.PropTypes.string,
        labelClassName: React.PropTypes.string,
        errorClassName: React.PropTypes.string,
        fieldClassName: React.PropTypes.string,
        validationEvent: React.PropTypes.string,
        disabled: React.PropTypes.bool,
        options: React.PropTypes.array,
        id: React.PropTypes.string.isRequired,
        schemaInfo: React.PropTypes.shape({
            schema: React.PropTypes.object.isRequired,
            definition: React.PropTypes.string.isRequired }),
        initialValue: React.PropTypes.string,
        field: React.PropTypes.string,
        customValidation: React.PropTypes.func
    },
    getDefaultProps: function getDefaultProps() {
        return {
            options: [['', '']],
            initialValue: '',
            schemaInfo: {
                schema: {},
                definition: ''
            },
            field: ''
        };
    },
    getInitialState: function getInitialState() {
        return {
            errors: '',
            value: this.props.initialValue,
            isValid: true
        };
    },
    _onChange: function _onChange(event) {
        var _this = this;

        var target = event.target;
        var value = target.value.trim();
        this.setState({
            value: value
        }, function () {
            // Run the parent onChange if it exists
            if (_this.props.onChange) {
                _this.props.onChange(_this);
            }

            // Validate on onChange if explicitly set
            if (_this.props.validationEvent && _this.props.validationEvent.toLowerCase() === 'change') {
                _this._validate(_this.state.value, target.dataset);
            }
        });
    },
    _onReset: function _onReset() {
        // Run the parent onReset if it exists
        if (this.props.onReset) {
            this.props.onReset(this);
        }

        this.setState({
            value: this.props.initialValue,
            errors: [],
            isValid: true
        });
    },
    _onBlur: function _onBlur(event) {
        // Run the parent onBlur if it exists
        if (this.props.onBlur) {
            this.props.onBlur(this);
        }

        // Validate onBlur by default
        if (!this.props.validationEvent || this.props.validationEvent && this.props.validationEvent.toLowerCase() === 'blur') {
            this._validate(this.state.value, event.target ? event.target.dataset : {});
        }
    },
    _validate: function _validate(value, dataset) {
        var results = [];
        var messages = [];
        var schemaInfo = this.props.schemaInfo;

        results = formValidation.validate(value, dataset, this.props.customValidation, {
            value: value,
            field: this.props.field,
            schema: schemaInfo.schema,
            definition: schemaInfo.definition
        });

        results.forEach(function (result) {
            if (result.error) {
                messages.push(result.message);
            }
        });

        this.setState({
            errors: messages,
            isValid: messages.length === 0 ? true : false
        });
    },
    componentWillReceiveProps: function componentWillReceiveProps() {
        var _this2 = this;

        var nextProps = arguments[0] === undefined ? {} : arguments[0];

        if (nextProps.reset) {
            this._onReset();
        } else if (nextProps.formValidation && nextProps.formValidation.complete) {
            (function () {
                var element = formValidation.findValidatedComponent(nextProps.formValidation.results, _this2.props);
                var messages = [];

                if (element) {
                    element.errors.forEach(function (error) {
                        messages.push(error.message);
                    });
                }

                _this2.setState({
                    errors: messages,
                    isValid: messages.length === 0 ? true : false
                });
            })();
        }
    },
    render: function render() {
        var _this3 = this;

        var preLabel = undefined;
        var postLabel = undefined;
        var errors = [];
        var options = this.props.options;
        var optionsHtml = [];
        var errorId = undefined;
        var fieldClassName = this.props.fieldClassName;

        if (this.props.preLabel || this.props.label) {
            preLabel = React.createElement('label', { htmlFor: this.props.id, className: this.props.labelClassName }, this.props.preLabel || this.props.label);
        } else if (this.props.postLabel) {
            postLabel = React.createElement('label', { htmlFor: this.props.id, className: this.props.labelClassName }, this.props.postLabel);
        } else {
            console.warn('Warning: Failed propType: Required prop `label`, `preLabel` or `postLabel` was not specified in `Select`.');
        }

        if (this.state.errors.length > 0) {
            errorId = '__' + (this.props.id ? this.props.id : '') + '-errors';
            if (this.props.fieldErrorClassName) {
                fieldClassName = [fieldClassName ? fieldClassName : ' ', this.props.fieldErrorClassName].join('');
            }

            this.state.errors.forEach(function (error, i) {
                // used an arrow function to keep the context of this
                errors.push(React.createElement('span', { key: 'errmessage' + i, className: _this3.props.errorClassName }, error));
            });
        }

        Object.keys(options).forEach(function (option, i) {
            var choice = options[i];
            optionsHtml.push(React.createElement('option', { key: 'option' + i, value: choice[0] }, choice[1]));
        });

        return React.createElement('div', { className: this.props.groupClassName }, preLabel, React.createElement('select', {
            id: this.props.id,
            name: this.props.name,
            'data-validate-required': this.props.required,
            'data-is-valid': this.state.isValid,
            'aria-invalid': !this.state.isValid,
            'aria-required': this.props.required,
            'aria-describedby': errorId,
            onChange: this._onChange,
            onBlur: this._onBlur,
            onReset: this._onReset,
            className: fieldClassName,
            value: this.state.value, // Manipulation of the component's options is though value
            disabled: this.props.disabled
        }, optionsHtml), postLabel, React.createElement('span', { id: errorId }, errors));
    }
});

module.exports = Select;