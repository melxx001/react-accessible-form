'use strict';

var React = require('react');

var Button = React.createClass({ displayName: 'Button',
	propTypes: {
		name: React.PropTypes.string,
		groupClassName: React.PropTypes.string,
		fieldClassName: React.PropTypes.string,
		disabled: React.PropTypes.bool,
		id: React.PropTypes.string,
		value: React.PropTypes.string.isRequired,
		type: React.PropTypes.string
	},
	render: function render() {
		var type = this.props.type ? this.props.type.toLowerCase() : 'button';
		return React.createElement('div', { className: this.props.groupClassName }, React.createElement('input', {
			id: this.props.id,
			type: type,
			name: this.props.name,
			value: this.props.value,
			className: this.props.fieldClassName,
			disabled: this.props.disabled }));
	}
});

module.exports = Button;