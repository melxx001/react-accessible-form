var React = require( 'react' )
var validator = require( '../validation' )
var formValidation = new validator()
var cuid = require('cuid')

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
		step: React.PropTypes.number,
		width: React.PropTypes.number,
		groupClassName: React.PropTypes.string,
		labelClassName: React.PropTypes.string,
		errorClassName: React.PropTypes.string,
		fieldClassName: React.PropTypes.string,
		validationEvent: React.PropTypes.string,
		validationpattern: React.PropTypes.string,
		isNumber: React.PropTypes.bool,
		source: React.PropTypes.string,
		format: React.PropTypes.string,
		readOnly: React.PropTypes.bool,
		disabled: React.PropTypes.bool,
		id: React.PropTypes.string,
		alt: React.PropTypes.string,
		swagger: React.PropTypes.shape({
			schema: React.PropTypes.object.isRequired,
			definition: React.PropTypes.string.isRequired,
		}),
		field: React.PropTypes.string
	},
	getDefaultProps: function() {
		return {
			type: 'text',
			initialValue: '',
			id: cuid()	// Get a unique Id if it's not passed
		}
	},
	getInitialState: function() {
	    return {
	    	errors: '',
			value: this.props.initialValue,
			isValid: this.props.initialValue ? true : false,
			readOnly: this.props.readOnly ? true : false,
			disabled: this.props.disabled ? true : false
	    }
	},
	_onChange: function( event ) {
		this.setState({
			value: event.target.value.trim()
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
	_onBlur: function( event ) {
		// Run the parent onBlur if it exists
		if( this.props.onBlur ){
			this.props.onBlur(this)
		}

		// Validate onBlur by default
		if( !this.props.validationEvent || ( this.props.validationEvent && this.props.validationEvent.toLowerCase() === 'blur' ) ){
			this.validate( this.state.value, event.target.dataset )
		}
	},
	getSwaggerProperties: function( schema , definition ){
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
	validate: function( value, dataset ){
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
		var type = this.props.type.toLowerCase()
		var preLabel = undefined
		var postLabel = undefined
		var format = this.props.format ? this.props.format.toLowerCase() : ''
		var errors = []

		//TO DO: Return appropriate component depending on type
		/*if( type === 'checkbox' ){
			return (
				<CheckBox ...this.props />
			)
		}

		if( type === 'radio' ){
			return (
				<Radio ...this.props />
			)
		}*/

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
                	type = { type } 
					name = { this.props.name }
					size = { this.props.width }
					data-validate-required = { this.props.required }
					data-validate-minimum-length = { this.props.minLength }
					data-validate-maximum-length = { this.props.maxLength }
					data-validate-pattern = { type === 'password' || type === 'tel' ? undefined : this.props.validationpattern }
					data-validate-email = { type === 'email' ? true : undefined }
					data-validate-password = { type === 'password' ? this.props.validationpattern : undefined }
					data-validate-telephone = { type === 'tel' ? this.props.validationpattern : undefined }
					data-validate-float = { format === 'float' ? true : undefined }
					data-validate-integer = { format === 'int32' || format === 'int64' ? true : undefined }
					data-validate-number = { this.props.isNumber ? true : undefined }
					data-isvalid = { this.state.isValid }
					max = { this.props.max }
					min = { this.props.min }
					step = { this.props.step }
					src = { this.props.source }
					alt = { this.props.alt }
					placeholder = { this.props.placeHolder }
					onChange = { this._onChange }
					onBlur = { this._onBlur }
					value = { this.state.value }
					className = { this.props.fieldClassName }
					readOnly = { this.state.readOnly }
					disabled = { this.state.disabled }
				/>
				{ postLabel }
                { errors }
            </div>
	    )
	}
})

module.exports = Input
