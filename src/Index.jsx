var React = require('react')
var Input = require('./formfields/Input')

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
        </div>
      
    );
  }
});

module.exports = Form