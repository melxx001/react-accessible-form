var React = require( 'react' );

var Button = React.createClass({
	propTypes: {
		name: React.PropTypes.string,
		groupClassName: React.PropTypes.string,
		fieldClassName: React.PropTypes.string,
		disabled: React.PropTypes.bool,
		id: React.PropTypes.string,
		value: React.PropTypes.string.isRequired,
		type: React.PropTypes.string
	},
	getDefaultProps: function(){
		return {
			type: 'button'
		};
	},
	render: function () {
		return (
			<div className = { this.props.groupClassName }>
				<input
					id = { this.props.id }
					type = { this.props.type }
					name = { this.props.name }
					value = { this.props.value }
					className = { this.props.fieldClassName }
					disabled = { this.props.disabled }
				/>
			</div>
		);
	}
});

module.exports = Button;
