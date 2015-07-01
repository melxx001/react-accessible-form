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

var Select = React.createClass({ displayName: 'Select',
	propTypes: {
		required: React.PropTypes.bool,
		selected: React.PropTypes.bool,
		name: React.PropTypes.string,
		label: React.PropTypes.string,
		groupClassName: React.PropTypes.string,
		labelClassName: React.PropTypes.string,
		errorClassName: React.PropTypes.string,
		fieldClassName: React.PropTypes.string,
		options: React.PropTypes.array,
		field: React.PropTypes.string
	},
	getDefaultProps: function getDefaultProps() {
		return {
			name: '',
			options: [['', '']],
			initialValue: '' };
	},
	getInitialState: function getInitialState() {
		return {
			errors: '',
			isValid: this.props.initialValue ? true : false,
			value: this.props.initialValue,
			validationError: ''
		};
	},
	_onChange: function _onChange(event) {
		var _this = this;

		var data = event.target;
		var trimmed = data.value.trim();

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
								_this.setState({
									validationError: error.message,
									isValid: false
								});
							}
						});
					}
				});
			})();
		} else {
			var results = formValidation.validate(trimmed, data.dataset);
			var messages = [];
			results.forEach(function (result) {
				if (result.error) {
					messages.push(result.message);
				}
			});

			this.setState({
				errors: messages.join(' - '),
				validationError: messages.join(' - '),
				isValid: messages.length === 0 ? true : false
			});
		}
	},
	render: function render() {
		var options = this.props.options;
		var optionsHtml = [];
		Object.keys(options).forEach(function (option, i) {
			var choice = options[i];
			optionsHtml.push(React.createElement('option', { key: i, value: choice[0] }, choice[1]));
		});

		return React.createElement('div', { className: this.props.groupClassName }, React.createElement('label', { className: this.props.labelClassName }, this.props.label), React.createElement('select', {
			name: this.props.name,
			required: this.props.required,
			'data-validate-required': this.props.required,
			'data-isvalid': this.state.isValid, //Set to false in beginning. Not be alway correct.
			onChange: this._onChange,
			value: this.state.value,
			fieldClassName: this.props.fieldClassName,
			readOnly: this.props.readOnly
		}, optionsHtml), React.createElement('p', { className: this.props.errorClassName, style: this.state.validationError ? { color: 'red' } : undefined }, this.state.validationError));
	}
});

module.exports = Select;