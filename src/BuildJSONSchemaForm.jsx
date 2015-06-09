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
	time: function(options, key){
		return <Input type="time" key={key} {...options} />
	},
	datetime: function(options, key){
		return <Input type="datetime" key={key} {...options} />
	},
	datetimelocal: function(options, key){
		return <Input type="datetime-local" key={key} {...options} />
	},
	date: function(options, key){
		return <Input type="date" key={key} {...options} />
	},
	email: function(options, key){
		return <Input type="email" key={key} {...options} />
	},
	password: function(options, key){
		return <Input type="password" key={key} {...options} />
	},
	hidden: function(options, key){
		return <Input type="hidden" key={key} {...options} />
	},
	image: function(options, key){
		return <Input type="image" key={key} {...options} />
	},
	number: function(options, key){
		return <Input type="text" key={key} {...options} />
	},
	/*radio: function(options, key){
		return <Radio key={key} {...options} />
	},*/
	/*checkbox: function(options, key){
		return <CheckBox key={key} {...options} />
	},*/
	file: function(options, key){
		return <Input type="file" key={key} {...options} />
	},
	range: function(options, key){
		return <Input type="range" key={key} {...options} />
	},
	telephone: function(options, key){
		return <Input type="tel" key={key} {...options} />
	},
	url: function(options, key){
		return <Input type="url" key={key} {...options} />
	},
	button: function(options, key){
		return <Input type="button" key={key} {...options} />
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