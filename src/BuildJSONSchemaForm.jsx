var React = require('react')
var Input = require('./formfields/Input')
var Select = require('./formfields/Select')

// Simulate api call
var data = require('../example/data/BuildJSONSchemaFormData.json')

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

var Formfields = {
	input: function(options, key){
		return <Input key={key} {...options} />
	},
	select: function(options, key){
		//options.key = options.key || key
		return <Select key={key} {...options} />
	}
}

// Will be in a different file. 
// Did not take in consideration the error section in the swagger doc yet.
var definitions = data.FormDef
var formItems = []
definitions.map((fieldInfo, i) => {
	var fieldType = fieldInfo.fieldType.toLowerCase();
	formItems.push(
		Formfields[fieldType](fieldInfo, i)
	)
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