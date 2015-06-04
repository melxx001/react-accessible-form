var React = require('react');
var DefaultLayout = require('../views/layout');
var Form = require('../../lib/index');

var App = React.createClass({
  //var formData = createForm();
  render: function() {
  	console.log("Render Form")
    return (
    	<div> 
        	<Form />
        </div>
      
    );
  }
});

module.exports = App;