'use strict';

var React = require('react');
var validator = require('../validation');
var formValidation = new validator();
var cuid = require('cuid');

var Input = React.createClass({ displayName: 'Input',
	propTypes: {
		required: React.PropTypes.bool,
		type: React.PropTypes.string,
		name: React.PropTypes.string,
		label: React.PropTypes.string,
		placeHolder: React.PropTypes.string,
		minLength: React.PropTypes.number,
		maxLength: React.PropTypes.number,
		max: React.PropTypes.number,
		min: React.PropTypes.number,
		step: React.PropTypes.number,
		width: React.PropTypes.number,
		pattern: React.PropTypes.string,
		groupClassName: React.PropTypes.string,
		labelClassName: React.PropTypes.string,
		errorClassName: React.PropTypes.string,
		fieldClassName: React.PropTypes.string,
		validation: React.PropTypes.string,
		isNumber: React.PropTypes.bool,
		source: React.PropTypes.string,
		format: React.PropTypes.string,
		readOnly: React.PropTypes.bool
	},
	getDefaultProps: function getDefaultProps() {
		return {
			type: 'text',
			initialValue: '',
			id: cuid() // Get a unique Id if it's not passed
		};
	},
	getInitialState: function getInitialState() {
		return {
			errors: '',
			isValid: this.props.initialValue ? true : false,
			value: this.props.initialValue
		};
	},
	_onChange: function _onChange(event) {
		this.setState({
			value: event.target.value.trim()
		});

		// Run the parent onChange if it exists
		if (this.props.onChange) {
			this.props.onChange(this);
		}

		// Validate on onChange if explicitely set
		if (this.props.validation && this.props.validation.toLowerCase() === 'change') {
			this.validate(this.state.value, event.target.dataset);
		}
	},
	_onBlur: function _onBlur(event) {
		// Run the parent onBlur if it exists
		if (this.props.onBlur) {
			this.props.onBlur(this);
		}

		// Validate onBlur by default
		if (!this.props.validation || this.props.validation && this.props.validation.toLowerCase() === 'blur') {
			this.validate(this.state.value, event.target.dataset);
		}
	},
	validate: function validate(value, dataset) {
		var results = formValidation.validate(value, dataset);
		var messages = [];

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
	render: function render() {
		var _this = this;

		var type = this.props.type.toLowerCase();
		var preLabel = undefined;
		var postLabel = undefined;
		var format = this.props.format ? this.props.format.toLowerCase() : '';
		var errors = [];

		if (this.props.preLabel || this.props.label) {
			preLabel = React.createElement('label', { htmlFor: this.props.id, className: this.props.labelClassName }, this.props.preLabel || this.props.label);
		} else if (this.props.postLabel) {
			postLabel = React.createElement('label', { htmlFor: this.props.id, className: this.props.labelClassName }, this.props.postLabel);
		}

		if (this.state.errors.length > 0) {
			this.state.errors.forEach(function (error, i) {
				// used an arrow fucntion to keep the context of this
				errors.push(React.createElement('span', { key: 'errmessage' + i, className: _this.props.errorClassName }, error));
			});
		}

		return React.createElement('div', { className: this.props.groupClassName }, preLabel, React.createElement('input', {
			id: this.props.id,
			type: type,
			name: this.props.name,
			size: this.props.width,
			'data-validate-required': this.props.required,
			'data-validate-minimum-length': this.props.minLength,
			'data-validate-maximum-length': this.props.maxLength,
			'data-validate-pattern': type === 'password' || type === 'tel' ? undefined : this.props.pattern,
			'data-validate-email': type === 'email' ? true : undefined,
			'data-validate-password': type === 'password' ? this.props.pattern : undefined,
			'data-validate-telephone': type === 'tel' ? this.props.pattern : undefined,
			'data-validate-float': format === 'float' ? true : undefined,
			'data-validate-integer': format === 'int32' || format === 'int64' ? true : undefined,
			'data-validate-number': this.props.isNumber ? true : undefined,
			'data-isvalid': this.state.isValid,
			max: this.props.max,
			min: this.props.min,
			step: this.props.step,
			src: this.props.source,
			placeholder: this.props.placeHolder,
			onChange: this._onChange,
			onBlur: this._onBlur,
			value: this.state.value,
			fieldClassName: this.props.fieldClassName,
			readOnly: this.props.readOnly }), postLabel, errors);
	}
});

module.exports = Input;