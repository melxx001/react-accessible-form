'use strict'

function Validator () {
	this.errors = []
}

Validator.validation = {
	validateRequired: function(input = "") {
		if(input){
			return { error: false, message: '' }
		}

		return { error: true, message: 'This field is required!' }
	},
	validateMinimumLength: function(input = {length: 0}, length = 0) {
		if(input.length >= parseInt(length) || parseInt(length) === 0){
			return { error: false, message: '' }
		}

		return { error: true, message: ['Minimum of', length, 'characters' ].join(" ")}
	},
	validateMaximumLength: function(input = "", length = 0) {
		if(input.length <= parseInt(length) || parseInt(length) === 0){
			return { error: false, message: '' }
		}

		return { error: true, message: ['Maximum of', length, 'characters' ].join(" ")}
	},
	validatePattern: function(input = "", pattern = "") {
		var reg = new RegExp(pattern, 'g').test(input)
		if(reg){
			return { error: false, message: '' }
		}

		return { error: true, message: ['Does not match ' + pattern ].join(" ")}
	}
}

Validator.prototype.validate = function(input, attributes) {
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