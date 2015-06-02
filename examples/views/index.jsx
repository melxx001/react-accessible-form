var React = require('react');
var DefaultLayout = require('./layout');
var Form = require('../../lib');

var App = React.createClass({
  //var formData = createForm();
  render: function() {
  	console.log("Render Form")
    return (
    	<DefaultLayout> 
        	<Form />
        </DefaultLayout>
      
    );
  }
});

module.exports = App;