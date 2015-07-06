'use strict';

var React = require('react');
var validator = require('../validation');
var formValidation = new validator();

var TextArea = React.createClass({ displayName: 'TextArea',
    propTypes: {
        required: React.PropTypes.bool,
        name: React.PropTypes.string.isRequired,
        label: React.PropTypes.node,
        prelabel: React.PropTypes.node,
        postlabel: React.PropTypes.node,
        placeHolder: React.PropTypes.string,
        minLength: React.PropTypes.number,
        maxLength: React.PropTypes.number,
        groupClassName: React.PropTypes.string,
        labelClassName: React.PropTypes.string,
        errorClassName: React.PropTypes.string,
        fieldClassName: React.PropTypes.string,
        validationEvent: React.PropTypes.string,
        validationPattern: React.PropTypes.string,
        readOnly: React.PropTypes.bool,
        disabled: React.PropTypes.bool,
        id: React.PropTypes.string,
        schemaInfo: React.PropTypes.shape({
            schema: React.PropTypes.object.isRequired,
            definition: React.PropTypes.string.isRequired
        }),
        field: React.PropTypes.string,
        customValidation: React.PropTypes.func,
        rows: React.PropTypes.number,
        cols: React.PropTypes.number,
        wrap: React.PropTypes.string
    },
    getDefaultProps: function getDefaultProps() {
        return {
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
        var value = target.value;

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
        var _this2 = this;

        this.setState({
            value: this.props.initialValue,
            errors: [],
            isValid: true
        }, function () {
            // Run the parent onReset if it exists
            if (_this2.props.onReset) {
                _this2.props.onReset(_this2);
            }
        });
    },
    _onBlur: function _onBlur(event) {
        // Run the parent onBlur if it exists
        if (this.props.onBlur) {
            this.props.onBlur(this);
        }

        // Validate onBlur by default
        if (!this.props.validationEvent || this.props.validationEvent && this.props.validationEvent.toLowerCase() === 'blur') {
            this._validate(this.state.value, event.target.dataset);
        }
    },
    _onInput: function _onInput(event) {
        // Run the parent onInput if it exists
        if (this.props.onInput) {
            this.props.onInput(this);
        }

        // Validate on onInput if explicitly set
        if (this.props.validationEvent && this.props.validationEvent.toLowerCase() === 'input') {
            this._validate(this.state.value, event.target.dataset);
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
        var _this3 = this;

        var nextProps = arguments[0] === undefined ? {} : arguments[0];

        if (nextProps.reset) {
            this._onReset();
        } else if (nextProps.formValidation && nextProps.formValidation.complete) {
            (function () {
                var element = formValidation.findValidatedComponent(nextProps.formValidation.results, _this3.props);
                var messages = [];

                if (element) {
                    element.errors.forEach(function (error) {
                        messages.push(error.message);
                    });
                }

                _this3.setState({
                    errors: messages,
                    isValid: messages.length === 0 ? true : false
                });
            })();
        }
    },
    render: function render() {
        var _this4 = this;

        var preLabel = undefined;
        var postLabel = undefined;
        var errors = [];
        var errorId = undefined;
        var fieldClassName = this.props.fieldClassName;

        if (this.props.preLabel || this.props.label) {
            preLabel = React.createElement('label', { htmlFor: this.props.id, className: this.props.labelClassName }, this.props.preLabel || this.props.label);
        } else if (this.props.postLabel) {
            postLabel = React.createElement('label', { htmlFor: this.props.id, className: this.props.labelClassName }, this.props.postLabel);
        } else {
            console.warn('Warning: Failed propType: Required prop `label`, `preLabel` or `postLabel` was not specified in `TextArea`.');
        }

        if (this.state.errors.length > 0) {
            errorId = '__' + (this.props.id ? this.props.id : '') + '-errors';
            if (this.props.fieldErrorClassName) {
                fieldClassName = [fieldClassName ? fieldClassName : ' ', this.props.fieldErrorClassName].join('');
            }

            this.state.errors.forEach(function (error, i) {
                // used an arrow function to keep the context of this
                errors.push(React.createElement('span', { key: 'errmessage' + i, className: _this4.props.errorClassName }, error));
            });
        }

        return React.createElement('div', { className: this.props.groupClassName }, preLabel, React.createElement('textarea', {
            id: this.props.id,
            name: this.props.name,
            rows: this.props.rows,
            cols: this.props.cols,
            wrap: this.props.wrap,
            'data-validate-required': this.props.required,
            'data-validate-minimum-length': this.props.minLength,
            'data-validate-maximum-length': this.props.maxLength,
            'data-validate-pattern': this.props.validationPattern,
            'data-is-valid': this.state.isValid,
            'aria-invalid': !this.state.isValid, // Is this correct?
            'aria-required': this.props.required,
            'aria-describedby': errorId,
            placeholder: this.props.placeHolder,
            onChange: this._onChange,
            onBlur: this._onBlur,
            onInput: this._onInput,
            onReset: this._onReset,
            value: this.state.value,
            className: fieldClassName,
            readOnly: this.props.readOnly,
            disabled: this.props.disabled }), postLabel, React.createElement('span', { id: errorId }, errors));
    }
});

module.exports = TextArea;