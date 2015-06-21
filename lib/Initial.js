'use strict';

var React = require('react');
var SwaggerTools = require('swagger-tools');
var schema = require('../example/data/Initial.json');

var Input = React.createClass({ displayName: 'Input',
	handleChange: function handleChange(event) {
		console.log('change');
		var spec = SwaggerTools.specs.v2;
		var parent = this;
		//debugger;
		spec.validateModel(schema, '#/definitions/Expenses', {
			id: event.target.value,
			sequence: parseInt(event.target.value),
			ctrlType: event.target.value
		}, function (err, result) {
			parent.setState({ validationError: '' });
			if (result && result.errors) {
				result.errors.forEach(function (error) {
					if (error.path[0] === parent.props.field) {
						parent.setState({ validationError: error.message });
					}
				});
			}
		});
	},
	getInitialState: function getInitialState() {
		return {
			validationError: ''
		};
	},
	render: function render() {
		return React.createElement('div', null, this.props.label, ':', React.createElement('input', { onChange: this.handleChange, type: 'text', placeholder: 'test' }), React.createElement('p', null, this.state.validationError));
	}
});

var Form = React.createClass({ displayName: 'Form',
	render: function render() {
		return React.createElement('div', null, React.createElement(Input, { schema: this.props, type: 'text', label: 'Expense Type1', id: 'id-1', sequence: '1', field: 'id' }), React.createElement(Input, { schema: this.props, type: 'text', label: 'Expense Type2', id: 'id-2', sequence: '2', field: 'sequence' }), React.createElement(Input, { schema: this.props, type: 'text', label: 'Expense Type2', id: 'id-2', sequence: '2', field: 'ctrlType' }));
	}
});

module.exports = Form;