var React = require( 'react' )
var { Form, Input, Select, CheckBox, Button, Radio } = require( './FormFields' );
var swagger = {
	schema: require( '../example/data/Index.json' ),
	definition: '#/definitions/Expenses'		
}

var Component = React.createClass({
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
    	<Form action="/formApiTest"> 
        	<Input name="type1" required={true} minLength={3} maxLength={10} validationEvent="blur" onChange={this._onChange} preLabel="Expense Type1" id="id-1" />
        	<Input name="type2" minLength={10} onChange={this._onChange} preLabel="Expense Type2" id="id-2" />
        	<Input name="type3" minLength={10} validationEvent="change" postLabel="Expense Type3" id="id-3" />
        	<Input name="type4" isNumber={true} minLength={10} validationEvent="none" label="Expense Type4" id="id-4" />
        	<Input name="type5" id="id-5" isNumber={true} minLength={10} postLabel="Expense Type5"  />
        	<Select name="type6" id="id-6" options={[["",""], ["1","option1"], ["2","option2"]]} required={true} preLabel="Expense Type6"  />
        	<Select name="type7" id="id-7" options={[["",""], ["1","option1"], ["2","option2"]]} postLabel="Expense Type7"  />
        	<Input name="type8" id="id-8" isNumber={true} minLength={10} label="ReportName" swagger={ swagger } field ="ReportName"  />
        	<Input name="type9" id="id-9" isNumber={true} minLength={10} label="ReportAmount" swagger={ swagger } field ="ReportAmount" />
        	<Select name="type10" id="id-10" options={[["0","--"], ["10","option1"], ["20","option2"]]} label="ReportItems" swagger={ swagger } field ="ReportItems" />
        	<Input name="type11" id="id-11" label="ReportDate" swagger={ swagger } field ="ReportDate" />
        	<Select name="type12" id="id-12" options={[["false","--"], ["true","TRUE"], ["false","FALSE"]]} label="ReportSubmitted" swagger={ swagger } field ="ReportSubmitted" />
        	<Input name="type13" id="id-13" width={20} isNumber={true} minLength={10} label="Expense Type6"  />
        	<Input name="type14" id="id-14" label="Disabled" disabled={true} initialValue="DISABLED" />
        	<Input name="type15" id="id-15" label="ReadOnly" readOnly={true} initialValue="READONLY" />
        	<CheckBox name="type16" id="id-16" label="Checkbox1" required={true} value="Checkbox1" />
        	<CheckBox name="type17" id="id-17" label="Checkbox2" checked={true} value="Checkbox2" />
        	{/*<Radio label="Radio1" name="radio" checked={true} value="Radio1" />
        	<Radio label="Radio2" name="radio" value="Radio2" />
        	<Radio label="Radio3" name="radio3" value="Radio3" />*/}
        	<Input 
                name="type18" 
        		id="id-21" 
        		label="customvalidation"
        		customValidation={this._validate}
        	/>
            <Button id="id-18" value="Button1"  disabled={true} />
            <Button id="id-19" value="submit" type="submit" />
            <Button id="id-20" value="reset" type="reset" />
        </Form>
      
    );
  }
});

module.exports = Component
