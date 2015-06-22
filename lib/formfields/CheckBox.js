'use strict';

var React = require('react');
var validator = require('../validation');
var formValidation = new validator();
var cuid = require('cuid');

var CheckBox = React.createClass({ displayName: 'CheckBox',
	propTypes: {
		name: React.PropTypes.string,
		label: React.PropTypes.string,
		groupClassName: React.PropTypes.string,
		labelClassName: React.PropTypes.string,
		errorClassName: React.PropTypes.string,
		fieldClassName: React.PropTypes.string,
		validationEvent: React.PropTypes.string,
		readOnly: React.PropTypes.bool,
		disabled: React.PropTypes.bool,
		checked: React.PropTypes.bool,
		value: React.PropTypes.string,
		id: React.PropTypes.string
	},
	getDefaultProps: function getDefaultProps() {
		return {
			checked: false,
			id: cuid() // Get a unique Id if it's not passed
		};
	},
	getInitialState: function getInitialState() {
		return {
			checked: this.props.checked ? true : false
		};
	},
	_onChange: function _onChange(event) {
		this.setState({
			checked: this.state.checked ? false : true
		});

		// Run the parent onChange if it exists
		if (this.props.onChange) {
			this.props.onChange(this);
		}
	},
	render: function render() {
		var preLabel = undefined;
		var postLabel = undefined;
		var errors = [];

		if (this.props.preLabel || this.props.label) {
			preLabel = React.createElement('label', { htmlFor: this.props.id, className: this.props.labelClassName }, this.props.preLabel || this.props.label);
		} else if (this.props.postLabel) {
			postLabel = React.createElement('label', { htmlFor: this.props.id, className: this.props.labelClassName }, this.props.postLabel);
		}

		return React.createElement('div', { className: this.props.groupClassName }, preLabel, React.createElement('input', {
			id: this.props.id,
			type: 'checkbox',
			name: this.props.name,
			onChange: this._onChange,
			value: this.props.value,
			className: this.props.fieldClassName,
			readOnly: this.props.readOnly,
			disabled: this.props.disabled,
			checked: this.state.checked }), postLabel);
	}
});

module.exports = CheckBox;