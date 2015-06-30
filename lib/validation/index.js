'use strict';

var validation = require('validator');

function getValidationResult() {
    var valid = arguments[0] === undefined ? true : arguments[0];
    var message = arguments[1] === undefined ? '' : arguments[1];

    if (valid) {
        return { error: false, message: '' };
    }

    return { error: true, message: message };
}

function parseDate(date) {
    var type = arguments[1] === undefined ? 'date' : arguments[1];

    function addZero(num) {
        var num = parseInt(num);
        return num >= 0 && num < 10 ? '0' + num : num.toString();
    }

    var d = new Date(date);
    var fullDate = [d.getFullYear(), addZero(d.getMonth() + 1), addZero(d.getDate())].join('-');

    if (type === 'date-time') {
        var fullTime = [addZero(d.getHours()), addZero(d.getMinutes()), addZero(d.getSeconds())].join(':') + 'Z';

        return [fullDate, 'T', fullTime].join('');
    }

    return fullDate;
}

function updateValueFormat(value) {
    var type = arguments[1] === undefined ? 'string' : arguments[1];
    var format = arguments[2] === undefined ? '' : arguments[2];

    type = type.toLowerCase();
    format = format.toLowerCase();

    var dataType = {
        'number': function number(value, format) {
            if (value === undefined) value = '';

            // Format can be float or double
            return format === 'float' || format === 'double' ? parseFloat(value) : parseInt(value);
        },
        'integer': function integer(value, format) {
            if (value === undefined) value = '';

            // Format can be int32 or int64
            return parseInt(value);
        },
        'string': function string(value, format) {
            // Format can be string, bytes, date, date-time or password
            return format === 'date' && value ? parseDate(value) : format === 'date-time' && value ? parseDate(value, 'date-time') : value;
        },
        'boolean': function boolean(value, format) {
            return Boolean(value);
        }
    };

    var update = dataType[type];

    if (update) {
        return update(value, format);
    } else {
        console.warn('Warning: Unknown type ' + type + ' in updateValueFormat');
    }

    return value;
}

function Validator() {
    this.errors = [];
}

Validator.validation = {
    validateRequired: function validateRequired() {
        var input = arguments[0] === undefined ? '' : arguments[0];

        return getValidationResult(input, 'This field is required!');
    },
    validateMinimumLength: function validateMinimumLength() {
        var input = arguments[0] === undefined ? { length: 0 } : arguments[0];
        var length = arguments[1] === undefined ? 0 : arguments[1];

        return getValidationResult(input.length >= parseInt(length) || parseInt(length) === 0, ['Minimum of', length, 'characters'].join(' '));
    },
    validateMaximumLength: function validateMaximumLength() {
        var input = arguments[0] === undefined ? { length: 0 } : arguments[0];
        var length = arguments[1] === undefined ? 0 : arguments[1];

        return getValidationResult(input.length <= parseInt(length) || parseInt(length) === 0, ['Maximum of', length, 'characters'].join(' '));
    },
    validateMinimum: function validateMinimum() {
        var input = arguments[0] === undefined ? 0 : arguments[0];
        var length = arguments[1] === undefined ? 0 : arguments[1];

        return getValidationResult(input >= parseInt(length), ['Minimum of', length].join(' '));
    },
    validateMaximum: function validateMaximum() {
        var input = arguments[0] === undefined ? 0 : arguments[0];
        var length = arguments[1] === undefined ? 0 : arguments[1];

        return getValidationResult(input <= parseInt(length), ['Maximum of', length].join(' '));
    },
    validatePattern: function validatePattern() {
        var input = arguments[0] === undefined ? '' : arguments[0];
        var pattern = arguments[1] === undefined ? '' : arguments[1];

        return getValidationResult(new RegExp(pattern, 'g').test(input), 'Does not match ' + pattern);
    },
    validateEmail: function validateEmail() {
        var input = arguments[0] === undefined ? '' : arguments[0];

        return getValidationResult(validation.isEmail(input), 'Email Error');
    },
    validateUrl: function validateUrl() {
        var input = arguments[0] === undefined ? '' : arguments[0];

        return getValidationResult(validation.isURL(input), 'Url Error');
    },
    validateDate: function validateDate() {
        var input = arguments[0] === undefined ? '' : arguments[0];

        return getValidationResult(validation.isDate(input), 'Date Error');
    },
    validateTelephone: function validateTelephone() {
        var input = arguments[0] === undefined ? '' : arguments[0];
        var pattern = arguments[1] === undefined ? '' : arguments[1];

        return getValidationResult(new RegExp(pattern, 'g').test(input), 'Invalid Telephone. Does not match ' + pattern);
    },
    validatePassword: function validatePassword() {
        var input = arguments[0] === undefined ? '' : arguments[0];
        var pattern = arguments[1] === undefined ? '' : arguments[1];

        return getValidationResult(new RegExp(pattern, 'g').test(input), 'Invalid Password. Does not match ' + pattern);
    },
    validateDateTime: function validateDateTime() {
        var input = arguments[0] === undefined ? '' : arguments[0];

        return getValidationResult(validation.isDate(input), 'Date Time Error');
    },
    validateFloat: function validateFloat() {
        var input = arguments[0] === undefined ? '' : arguments[0];

        return getValidationResult(validation.isFloat(input), 'Float Error');
    },
    validateInteger: function validateInteger() {
        var input = arguments[0] === undefined ? '' : arguments[0];

        return getValidationResult(validation.isInt(input), 'Integer Error');
    },
    validateNumber: function validateNumber() {
        var input = arguments[0] === undefined ? '' : arguments[0];

        return getValidationResult(validation.isNumeric(input), 'Number Error');
    }
};

Validator.prototype.validate = function (input, attributes, customValidation) {
    if (input === undefined) input = '';
    if (attributes === undefined) attributes = {};

    if (!attributes) {
        console.warn('Warning: One or more Validator.validate parameters missing or empty');
    }

    var result = [];
    Object.keys(attributes).forEach((function (attr) {
        var validate = Validator.validation[attr];
        if (validate) {
            result.push(validate(input, attributes[attr]));
        }
    }).bind(this));

    // Add custom validation
    if (customValidation) {
        var customResult = customValidation(input);
        if (typeof customResult.result === undefined) {
            console.warn('Warning: custom validation does not have valid inputs. Object returned should have a result and message property. Ex: `{ result: true, message: "message" }`');
        }

        result.push(getValidationResult(customResult.result, customResult.message));
    }

    return result;
};

Validator.prototype.swaggerValidate = function () {
    var fieldValue = arguments[0] === undefined ? '' : arguments[0];
    var field = arguments[1] === undefined ? '' : arguments[1];
    var schema = arguments[2] === undefined ? '' : arguments[2];
    var propertyObj = arguments[3] === undefined ? {} : arguments[3];
    var definition = arguments[4] === undefined ? '' : arguments[4];

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
};

module.exports = Validator;