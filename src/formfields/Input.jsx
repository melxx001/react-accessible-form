var React = require( 'react' )
var validator = require( '../validation' )
var formValidation = new validator()

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
			type: 'text',
			errorClassName: '',
			initialValue: ''
		}
	},
	getInitialState: function() {
	    return {
	    	errors: '',
			isValid: this.props.initialValue ? true : false,
			value: this.props.initialValue
	    }
	},
	_onChange: function(event) {
		this.setState({
			value: event.target.value.trim()
		})

		// Run the parent onChange if it exists
		if(this.props.onChange){
			this.props.onChange( this )
		}

		// Validate on change if explicitely set
		if( this.props.validation && this.props.validation.toLowerCase() === 'change' ){
			this.validate( this.state.value, event.target.dataset )
		}
	},
	_onBlur: function( event ) {
		if( this.props.onBlur ){
			this.props.onBlur(this)
		}

		// Validate onBlur by default
		if( !this.props.validation || ( this.props.validation && this.props.validation.toLowerCase() === 'blur' ) ){
			this.validate( this.state.value, event.target.dataset )
		}
	},
	validate: function(value, dataset){
		var results = formValidation.validate( value, dataset )
		var messages = []

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
		var errors = []

		if ( this.props.preLabel || this.props.label ){
			preLabel = <label htmlFor={this.props.id} className={this.props.labelClassName}>{this.props.preLabel || this.props.label}</label>
		}else if ( this.props.postLabel ){
			postLabel = <label htmlFor={this.props.id} className={this.props.labelClassName}>{this.props.postLabel}</label>
		}

		if( this.state.errors.length > 0 ){
			this.state.errors.forEach( ( error, i ) => {	// used an arrow fucntion to keep the conttext of this
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
					//maxLength = { this.props.maxLength }
					//minLength = { this.props.minLength }
					data-validate-required = { this.props.required }
					data-validate-minimum-length = { this.props.minLength }
					data-validate-maximum-length = { this.props.maxLength }
					data-validate-pattern = { type === 'password' || type === 'tel' ? undefined : this.props.pattern }
					data-validate-email = { type === 'email' ? true : undefined }
					data-validate-password = { type === 'password' ? this.props.pattern : undefined }
					data-validate-telephone = { type === 'tel' ? this.props.pattern : undefined }
					data-validate-url = { type === 'url' ? true : undefined }
					data-validate-date = { type === 'date' ? true : undefined }
					data-validate-date-time = { type === 'datetime' || type === 'datetime-local' ? true : undefined }
					data-validate-float = { this.props.format === 'float' ? true : undefined }
					data-validate-integer = { this.props.format === 'int32' || this.props.format === 'int64' ? true : undefined }
					data-isvalid = { this.state.isValid }
					max = { this.props.max }
					min = { this.props.min }
					step = { this.props.step }
					src = { this.props.source }
					//pattern = { this.props.pattern }
					placeholder = { this.props.placeHolder }
					//required = { this.props.required }
					onChange = { this._onChange }
					onBlur = { this._onBlur }
					value = { this.state.value }
					fieldClassName = { this.props.fieldClassName }
					readOnly = { this.props.readOnly }
				/>
				{ postLabel }
                { errors }
            </div>
	    )
	}
})

module.exports = Input