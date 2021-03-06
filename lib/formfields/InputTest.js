'use strict';

var React = require('react');
//var swaggerTools = require('swagger-tools')
//var spec = swaggerTools.specs.v2
var validator = require('../validation');
var formValidation = new validator();

// Will move this function to an appropriate location
/*function updateValue(value, type = "string", format = ""){
	type = type.toLowerCase()
	format = format.toLowerCase()

	if(type === 'object' && format === 'date'){
		return new Date(value)
	}

	if(type === "number"){
		return (format === "float") ? parseFloat(value) : parseInt(value);
	}

	if(type === "boolean"){
		return Boolean(value);
	}

	return value;
}*/

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
		fieldClassName: React.PropTypes.string,
		field: React.PropTypes.string
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
			isValid: this.props.initialValue ? true : false,
			value: this.props.initialValue,
			validationError: ''
		};
	},
	_onChange: function _onChange(event) {
		var data = event.target;
		var trimmed = data.value.trim();

		this.setState({
			value: trimmed
		});

		if (this.props.schema) {
			/*let properties = {}
   	Object.keys(this.props.properties).forEach((item) => {
   	properties[item] = updateValue(trimmed, this.props.properties[this.props.field].type, this.props.properties[this.props.field].format)
   })
   
   spec.validateModel(this.props.schema, '#/definitions/Expenses', properties, (err, result) => {
       this.setState({
       	validationError: ''
       })
   	    if (result && result.errors) {
       	console.log(result)
           result.errors.forEach( (error) => {
               if (error.path[0] === this.props.field) {
                   this.setState({
                   	validationError: error.message,
                   	isValid: false
                   })
               }
           })
       }
   })*/

			var results = formValidation.swaggerValidate(trimmed, this.props.field, this.props.schema, this.props.properties, '#/definitions/Expenses');
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
		var type = this.props.type.toLowerCase();
		return React.createElement('div', { className: this.props.groupClassName }, React.createElement('label', { className: this.props.labelClassName }, this.props.label), React.createElement('input', {
			type: type,
			name: this.props.name,
			size: this.props.width,
			maxLength: this.props.maxLength,
			minLength: this.props.minLength,
			'data-validate-required': this.props.required,
			'data-validate-minimum-length': this.props.minLength,
			'data-validate-maximum-length': this.props.maxLength,
			'data-validate-pattern': type === 'password' || type === 'tel' ? undefined : this.props.pattern,
			'data-validate-email': type === 'email' ? true : undefined,
			'data-validate-password': type === 'password' ? this.props.pattern : undefined,
			'data-validate-telephone': type === 'tel' ? this.props.pattern : undefined,
			'data-validate-url': type === 'url' ? true : undefined,
			'data-validate-date': type === 'date' ? true : undefined,
			'data-validate-date-time': type === 'datetime' || type === 'datetime-local' ? true : undefined,
			'data-validate-float': this.props.format === 'float' ? true : undefined,
			'data-validate-integer': this.props.format === 'int32' || this.props.format === 'int64' ? true : undefined,
			max: this.props.max,
			min: this.props.min,
			step: this.props.step,
			src: this.props.source,
			pattern: this.props.pattern,
			placeholder: this.props.placeHolder,
			required: this.props.required,
			'data-isvalid': this.state.isValid,
			onChange: this._onChange,
			value: this.state.value,
			fieldClassName: this.props.fieldClassName,
			readOnly: this.props.readOnly }), React.createElement('p', { className: this.props.errorClassName, style: this.state.validationError ? { color: 'red' } : undefined }, this.state.validationError));
	}
});

module.exports = Input;