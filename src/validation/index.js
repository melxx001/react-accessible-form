'use strict'

var validation = require('validator')

function error(valid = true, message = ""){
	if(valid){
		return { error: false, message: '' }
	}

	return { error: true, message: message }
}

function Validator () {
	this.errors = []
}

Validator.validation = {
	validateRequired: function(input = "") {
		return error(input, 'This field is required!')
	},
	validateMinimumLength: function(input = {length: 0}, length = 0) {
		return error(input.length >= parseInt(length) || parseInt(length) === 0, ['Minimum of', length, 'characters' ].join(" "))
	},
	validateMaximumLength: function(input = "", length = 0) {
		return error(input.length <= parseInt(length) || parseInt(length) === 0, ['Maximum of', length, 'characters' ].join(" "))
	},
	validatePattern: function(input = "", pattern = "") {
		return error(new RegExp(pattern, 'g').test(input), 'Does not match ' + pattern)
	},
	validateEmail: function(input = "") {
		return error(validation.isEmail(input), "Email Error")
	},
	validateUrl: function(input = "") {
		return error(validation.isURL(input), "Url Error")
	},
	validateDate: function(input = "") {
		return error(validation.isDate(input), "Date Error")
	},
	validateTelephone: function(input = "", pattern = "") {
		return error(new RegExp(pattern, 'g').test(input), "Invalid Telephone. Does not match " + pattern)
	},
	validatePassword: function(input = "", pattern = "") {
		return error(new RegExp(pattern, 'g').test(input), "Invalid Password. Does not match " + pattern)
	},
	validateDateTime: function(input = "") {
		return error(validation.isDate(input), "Date Time Error")
	},
	validateFloat: function(input = "") {
		return error(validation.isFloat(input), "Float Error")
	},
	validateInteger: function(input = "") {
		return error(validation.isInt(input), "Integer Error")
	},
	validateNumber: function(input = "") {
		return error(validation.isNumeric(input), "Number Error")
	}
}

Validator.prototype.validate = function(input = "", attributes = {}) {
	var result = []
	Object.keys(attributes).forEach(function(attr){
		var validate = Validator.validation[attr]
		if(validate){
			result.push(validate(input, attributes[attr]))
		}
	}.bind(this))
	return result
}


module.exports = Validator