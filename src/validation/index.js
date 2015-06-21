'use strict'

var validation = require( 'validator' )

function errorObj( valid = true, message = "" ){
	if( valid ){
		return { error: false, message: '' }
	}

	return { error: true, message: message }
}

function parseDate( date , type = "date"){

	function addZero(num) {
		var num = parseInt( num )
	    return (num >= 0 && num < 10) ? "0" + num : num.toString() ;
	}

	var d = new Date( date )
	var fullDate =  [
		d.getFullYear(),
		addZero( d.getMonth() + 1 ),
		addZero( d.getDate() )
	].join( '-' )

	if( type === 'date-time' ){
		let fullTime = [
			addZero( d.getHours() ), 
			addZero( d.getMinutes() ),
			addZero( d.getSeconds() ),
			'Z'
		].join(":")

		return [
			fullDate,
			'T',
			fullTime
		].join( '' )
	}

	return fullDate
}

function updateValueFormat(value , type = "string", format = ""){
	type = type.toLowerCase()
	format = format.toLowerCase()

	var dataType = {
		'number': function( value = "", format ){
			// Format can be float or double
			return ( format === 'float' || format === 'double' ) ? parseFloat( value ) : parseInt( value ) 
		},
		'integer': function( value = "", format ){
			// Format can be int32 or int64
			return parseInt( value ) 
		},
		'string': function( value , format ){
			// Format can be string, bytes, date, date-time or password
			return ( format === 'date' && value ) ? parseDate( value ) : 
				( format === 'date-time' && value ) ? parseDate( value , 'date-time') : value 
		},
		'boolean': function( value, format ){ 
			return Boolean( value ) 
		}
	}

	var update = dataType[ type ];

	if( update ){
		return update( value, format )
	}else{
		console.warn( 'Unknow type ' + type )
	}
	
	return value;
}

function Validator () {
	this.errors = []
}

Validator.validation = {
	validateRequired: function( input = "" ) {
		return errorObj( input, 'This field is required!' )
	},
	validateMinimumLength: function( input = {length: 0}, length = 0 ) {
		return errorObj( input.length >= parseInt( length ) || parseInt( length ) === 0, ['Minimum of', length, 'characters' ].join( " " ) )
	},
	validateMaximumLength: function( input = "", length = 0 ) {
		return errorObj( input.length <= parseInt( length ) || parseInt( length ) === 0, ['Maximum of', length, 'characters' ].join( " " ) )
	},
	validatePattern: function( input = "", pattern = "" ) {
		return errorObj( new RegExp( pattern, 'g' ).test( input ), 'Does not match ' + pattern )
	},
	validateEmail: function( input = "" ) {
		return errorObj( validation.isEmail( input ), "Email Error" )
	},
	validateUrl: function( input = "" ) {
		return errorObj( validation.isURL( input ), "Url Error" )
	},
	validateDate: function( input = "" ) {
		return errorObj( validation.isDate( input ), "Date Error" )
	},
	validateTelephone: function( input = "", pattern = "" ) {
		return errorObj( new RegExp( pattern, 'g' ).test( input ), "Invalid Telephone. Does not match " + pattern )
	},
	validatePassword: function( input = "", pattern = "" ) {
		return errorObj( new RegExp( pattern, 'g' ).test( input ), "Invalid Password. Does not match " + pattern )
	},
	validateDateTime: function( input = "" ) {
		return errorObj( validation.isDate( input ), "Date Time Error" )
	},
	validateFloat: function( input = "" ) {
		return errorObj( validation.isFloat( input ), "Float Error" )
	},
	validateInteger: function( input = "" ) {
		return errorObj( validation.isInt( input ), "Integer Error" )
	},
	validateNumber: function( input = "" ) {
		return errorObj( validation.isNumeric( input ), "Number Error" )
	}
}

Validator.prototype.validate = function( input = "", attributes = {} ) {
	if( !attributes ){
		console.warn( 'One or more Validator.validate parameters missing or empty' )
	}

	var result = []
	Object.keys( attributes ).forEach( function( attr ){
		var validate = Validator.validation[ attr ]
		if( validate ){
			result.push( validate( input, attributes[ attr ] ) )
		}
	}.bind( this ) )

	return result
}

Validator.prototype.swaggerValidate = function( fieldValue = "", field = "", schema = "", propertyObj = {}, definition = "" ) {
	var errors = []

	if( schema && definition && Object.getOwnPropertyNames( propertyObj ).length > 0 && field ){
		let swaggerTools = require( 'swagger-tools' )
		let spec = swaggerTools.specs.v2
		let properties = {}

		Object.keys(propertyObj).forEach( ( item ) => {
			properties[item] = ""
		})

		properties[field] = updateValueFormat( fieldValue, propertyObj[field].type, propertyObj[field].format)

		// Required doesn't seem to validate correctly yet.
		// A required field of type string will not error out if empty ??
		// A required field of type number will error out as invalid type
		// Still investigating but perhaps a bug in the swagger-tools module

		spec.validateModel( schema, definition, properties, ( err, result ) => {
		    if ( result && result.errors ) {
		        result.errors.forEach(  ( error ) => {
		            if ( error.path[0] === field ) {
		                errors.push( errorObj( false , error.message ) )
		            }
		        })
		    }
		})
	}else{
		console.warn( 'One or more Validator.swaggerValidate parameters missing or empty' )
	}

	return errors
}


module.exports = Validator