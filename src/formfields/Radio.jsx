var React = require( 'react' )
var validator = require( '../validation' )
var formValidation = new validator()

var Radio = React.createClass({
	propTypes: {
			required: React.PropTypes.bool,
			name: React.PropTypes.string.isRequired,
			label: React.PropTypes.string,
			groupClassName: React.PropTypes.string,
			labelClassName: React.PropTypes.string,
			errorClassName: React.PropTypes.string,
			fieldClassName: React.PropTypes.string,
			validationEvent: React.PropTypes.string,
			readOnly: React.PropTypes.bool,
			disabled: React.PropTypes.bool,
			checked: React.PropTypes.bool,
			id: React.PropTypes.string,
			swagger: React.PropTypes.shape({
				schema: React.PropTypes.object.isRequired,
				definition: React.PropTypes.string.isRequired,
			}),
			field: React.PropTypes.string
	},
	getDefaultProps: function() {
		return {
			checked: false
		}
	},
	getInitialState: function() {
	    return {
	    	errors: '',
			isValid: this.props.value ? true : false,
			checked: this.props.defaultChecked ? true : false
	    }
	},
	onChange: function( event ) {
		this.setState({
			checked: ( this.state.checked ) ? false : true
		})

		// Run the parent onChange if it exists
		if(this.props.onChange){
			this.props.onChange( this )
		}

		// Validate on onChange if explicitely set
		if( this.props.validationEvent && this.props.validationEvent.toLowerCase() === 'change' ){
			this.validate( this.state.value, event.target.dataset )
		}
	},
	getSwaggerProperties: function(schema , definition){
		if( !schema || !definition ){
			return null
		}

		var definitions = schema.definitions
		var properties = {}

		Object.keys(definitions).map( ( def ) => {
			if( def === definition.replace( '#/definitions/' , '' ) ){
				properties = definitions[ def ].properties
			}
		})

		return properties
	},
	validate: function(value, dataset){
		var results = []
		var messages = []
		var swagger = this.props.swagger

		if( swagger && swagger.schema && swagger.definition ){
			if( this.props.field ){
				let properties = this.getSwaggerProperties( swagger.schema, swagger.definition )
				if( properties ){
					results = formValidation.swaggerValidate( value, this.props.field, swagger.schema, properties, swagger.definition )
				}
			}else{
				console.warn( "The property 'field' must be part of this.props for swagger validation. Check if this.props.field is defined." )
			}
		}else{
			results = formValidation.validate( value, dataset )
		}

		results.forEach(function( result ){
			if( result.error ){
				messages.push( result.message )
			}
		})

		this.setState({
			errors: messages,
			isValid: ( messages.length === 0 ) ? true : false
		})
	},
	render: function () {
		var preLabel = undefined
		var postLabel = undefined
		var errors = []

		if ( this.props.preLabel || this.props.label ){
			preLabel = <label htmlFor={ this.props.id } className={ this.props.labelClassName }>{ this.props.preLabel || this.props.label }</label>
		}else if ( this.props.postLabel ){
			postLabel = <label htmlFor={ this.props.id } className={ this.props.labelClassName }>{ this.props.postLabel }</label>
		}

		if( this.state.errors.length > 0 ){
			this.state.errors.forEach( ( error, i ) => {	// used an arrow function to keep the context of this
				errors.push( <span key={ 'errmessage' + i } className={ this.props.errorClassName }>{ error }</span> )
			})
		}

	    return (
            <div className = { this.props.groupClassName }>
            	{ preLabel }
                <input
                	id = { this.props.id }
                	type = 'radio' 
					name = { this.props.name }
					data-validate-required = { this.props.required }
					data-isvalid = { this.state.isValid }
					onChange = { this._onChange }
					value = { this.props.value }
					fieldClassName = { this.props.fieldClassName }
					readOnly = { this.props.readOnly }
					disabled = { this.props.disabled }
					checked = { this.state.checked }
				/>
				{ postLabel }
                { errors }
            </div>
	    )
	}
})

module.exports = Radio
