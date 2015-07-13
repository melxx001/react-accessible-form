'use strict';

var validation = require('validator');

function getValidationResult() {
    var valid = arguments[0] === undefined ? false : arguments[0];
    var message = arguments[1] === undefined ? '' : arguments[1];

    if (valid) {
        return { error: false };
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
        'number': function number(_x6, format) {
            var value = arguments[0] === undefined ? '' : arguments[0];

            // Format can be float or double
            return format === 'float' || format === 'double' ? parseFloat(value) : parseInt(value);
        },
        'integer': function integer(_x7, format) {
            var value = arguments[0] === undefined ? '' : arguments[0];

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

function getSchemaProperties(schema, definition) {
    if (!schema || !definition) {
        return null;
    }

    var definitions = schema.definitions;
    var properties = {};

    Object.keys(definitions).map(function (def) {
        if (def === definition.replace('#/definitions/', '')) {
            properties = definitions[def].properties;
        }
    });

    return properties;
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

Validator.prototype.validate = function (_x30, _x31, customValidation) {
    var input = arguments[0] === undefined ? '' : arguments[0];
    var attributes = arguments[1] === undefined ? {} : arguments[1];
    var schemaInfo = arguments[3] === undefined ? {} : arguments[3];

    if (!attributes) {
        console.warn('Warning: One or more Validator.validate parameters missing or empty');
    }

    var result = [];

    // Eventually remove this and add data-attributes when generating the form
    if (schemaInfo && schemaInfo.schema && schemaInfo.definition) {
        if (schemaInfo.field) {
            var properties = getSchemaProperties(schemaInfo.schema, schemaInfo.definition);
            if (properties) {
                results = this.schemaInfoValidate(value, schemaInfo.field, schemaInfo.schema, properties, schemaInfo.definition);
            }
        } else {
            console.warn('Warning: The property `field` must be available for schema based validation. Check if `this.props.field` is defined in your component.');
        }
    } else {
        Object.keys(attributes).forEach((function (attr) {
            if (attr === 'validateRequired' || input) {
                //If there is an input, continue validation
                var validate = Validator.validation[attr];
                if (validate) {
                    result.push(validate(input, attributes[attr]));
                }
            }
        }).bind(this));
    }

    // Add custom validation
    if (customValidation && input) {
        // If there is an input, continue validation
        var customResult = customValidation(input);
        if (typeof customResult.result === undefined) {
            console.warn('Warning: custom validation does not have valid inputs. Object returned should have a result and message property. Ex: `{ result: true, message: "message" }`');
        }

        result.push(getValidationResult(customResult.isResultValid, customResult.message));
    }

    return result;
};

Validator.prototype.serverValidate = function (_x33, _x34, customFormValidation, overrideFormValidation) {
    var formData = arguments[0] === undefined ? {} : arguments[0];
    var reactComponents = arguments[1] === undefined ? [] : arguments[1];

    var _this = this;

    var errors = [];

    if (overrideFormValidation) {
        var customErrors = overrideFormValidation(formData, reactComponents) || [];
        if (customErrors.length) {
            customErrors.forEach(function (custom) {
                var errorObj = {
                    custom: true,
                    name: custom.name,
                    id: custom.id,
                    value: custom.value,
                    dataset: custom.dataset,
                    component: custom.component,
                    errors: []
                };

                custom.errors.forEach(function (error) {
                    errorObj.errors.push(getValidationResult(error.isResultValid, error.message));
                });

                if (errorObj.errors.length) {
                    errors.push(errorObj);
                }
            });
        }
    } else {
        reactComponents.forEach(function (item) {
            var props = item.props;
            if (props.name && props.validationEvent !== 'none') {
                // No need to continue if there is no name
                var schemaInfo = props.schemaInfo || {};
                var _value = formData[props.name].value;
                var dataset = formData[props.name].dataset;
                var _results = _this.validate(_value, dataset, props.customValidation, {
                    value: _value,
                    field: props.field,
                    schema: schemaInfo.schema,
                    definition: schemaInfo.definition
                });

                if (_results.length) {
                    (function () {
                        var errorObj = {
                            custom: false,
                            name: props.name,
                            id: props.id,
                            value: _value,
                            dataset: dataset,
                            component: item,
                            errors: []
                        };

                        _results.forEach(function (result) {
                            if (result.error) {
                                errorObj.errors.push(result);
                            }
                        });

                        if (errorObj.errors.length) {
                            errors.push(errorObj);
                        }
                    })();
                }
            }
        });
    }

    if (customFormValidation) {
        var customErrors = customFormValidation(formData, reactComponents) || [];
        if (customErrors.length) {
            customErrors.forEach(function (custom) {
                var errorObj = {
                    override: false,
                    custom: true,
                    name: custom.name,
                    id: custom.id,
                    value: custom.value,
                    dataset: custom.dataset,
                    component: custom.component,
                    errors: []
                };

                custom.errors.forEach(function (error) {
                    errorObj.errors.push(formValidation.getValidationResult(error.isResultValid, error.message));
                });

                if (errorObj.errors.length) {
                    errors.push(errorObj);
                }
            });
        }
    }

    return errors;
};

Validator.prototype.findValidatedComponent = function () {
    var formValidationResults = arguments[0] === undefined ? [] : arguments[0];
    var props = arguments[1] === undefined ? {} : arguments[1];

    for (var i = 0, l = formValidationResults.length; i < l; i++) {
        if (formValidationResults[i].id === props.id) {
            return formValidationResults[i];
        }
    }

    return null;
};

Validator.prototype.getApiValidationResults = function () {
    var json = arguments[0] === undefined ? {} : arguments[0];
    var formData = arguments[1] === undefined ? {} : arguments[1];
    var reactComponents = arguments[2] === undefined ? [] : arguments[2];

    var apiValidationResults = [];

    reactComponents.forEach(function (item) {
        var props = item.props;
        var apiResults = json[props.name];

        if (props.name && apiResults) {
            (function () {
                // No need to continue if there is no name
                var data = formData[props.name];

                var value = data ? data.value : '';
                var dataset = data ? data.dataset : '';

                var errorObj = {
                    custom: false,
                    name: props.name,
                    id: props.id,
                    value: value,
                    dataset: dataset,
                    component: item,
                    errors: []
                };

                if (Array.isArray(apiResults)) {
                    apiResults.forEach(function (res) {
                        errorObj.errors.push({
                            error: true,
                            message: res
                        });
                    });
                } else {
                    errorObj.errors.push({
                        error: true,
                        message: apiResults
                    });
                }

                if (errorObj.errors.length) {
                    apiValidationResults.push(errorObj);
                }
            })();
        }
    });

    return apiValidationResults;
};

Validator.prototype.schemaInfoValidate = function () {
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