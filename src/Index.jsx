var React = require( 'react' )
var Input = require( './formfields/Input' )
var Select = require( './formfields/Select' )
var CheckBox = require( './formfields/CheckBox' )
var Radio = require( './formfields/Radio' )
var Button = require( './formfields/Button' )
var swagger = {
	schema: require( '../example/data/Index.json' ),
	definition: '#/definitions/Expenses'		
}

var Form = React.createClass({
  _onChange: function(){
  	console.log("Parent _onchange")
  },
  _validate: function(input){
  	if(input > 100){
  		return {
	  		result: false,
	  		message: "Custom validation failed"
	  	};
  	}else{
  		return {
	  		result: true,
	  		message: ""
	  	};
  	}
  },
  render: function() {
    return (
    	<div> 
        	<Input required={true} minLength={3} maxLength={10} validationEvent="blur" onChange={this._onChange} preLabel="Expense Type1" id="id-1" />
        	<Input minLength={10} onChange={this._onChange} preLabel="Expense Type2" id="id-2" />
        	<Input minLength={10} validationEvent="change" postLabel="Expense Type3" id="id-3" />
        	<Input isNumber={true} minLength={10} validationEvent="none" label="Expense Type4" id="id-4" />
        	<Input id="id-5" isNumber={true} minLength={10} postLabel="Expense Type5"  />
        	<Select id="id-6" options={[["",""], ["1","option1"], ["2","option2"]]} required={true} preLabel="Expense Type6"  />
        	<Select id="id-7" options={[["",""], ["1","option1"], ["2","option2"]]} postLabel="Expense Type7"  />
        	<Input id="id-8" isNumber={true} minLength={10} label="ReportName" swagger={ swagger } field ="ReportName"  />
        	<Input id="id-9" isNumber={true} minLength={10} label="ReportAmount" swagger={ swagger } field ="ReportAmount" />
        	<Select id="id-10" options={[["0","--"], ["10","option1"], ["20","option2"]]} label="ReportItems" swagger={ swagger } field ="ReportItems" />
        	<Input id="id-11" label="ReportDate" swagger={ swagger } field ="ReportDate" />
        	<Select id="id-12" options={[["false","--"], ["true","TRUE"], ["false","FALSE"]]} label="ReportSubmitted" swagger={ swagger } field ="ReportSubmitted" />
        	<Input id="id-13" width={20} isNumber={true} minLength={10} label="Expense Type6"  />
        	<Input id="id-14" label="Disabled" disabled={true} initialValue="DISABLED" />
        	<Input id="id-15" label="ReadOnly" readOnly={true} initialValue="READONLY" />
        	<CheckBox id="id-16" label="Checkbox1" required={true} value="Checkbox1" />
        	<CheckBox id="id-17" label="Checkbox2" checked={true} value="Checkbox2" />
        	<Button id="id-18" value="Button1" />
        	<Button id="id-19" value="Button2" type="submit" disabled={true} />
        	<Button id="id-20" value="Button3" type="reset" />
        	{/*<Radio label="Radio1" name="radio" checked={true} value="Radio1" />
        	<Radio label="Radio2" name="radio" value="Radio2" />
        	<Radio label="Radio3" name="radio3" value="Radio3" />*/}
        	<Input 
        		id="id-15" 
        		label="customvalidation"
        		customValidation={this._validate}
        	/>
        </div>
      
    );
  }
});

module.exports = Form
