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
		return (format === "float") ? parseFloat(value) : parseInt(value);
	}

	if(type === "boolean"){
		return Boolean(value);
	}

	return value;
}

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
			/*pattern: "",
			groupClassName: "",
			fieldClassName: "",
			labelClassName: ""*/
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

		var properties = {}

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
					onChange = {this._onChange}
					value = {this.state.value}
					fieldClassName = {this.props.fieldClassName}
				/>
                <p className={this.props.errorClassName}>{this.state.validationError}</p>
            </div>
	    )
	}
})

module.exports = Input;