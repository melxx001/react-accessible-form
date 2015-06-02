'use strict';

var React = require('react');
//var swaggerTools = require('swagger-tools')

var Input = React.createClass({ displayName: 'Input',
	handleChange: function handleChange(event) {
		console.log('change');
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
	//var formData = createForm();
	render: function render() {
		return React.createElement('div', null, React.createElement(Input, { schema: this.props, type: 'text', label: 'Expense Type1', id: 'id-1', sequence: '1' }), React.createElement(Input, { schema: this.props, type: 'text', label: 'Expense Type2', id: 'id-2', sequence: '2' }));
	}
});

module.exports = Form;
//var spec = swaggerTools.specs.v2;
/*var parent = this;
spec.validateModel(JSON.parse(this.props.schema), '#/definitions/Expenses', {
	id: this.props.id,
	sequence: this.props.sequence,
	formFields: [ event.target.value ]
}, function (err, result) {
	debugger;
    parent.setState({validationError: ''});
    if (result.errors) {
        result.errors.forEach(function (error) {
            if (error.path[0] === parent.props.field) {
                parent.setState({validationError: error.message});
            }
        });
    }
});*/