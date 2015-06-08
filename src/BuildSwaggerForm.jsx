var React = require('react')
var Input = require('./formfields/Input')

// Simulate api call
var schema = require('../example/data/BuildSwaggerForm.json')

// Form field types
var formFieldType = {
	string : "text",
	number: "text",
	email: "email",
	password: "password",
	object: {
		date: "date"
	}
}

// Get the form field type
function getType(type = "string", format = ""){
	type = type.toLowerCase()
	if(type === 'object' && format){
		return formFieldType[type][format]
	}

	return formFieldType[type]
}

function localization(type){
	return type + " Field"
}

// Will be in a different file. 
// Did not take in consideration the error section in the swagger doc yet.
var definitions = schema.definitions
var formItems = []
Object.keys(definitions).map((form) => {
	var properties = definitions[form].properties
	Object.keys(properties).map((item,i) => {
		var formField = properties[item]
		formItems.push(
			<Input schema={schema} properties={properties} key={item} type={getType(formField.type, formField.format)} label={localization(item)} field={item} />
		)
	})
})

var Form = React.createClass({
	render: function() {
		return (
			<div> 
				{formItems}
			</div>
		)
	}
})


module.exports = Form