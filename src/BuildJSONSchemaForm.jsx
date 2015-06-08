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
	edit: function(options, key){
		return <Input type="text" key={key} {...options} />
	},
	picklist: function(options, key){
		return <Select key={key} {...options} />
	}
}

// Will be in a different file. 
// Did not take in consideration the error section in the swagger doc yet.
var definitions = data.FormDef
var formItems = []
definitions.sort((a,b) => {
  if (a.sequence > b.sequence) {
    return 1
  }
  
  if (a.sequence < b.sequence) {
    return -1
  }
  
  return 0
}).map((fieldInfo, i) => {
	var ctrlType = fieldInfo.ctrlType.toLowerCase();
	formItems.push(
		Formfields[ctrlType](fieldInfo, i)
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