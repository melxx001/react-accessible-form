var React = require('react')
//var swaggerTools = require('swagger-tools')

var Input = React.createClass({
	handleChange: function (event) {
		console.log('change')
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
        	<Input schema={this.props} type="text" label="Expense Type1" id="id-1" sequence="1" />
        	<Input schema={this.props} type="text" label="Expense Type2" id="id-2" sequence="2" />
        </div>
      
    );
  }
});

module.exports = Form