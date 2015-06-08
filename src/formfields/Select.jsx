var React = require('react')
var swaggerTools = require('swagger-tools')
var spec = swaggerTools.specs.v2

// Will move this function to an appropriate location
function updateValue(value, type = "string", format = ""){
	type = type.toLowerCase()
	format = format.toLowerCase()

	if(type === 'object' && format === 'date'){
		return new Date(value)
	}

	if(type === "number"){
		return (format === "float") ? parseFloat(value) : parseInt(value)
	}

	if(type === "boolean"){
		return Boolean(value)
	}

	return value
}

var Select = React.createClass({
	propTypes: {
			required: React.PropTypes.bool,
			selected: React.PropTypes.bool,
			name: React.PropTypes.string,
			label: React.PropTypes.string,
			groupClassName: React.PropTypes.string,
			labelClassName: React.PropTypes.string,
			errorClassName: React.PropTypes.string,
			fieldClassName: React.PropTypes.string,
			options: React.PropTypes.array
	},
	getDefaultProps: function() {
		return {
			required: false,
			name: "",
			options: [["",""]],
			initialValue: "",
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
	_onChange: function (event) {
		var trimmed = event.target.value.trim();

		this.setState({
			value: trimmed
		});

		if(this.props.schema){
			let properties = {}

			Object.keys(this.props.properties).forEach((item) => {
				properties[item] = updateValue(trimmed, this.props.properties[this.props.field].type, this.props.properties[this.props.field].format)
			})
			
			spec.validateModel(this.props.schema, '#/definitions/Expenses', properties, (err, result) => {
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
		}
	},
	render: function () {
		var options = this.props.options
		var optionsHtml = []
		Object.keys(options).forEach(function(option, i){
			var choice = options[i]
			optionsHtml.push(<option key={choice[0]} value={choice[0]}>{choice[1]}</option>)
		})

	    return (
            <div className = {this.props.groupClassName}>
            	<label className={this.props.labelClassName}>{this.props.label}</label>
                <select
					name = {this.props.name}
					required = {this.props.required}
					data-required = {this.props.required}
					data-isvalid = {this.state.isValid}
					onChange = {this._onChange}
					value = {this.state.value}
					fieldClassName = {this.props.fieldClassName}
					selected = {this.props.selected} 
				>
					{optionsHtml}
				</select>
                <p className={this.props.errorClassName}>{this.state.validationError}</p>
            </div>
	    )
	}
})

module.exports = Select