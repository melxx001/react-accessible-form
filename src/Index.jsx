var React = require('react')
var Input = require('./formfields/Input')

var Form = React.createClass({
  render: function() {
    return (
    	<div> 
        	<Input schema={this.props} type="text" preLabel="Expense Type1" id="id-1" sequence="1" field="id" />
        	<Input schema={this.props} type="text" postLabel="Expense Type2" id="id-2" sequence="2" field="sequence" />
        	<Input schema={this.props} type="text" label="Expense Type2" id="id-2" sequence="2" field="ctrlType" />
        </div>
      
    );
  }
});

module.exports = Form