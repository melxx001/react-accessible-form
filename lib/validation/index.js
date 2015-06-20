'use strict';

var validation = require('validator');

function error() {
	var valid = arguments[0] === undefined ? true : arguments[0];
	var message = arguments[1] === undefined ? '' : arguments[1];

	if (valid) {
		return { error: false, message: '' };
	}

	return { error: true, message: message };
}

function Validator() {
	this.errors = [];
}

Validator.validation = {
	validateRequired: function validateRequired() {
		var input = arguments[0] === undefined ? '' : arguments[0];

		return error(input, 'This field is required!');
	},
	validateMinimumLength: function validateMinimumLength() {
		var input = arguments[0] === undefined ? { length: 0 } : arguments[0];
		var length = arguments[1] === undefined ? 0 : arguments[1];

		return error(input.length >= parseInt(length) || parseInt(length) === 0, ['Minimum of', length, 'characters'].join(' '));
	},
	validateMaximumLength: function validateMaximumLength() {
		var input = arguments[0] === undefined ? '' : arguments[0];
		var length = arguments[1] === undefined ? 0 : arguments[1];

		return error(input.length <= parseInt(length) || parseInt(length) === 0, ['Maximum of', length, 'characters'].join(' '));
	},
	validatePattern: function validatePattern() {
		var input = arguments[0] === undefined ? '' : arguments[0];
		var pattern = arguments[1] === undefined ? '' : arguments[1];

		return error(new RegExp(pattern, 'g').test(input), 'Does not match ' + pattern);
	},
	validateEmail: function validateEmail() {
		var input = arguments[0] === undefined ? '' : arguments[0];

		return error(validation.isEmail(input), 'Email Error');
	},
	validateUrl: function validateUrl() {
		var input = arguments[0] === undefined ? '' : arguments[0];

		return error(validation.isURL(input), 'Url Error');
	},
	validateDate: function validateDate() {
		var input = arguments[0] === undefined ? '' : arguments[0];

		return error(validation.isDate(input), 'Date Error');
	},
	validateTelephone: function validateTelephone() {
		var input = arguments[0] === undefined ? '' : arguments[0];
		var pattern = arguments[1] === undefined ? '' : arguments[1];

		return error(new RegExp(pattern, 'g').test(input), 'Invalid Telephone. Does not match ' + pattern);
	},
	validatePassword: function validatePassword() {
		var input = arguments[0] === undefined ? '' : arguments[0];
		var pattern = arguments[1] === undefined ? '' : arguments[1];

		return error(new RegExp(pattern, 'g').test(input), 'Invalid Password. Does not match ' + pattern);
	},
	validateDateTime: function validateDateTime() {
		var input = arguments[0] === undefined ? '' : arguments[0];

		return error(validation.isDate(input), 'Date Time Error');
	},
	validateFloat: function validateFloat() {
		var input = arguments[0] === undefined ? '' : arguments[0];

		return error(validation.isFloat(input), 'Float Error');
	},
	validateInteger: function validateInteger() {
		var input = arguments[0] === undefined ? '' : arguments[0];

		return error(validation.isInt(input), 'Integer Error');
	}
};

Validator.prototype.validate = function () {
	var input = arguments[0] === undefined ? '' : arguments[0];
	var attributes = arguments[1] === undefined ? {} : arguments[1];

	var result = [];
	Object.keys(attributes).forEach((function (attr) {
		var validate = Validator.validation[attr];
		if (validate) {
			result.push(validate(input, attributes[attr]));
		}
	}).bind(this));
	return result;
};

module.exports = Validator;