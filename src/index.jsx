var React = require('react')
//var swaggerTools = require('../swaggertools')
var tv4 = require('tv4')
var zSchema = require('z-schema')

var Input = React.createClass({
	handleChange: function (event) {
		var schema = require('../example/swagger.json')

		console.log('change')
		/*var valid = tv4.validate({ids: '10'}, schema)
		console.log(valid)
		if(!valid && tv4.error){
			this.setState({ validationError: tv4.error.message })
		}

		var validator = new zSchema()
		
		valid = validator.validate({
			id: '10',
			sequence: 1,
			ctrlType: 'edit',
			dataType: 'CHAR',
			label: 'test'
		}, schema)
		console.log(valid)
		if(!valid){
			var error = validator.getLastError();
			//this.setState({ validationError: JSON.stringify(error) })
		}*/

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
  //var formData = createForm();
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