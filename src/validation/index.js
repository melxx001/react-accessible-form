'use strict'

var validation = require( 'validator' );

function getValidationResult( valid = false, message = "" ){
    if( valid ){
        return { error: false };
    }

    return { error: true, message: message };
}

function parseDate( date , type = "date"){

    function addZero(num) {
        var num = parseInt( num );
        return (num >= 0 && num < 10) ? "0" + num : num.toString() ;
    }

    var d = new Date( date );
    var fullDate =  [
        d.getFullYear(),
        addZero( d.getMonth() + 1 ),
        addZero( d.getDate() )
    ].join( '-' );

    if( type === 'date-time' ){
        let fullTime = [
            addZero( d.getHours() ), 
            addZero( d.getMinutes() ),
            addZero( d.getSeconds() )
        ].join(":") + 'Z';

        return [
            fullDate,
            'T',
            fullTime
        ].join( '' );
    }

    return fullDate;
}

function updateValueFormat(value , type = "string", format = ""){
    type = type.toLowerCase();
    format = format.toLowerCase();

    var dataType = {
        'number': function( value = "", format ){
            // Format can be float or double
            return ( format === 'float' || format === 'double' ) ? parseFloat( value ) : parseInt( value );
        },
        'integer': function( value = "", format ){
            // Format can be int32 or int64
            return parseInt( value );
        },
        'string': function( value , format ){
            // Format can be string, bytes, date, date-time or password
            return ( format === 'date' && value ) ? parseDate( value ) : 
                ( format === 'date-time' && value ) ? parseDate( value , 'date-time') : value;
        },
        'boolean': function( value, format ){ 
            return Boolean( value );
        }
    };

    var update = dataType[ type ];

    if( update ){
        return update( value, format );
    }else{
        console.warn( 'Warning: Unknown type ' + type + ' in updateValueFormat' );
    }
    
    return value;
}

function getSchemaProperties( schema , definition ){
    if( !schema || !definition ){
        return null;
    }

    var definitions = schema.definitions;
    var properties = {};

    Object.keys(definitions).map( ( def ) => {
        if( def === definition.replace( '#/definitions/' , '' ) ){ 
            properties = definitions[ def ].properties;
        }
    })

    return properties;
}

function Validator () {
    this.errors = [];
}

Validator.validation = {
    validateRequired: function( input = "" ) {
        return getValidationResult( input, 'This field is required!' );
    },
    validateMinimumLength: function( input = {length: 0}, length = 0 ) {
        return getValidationResult( input.length >= parseInt( length ) || parseInt( length ) === 0, [ 'Minimum of', length, 'characters' ].join( " " ) );
    },
    validateMaximumLength: function( input = {length: 0}, length = 0 ) {
        return getValidationResult( input.length <= parseInt( length ) || parseInt( length ) === 0, [ 'Maximum of', length, 'characters' ].join( " " ) );
    },
    validateMinimum: function( input = 0, length = 0 ) {
        return getValidationResult( input >= parseInt( length ), [ 'Minimum of', length ].join( " " ) );
    },
    validateMaximum: function( input = 0, length = 0 ) {
        return getValidationResult( input <= parseInt( length ), [ 'Maximum of', length ].join( " " ) );
    },
    validatePattern: function( input = "", pattern = "" ) {
        return getValidationResult( new RegExp( pattern, 'g' ).test( input ), 'Does not match ' + pattern );
    },
    validateEmail: function( input = "" ) {
        return getValidationResult( validation.isEmail( input ), "Email Error" );
    },
    validateUrl: function( input = "" ) {
        return getValidationResult( validation.isURL( input ), "Url Error" );
    },
    validateDate: function( input = "" ) {
        return getValidationResult( validation.isDate( input ), "Date Error" );
    },
    validateTelephone: function( input = "", pattern = "" ) {
        return getValidationResult( new RegExp( pattern, 'g' ).test( input ), "Invalid Telephone. Does not match " + pattern );
    },
    validatePassword: function( input = "", pattern = "" ) {
        return getValidationResult( new RegExp( pattern, 'g' ).test( input ), "Invalid Password. Does not match " + pattern );
    },
    validateDateTime: function( input = "" ) {
        return getValidationResult( validation.isDate( input ), "Date Time Error" );
    },
    validateFloat: function( input = "" ) {
        return getValidationResult( validation.isFloat( input ), "Float Error" );
    },
    validateInteger: function( input = "" ) {
        return getValidationResult( validation.isInt( input ), "Integer Error" );
    },
    validateNumber: function( input = "" ) {
        return getValidationResult( validation.isNumeric( input ), "Number Error" );
    }
}

Validator.prototype.validate = function( input = "", attributes = {} , customValidation, schemaInfo = {} ) {
    if( !attributes ){
        console.warn( 'Warning: One or more Validator.validate parameters missing or empty' );
    }

    var result = [];

    // Eventually remove this and add data-attributes when generating the form
    if( schemaInfo && schemaInfo.schema && schemaInfo.definition ){
        if( schemaInfo.field ){
            let properties = getSchemaProperties( schemaInfo.schema, schemaInfo.definition );
            if( properties ){
                results = this.schemaInfoValidate( value, schemaInfo.field, schemaInfo.schema, properties, schemaInfo.definition );
            }
        }else{
            console.warn( 'Warning: The property `field` must be available for schema based validation. Check if `this.props.field` is defined in your component.' );
        }
    }else{
        Object.keys( attributes ).forEach( function( attr ){
            if( attr === 'validateRequired' || input ){ //If there is an input, continue validation
                var validate = Validator.validation[ attr ];
                if( validate ){
                    result.push( validate( input, attributes[ attr ] ) );
                }
            }
        }.bind( this ) );
    }

    // Add custom validation
    if( customValidation && input ){    // If there is an input, continue validation
        let customResult = customValidation( input );
        if( typeof customResult.result === undefined ){
            console.warn( 'Warning: custom validation does not have valid inputs. Object returned should have a result and message property. Ex: `{ result: true, message: "message" }`' );
        }

        result.push( getValidationResult( customResult.isResultValid, customResult.message  ) );
    }

    return result;
}

Validator.prototype.serverValidate = function( formData = {} , reactComponents = [], overrideFormValidation ){
    var errors = [];

    if( overrideFormValidation ){ 
        let customErrors = overrideFormValidation( formData , reactComponents ) || []; 
        if( customErrors.length ){
            customErrors.forEach( function( custom ){
                var errorObj = {
                    custom: true,
                    name: custom.name, 
                    id: custom.id,
                    value: custom.value,
                    dataset: custom.dataset,
                    component: custom.component,
                    errors: []
                };

                custom.errors.forEach( function( error ){
                    errorObj.errors.push( getValidationResult( error.isResultValid, error.message ) );
                })

                if( errorObj.errors.length ){
                    errors.push( errorObj )
                }
            });
        }
    }else{
        reactComponents.forEach( ( item ) => {
            var props = item.props; 
            if( props.name && props.validationEvent !== 'none' ){   // No need to continue if there is no name
                let schemaInfo = props.schemaInfo || {};
                let value = formData[ props.name ].value;
                let dataset = formData[ props.name ].dataset;
                let results = this.validate( value, dataset, props.customValidation , {
                    value: value, 
                    field: props.field,
                    schema: schemaInfo.schema,
                    definition: schemaInfo.definition
                });

                if( results.length ){
                    let errorObj = {
                        custom: false,
                        name: props.name,
                        id: props.id,
                        value: value,
                        dataset: dataset, 
                        component: item,
                        errors: []
                    };

                    results.forEach( function( result ){
                        if( result.error ){
                            errorObj.errors.push( result ); 
                        }
                    });

                    if( errorObj.errors.length ){
                        errors.push( errorObj )
                    }
                }
            }
        });
    }

    return errors;
}

Validator.prototype.findValidatedComponent = function( formValidationResults = [], props = {} ){
    for( let i = 0, l = formValidationResults.length; i < l; i++ ){
        if( formValidationResults[i].id === props.id || formValidationResults[i].name === props.name){
            return formValidationResults[i];
        }
    }

    return null;
}

Validator.prototype.getApiValidationResults = function( json = {}, formData = {}, reactComponents = [] ){
    var apiValidationResults = [];

    reactComponents.forEach( ( item ) => {
        var props = item.props;
        var apiResults = json[ props.name ];

        if( props.name && apiResults ){   // No need to continue if there is no name
            let data = formData[ props.name ];

            let value = ( data ) ? data.value : '';
            let dataset = ( data ) ? data.dataset : '';

            let errorObj = {
                custom: false,
                name: props.name,
                id: props.id,
                value: value,
                dataset: dataset,
                component: item,
                errors: []
            }; 

            if( Array.isArray( apiResults ) ){
                apiResults.forEach( function( res ){
                    errorObj.errors.push({
                        error: true,
                        message: res
                    });
                });
            }else{
                errorObj.errors.push({
                    error: true,
                    message: apiResults
                });
            }

            if( errorObj.errors.length ){
                apiValidationResults.push( errorObj )
            }
        }
    });

    return apiValidationResults;
}

Validator.prototype.schemaInfoValidate = function( fieldValue = "", field = "", schema = "", propertyObj = {}, definition = "" ) {
    var errors = [];

    // require( 'swagger-tools' ) causes issues so I'm commenting this section out
    /*if( schema && definition && Object.getOwnPropertyNames( propertyObj ).length > 0 && field ){
        let swaggerTools = require( 'swagger-tools' );
        let spec = swaggerTools.specs.v2;
        let properties = {};

        Object.keys(propertyObj).forEach( ( item ) => {
            properties[item] = "";
        });

        properties[field] = updateValueFormat( fieldValue, propertyObj[field].type, propertyObj[field].format);

        // Required doesn't seem to validate correctly yet.
        // A required field of type string will not error out if empty ??
        // A required field of type number will error out as invalid type
        // Still investigating but perhaps a bug in the swagger-tools module

        spec.validateModel( schema, definition, properties, ( err, result ) => {
            if ( result && result.errors ) {
                result.errors.forEach(  ( error ) => {
                    if ( error.path[0] === field ) {
                        errors.push( getValidationResult( false , error.message ) );
                    }
                });
            }
        })
    }else{
        console.warn( 'Warning: One or more Validator.swaggerValidate parameters missing or empty' );
    }*/

    return errors;
}


module.exports = Validator;
