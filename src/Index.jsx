var React = require('react')
var SwaggerTools = require('swagger-tools')
var schema = require('../example/data/Index.json')

var Input = React.createClass({
	handleChange: function (event) {
		console.log('change')
		var spec = SwaggerTools.specs.v2;
		var parent = this;
		//debugger;
		spec.validateModel(schema, '#/definitions/Expenses', {
			id: event.target.value,
			sequence: parseInt(event.target.value),
			ctrlType: event.target.value
		}, function (err, result) {
		    parent.setState({validationError: ''});
		    if (result && result.errors) {
		        result.errors.forEach(function (error) {
		            if (error.path[0] === parent.props.field) {
		                parent.setState({validationError: error.message});
		            }
		        });
		    }
		});
	},
	getInitialState: function () {
	    return {
	        validationError: ''
	    }
	},
	render: function () {
	    return (
	            <div>
	            	{this.props.label}:
	                <input onChange={this.handleChange} type="text" placeholder="test" />
	                <p>{this.state.validationError}</p>
	            </div>
	    )
	}
});


var Form = React.createClass({
  render: function() {
    return (
    	<div> 
        	<Input schema={this.props} type="text" label="Expense Type1" id="id-1" sequence="1" field="id" />
        	<Input schema={this.props} type="text" label="Expense Type2" id="id-2" sequence="2" field="sequence" />
        	<Input schema={this.props} type="text" label="Expense Type2" id="id-2" sequence="2" field="ctrlType" />
        </div>
      
    );
  }
});

module.exports = Form