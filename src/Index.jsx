var React = require('react')
var Input = require('./formfields/Input')

var Form = React.createClass({
  _onChange: function(){
  	console.log("Parent _onchange")
  },
  render: function() {
    return (
    	<div> 
        	<Input onChange={this._onChange} preLabel="Expense Type1" id="id-1" />
        	<Input postLabel="Expense Type2" id="id-2" />
        	<Input label="Expense Type2" id="id-2" />
        </div>
      
    );
  }
});

module.exports = Form