'use strict';

var React = require('react');
var swaggerTools = require('swagger-tools');
var spec = swaggerTools.specs.v2;

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
			required: false,
			type: 'text',
			name: '',
			label: '',
			/*minLength: 0,
   maxLength: 0,
   min: 0,
   max: 0,
   width: 0,*/
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

		var properties = {};

		Object.keys(this.props.properties).forEach(function (item) {
			properties[item] = updateValue(trimmed, _this.props.properties[_this.props.field].type, _this.props.properties[_this.props.field].format);
		});

		spec.validateModel(this.props.schema, '#/definitions/Expenses', properties, function (err, result) {
			_this.setState({
				validationError: ''
			});

			if (result && result.errors) {
				result.errors.forEach(function (error) {
					if (error.path[0] === _this.props.field) {
						_this.setState({ validationError: error.message });
					}
				});
			}
		});
	},
	render: function render() {
		return React.createElement('div', { className: this.props.groupClassName }, React.createElement('label', { className: this.props.labelClassName }, this.props.label), React.createElement('input', {
			type: this.props.type,
			name: this.props.name,
			label: this.props.label,
			size: this.props.width,
			maxLength: this.props.maxLength,
			minLength: this.props.minLength,
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
/*pattern: "",
groupClassName: "",
fieldClassName: "",
labelClassName: ""*/