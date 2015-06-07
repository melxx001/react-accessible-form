var React = require('react')
var swaggerTools = require('swagger-tools')
var schema = require('../example/data/buildswaggerform.json')

var Input = React.createClass({
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
	getDefaultProps: function() {
		return {
			required: false,
			type: 'text',
			name: "",
			label: "",
			/*minLength: 0,
			maxLength: 0,
			min: 0,
			max: 0,
			width: 0,*/
			placeHolder: "",
			initialValue: "",
			// pattern: "",
			groupClassName: "",
			fieldClassName: "",
			labelClassName: ""
		}
	},
	getInitialState: function () {
	    return {
	    	errors: "",
			isValid: false,
			value: this.props.initialValue,
	        validationError: ''
	    }
	},
	handleChange: function (event) {	
		this.setState({
			value: event.target.value.trim()
		});
		var spec = swaggerTools.specs.v2
		spec.validateModel(schema, '#/definitions/Expenses', {
			reportName: event.target.value,
			reportCategory: event.target.value,
			reportTotal: parseInt(event.target.value),
			reportDate: new Date(event.target.value)
		}, (err, result) => {
		    this.setState({
		    	validationError: ''
		    })

		    if (result && result.errors) {
		        result.errors.forEach( (error) => {
		            if (error.path[0] === this.props.field) {
		                this.setState({validationError: error.message})
		            }
		        })
		    }
		})
	},
	render: function () {
	    return (
            <div className = {this.props.groupClassName}>
            	<label className={this.props.labelClassName}>{this.props.label}</label>
                <input
                	type = {this.props.type} 
					name = {this.props.name}
					label = {this.props.label}
					size = {this.props.width}
					maxLength = {this.props.maxLength}
					minLength = {this.props.minLength}
					max = {this.props.max}
					min = {this.props.min}
					pattern = {this.props.pattern}
					placeholder = {this.props.placeHolder}
					required = {this.props.required}
					data-isvalid = {this.state.isValid}
					onChange = {this.handleChange}
					value = {this.state.value}
					fieldClassName = {this.props.fieldClassName}
				/>
                <p className={this.props.errorClassName}>{this.state.validationError}</p>
            </div>
	    )
	}
})

// Created after an api call
var SwaggerForm = React.createClass({
  render: function() {
    return (
    	<div> 
        	<Input type="text" label="Report Name" field="reportName" />
        	<Input type="text" label="Report Category" field="reportCategory" />
        	<Input type="number" label="Report Total" field="reportTotal" />
        	<Input type="date" label="Report Date" field="reportDate" />
        </div>
      
    )
  }
})

module.exports = SwaggerForm