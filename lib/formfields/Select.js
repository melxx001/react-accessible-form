'use strict';

var React = require('react');
var validator = require('../validation');
var formValidation = new validator();
var cuid = require('cuid');

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
		validation: React.PropTypes.string,
		readOnly: React.PropTypes.bool,
		schema: React.PropTypes.string,
		options: React.PropTypes.array,
		id: React.PropTypes.string
	},
	getDefaultProps: function getDefaultProps() {
		return {
			options: [['', '']],
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

		var preLabel = undefined;
		var postLabel = undefined;
		var errors = [];
		var options = this.props.options;
		var optionsHtml = [];

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

		Object.keys(options).forEach(function (option, i) {
			var choice = options[i];
			optionsHtml.push(React.createElement('option', { key: 'option' + i, value: choice[0] }, choice[1]));
		});

		return React.createElement('div', { className: this.props.groupClassName }, preLabel, React.createElement('select', {
			id: this.props.id,
			name: this.props.name,
			'data-validate-required': this.props.required,
			'data-isvalid': this.state.isValid,
			placeholder: this.props.placeHolder,
			onChange: this._onChange,
			onBlur: this._onBlur,
			value: this.state.value,
			fieldClassName: this.props.fieldClassName,
			readOnly: this.props.readOnly
		}, optionsHtml), postLabel, errors);
	}
});

module.exports = Select;