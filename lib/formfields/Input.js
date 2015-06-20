'use strict';

var React = require('react');

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
			initialValue: ''
		};
	},
	getInitialState: function getInitialState() {
		return {
			errors: '',
			isValid: this.props.initialValue ? true : false,
			value: this.props.initialValue
		};
	},
	_onChange: function _onChange(event) {},
	render: function render() {
		var type = this.props.type.toLowerCase();
		var preLabel = '';
		var postLabel = '';

		if (this.props.preLabel || this.props.label) {
			preLabel = React.createElement('label', { className: this.props.labelClassName }, this.props.preLabel || this.props.label);
		} else if (this.props.postLabel) {
			postLabel = React.createElement('label', { className: this.props.labelClassName }, this.props.postLabel);
		}

		return React.createElement('div', { className: this.props.groupClassName }, preLabel, React.createElement('input', {
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
			'data-isvalid': this.state.isValid,
			max: this.props.max,
			min: this.props.min,
			step: this.props.step,
			src: this.props.source,
			pattern: this.props.pattern,
			placeholder: this.props.placeHolder,
			required: this.props.required,
			onChange: this._onChange,
			value: this.state.value,
			fieldClassName: this.props.fieldClassName,
			readOnly: this.props.readOnly }), postLabel, React.createElement('span', { className: this.props.errorClassName }, this.state.errors));
	}
});

module.exports = Input;