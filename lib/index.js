'use strict';

var React = require('react');
var ReactBootstrap = require('react-bootstrap');
//var validator = require('../concur-form-validator');
//var formValidation = new validator();
var debug = require('debug')('react-accessible-forms:index.jsx');

var generate_schema = require('generate-schema');

function getSchema(json) {
	debug('Generating schema');
	return generate_schema.json(json);
}

exports.getSchema = getSchema;

var Input = React.createClass({ displayName: 'Input',
	propTypes: {
		required: React.PropTypes.bool,
		type: React.PropTypes.string,
		name: React.PropTypes.string,
		label: React.PropTypes.string,
		placeHolder: React.PropTypes.string,
		minLength: React.PropTypes.number
	},
	getDefaultProps: function getDefaultProps() {
		return {
			required: false,
			type: 'text',
			name: '',
			label: '',
			minLength: 0,
			placeHolder: '',
			initialValue: ''
		};
	},
	getInitialState: function getInitialState() {
		return {
			errors: '',
			isValid: false,
			value: this.props.initialValue
		};
	},
	validate: function validate(event) {},
	render: function render() {
		return React.createElement('div', null, React.createElement(ReactBootstrap.Input, {
			type: this.props.type,
			name: this.props.name,
			label: this.props.label,
			placeholder: this.props.placeHolder,
			'data-validate-required': this.props.required,
			'data-validate-minimum': this.props.minLength,
			'data-isvalid': this.state.isValid,
			bsStyle: this.state.isValid ? 'success' : 'error',
			onChange: this.validate,
			value: this.state.value,
			groupClassName: 'group-class',
			labelClassName: 'label-class' }), React.createElement('span', null, this.state.errors));
	}
});

var Select = React.createClass({ displayName: 'Select',
	propTypes: {
		required: React.PropTypes.bool,
		name: React.PropTypes.string,
		label: React.PropTypes.string,
		options: React.PropTypes.any.isRequired
	},
	getDefaultProps: function getDefaultProps() {
		return {
			required: false,
			name: '',
			label: '',
			options: [['', '']],
			initialValue: ''
		};
	},
	getInitialState: function getInitialState() {
		return {
			errors: '',
			isValid: false,
			value: this.props.initialValue
		};
	},
	validate: function validate(event) {
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
			isValid: messages.length === 0 ? true : false
		});
	},
	render: function render() {
		var options = this.props.options;
		var optionsHtml = [];
		Object.keys(options).forEach(function (option, i) {
			var choice = options[i];
			optionsHtml.push(React.createElement('option', { key: i, value: choice[0] }, choice[1]));
		});
		return React.createElement('div', null, React.createElement('label', null, this.props.label), React.createElement('select', {
			name: this.props.name,
			placeholder: this.props.placeHolder,
			'data-validate-required': this.props.required,
			'data-isvalid': this.state.isValid,
			onChange: this.validate,
			value: this.state.value
		}, optionsHtml), React.createElement('span', null, this.state.errors));
	}
});

var fields = {
	input: function input(options) {
		return React.createElement(Input, React.__spread({}, options));
	},
	select: function select(options) {
		return React.createElement(Select, React.__spread({}, options));
	}
};

var FormComponent = React.createClass({ displayName: 'FormComponent',
	getInitialState: function getInitialState() {
		return {
			options: this.props // Probably don't need this as a state
		};
	},
	render: function render() {
		var temp = [];
		var options = this.state.options;

		Object.keys(options).forEach(function (option, i) {
			var formRowData = options[option];
			formRowData.key = i;
			temp.push(fields[formRowData.widget.toLowerCase()](formRowData));
		});

		return React.createElement('div', null, temp);
	}
});

exports.Input = Input;
exports.Select = Select;
exports.FormComponent = FormComponent;

/*var data = event.target;
var results = formValidation.validate(data.value, data.dataset);
var messages = [];
results.forEach(function(result){
	if(result.error){
		messages.push(result.message)
	}
});
	this.setState({
	value: data.value,
	errors: messages.join(" - "),
	isValid: (messages.length === 0) ? true : false
});*/