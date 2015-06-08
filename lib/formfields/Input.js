'use strict';

var React = require('react');
var swaggerTools = require('swagger-tools');
var spec = swaggerTools.specs.v2;
var validator = require('../validation');
var formValidation = new validator();

// Will move this function to an appropriate location
function updateValue(value) {
	var type = arguments[1] === undefined ? 'string' : arguments[1];
	var format = arguments[2] === undefined ? '' : arguments[2];

	type = type.toLowerCase();
	format = format.toLowerCase();

	if (type === 'object' && format === 'date') {
		return new Date(value);
	}

	if (type === 'number') {
		return format === 'float' ? parseFloat(value) : parseInt(value);
	}

	if (type === 'boolean') {
		return Boolean(value);
	}

	return value;
}

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
		width: React.PropTypes.number,
		pattern: React.PropTypes.string,
		groupClassName: React.PropTypes.string,
		labelClassName: React.PropTypes.string,
		errorClassName: React.PropTypes.string,
		fieldClassName: React.PropTypes.string
	},
	getDefaultProps: function getDefaultProps() {
		return {
			type: 'text',
			name: '',
			label: '',
			placeHolder: '',
			initialValue: ''
		};
	},
	getInitialState: function getInitialState() {
		return {
			errors: '',
			isValid: false,
			value: this.props.initialValue,
			validationError: ''
		};
	},
	_onChange: function _onChange(event) {
		var _this = this;

		var trimmed = event.target.value.trim();

		this.setState({
			value: trimmed
		});

		if (this.props.schema) {
			(function () {
				var properties = {};

				Object.keys(_this.props.properties).forEach(function (item) {
					properties[item] = updateValue(trimmed, _this.props.properties[_this.props.field].type, _this.props.properties[_this.props.field].format);
				});

				spec.validateModel(_this.props.schema, '#/definitions/Expenses', properties, function (err, result) {
					_this.setState({
						validationError: ''
					});

					if (result && result.errors) {
						console.log(result);
						result.errors.forEach(function (error) {
							if (error.path[0] === _this.props.field) {
								_this.setState({ validationError: error.message });
							}
						});
					}
				});
			})();
		} else {
			var data = event.target;
			var results = formValidation.validate(data.value, data.dataset);
			var messages = [];
			results.forEach(function (result) {
				if (result.error) {
					messages.push(result.message);
				}
			});

			this.setState({
				value: data.value,
				errors: messages.join(' - '),
				validationError: messages.join(' - '),
				isValid: messages.length === 0 ? true : false
			});
		}
	},
	render: function render() {
		return React.createElement('div', { className: this.props.groupClassName }, React.createElement('label', { className: this.props.labelClassName }, this.props.label), React.createElement('input', {
			type: this.props.type,
			name: this.props.name,
			size: this.props.width,
			maxLength: this.props.maxLength,
			minLength: this.props.minLength,
			'data-validate-required': this.props.required,
			'data-validate-minimum-length': this.props.minLength,
			'data-validate-maximum-length': this.props.maxLength,
			'data-validate-pattern': this.props.pattern,
			max: this.props.max,
			min: this.props.min,
			pattern: this.props.pattern,
			placeholder: this.props.placeHolder,
			required: this.props.required,
			'data-isvalid': this.state.isValid,
			onChange: this._onChange,
			value: this.state.value,
			fieldClassName: this.props.fieldClassName }), React.createElement('p', { className: this.props.errorClassName }, this.state.validationError));
	}
});

module.exports = Input;