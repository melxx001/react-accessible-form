var React = require('react')
var Input = require('./formfields/Input')
var Select = require('./formfields/Select')
var swagger = {
	schema: require('../example/data/Index.json'),
	definition: '#/definitions/Expenses'		
}

var Form = React.createClass({
  _onChange: function(){
  	console.log("Parent _onchange")
  },
  render: function() {
    return (
    	<div> 
        	<Input required={true} minLength={3} maxLength={10} validation="blur" onChange={this._onChange} preLabel="Expense Type1" id="id-1" />
        	<Input minLength={10} onChange={this._onChange} preLabel="Expense Type2" id="id-2" />
        	<Input minLength={10} validation="change" postLabel="Expense Type3" id="id-3" />
        	<Input isNumber={true} minLength={10} validation="none" label="Expense Type4" id="id-4" />
        	<Input isNumber={true} minLength={10} postLabel="Expense Type5"  />
        	<Select options={[["",""], ["1","option1"], ["2","option2"]]} required={true} preLabel="Expense Type6"  />
        	<Select options={[["",""], ["1","option1"], ["2","option2"]]} postLabel="Expense Type7"  />
        	<Input isNumber={true} minLength={10} label="ReportName" swagger={ swagger } field ="ReportName"  />
        	<Input isNumber={true} minLength={10} label="ReportAmount" swagger={ swagger } field ="ReportAmount" />
        	<Select options={[["0","--"], ["10","option1"], ["20","option2"]]} label="ReportItems" swagger={ swagger } field ="ReportItems" />
        	<Input label="ReportDate" swagger={ swagger } field ="ReportDate" />
        	<Select options={[["false","--"], ["true","TRUE"], ["false","FALSE"]]} label="ReportSubmitted" swagger={ swagger } field ="ReportSubmitted" />
        	<Input width={20} isNumber={true} minLength={10} label="Expense Type6"  />
        </div>
      
    );
  }
});

module.exports = Form