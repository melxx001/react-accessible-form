'use strict';

function Validator() {
	this.errors = [];
}

Validator.validation = {
	validateRequired: function validateRequired() {
		var input = arguments[0] === undefined ? '' : arguments[0];

		if (input) {
			return { error: false, message: '' };
		}

		return { error: true, message: 'This field is required!' };
	},
	validateMinimumLength: function validateMinimumLength() {
		var input = arguments[0] === undefined ? { length: 0 } : arguments[0];
		var length = arguments[1] === undefined ? 0 : arguments[1];

		if (input.length >= parseInt(length) || parseInt(length) === 0) {
			return { error: false, message: '' };
		}

		return { error: true, message: ['Minimum of', length, 'characters'].join(' ') };
	},
	validateMaximumLength: function validateMaximumLength() {
		var input = arguments[0] === undefined ? '' : arguments[0];
		var length = arguments[1] === undefined ? 0 : arguments[1];

		if (input.length <= parseInt(length) || parseInt(length) === 0) {
			return { error: false, message: '' };
		}

		return { error: true, message: ['Maximum of', length, 'characters'].join(' ') };
	},
	validatePattern: function validatePattern() {
		var input = arguments[0] === undefined ? '' : arguments[0];
		var pattern = arguments[1] === undefined ? '' : arguments[1];

		var reg = new RegExp(pattern, 'g').test(input);
		if (reg) {
			return { error: false, message: '' };
		}

		return { error: true, message: ['Does not match ' + pattern].join(' ') };
	}
};

Validator.prototype.validate = function (input, attributes) {
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