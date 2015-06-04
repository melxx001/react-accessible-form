var React = require('react')
var DefaultLayout = require('../views/layout')
var App = require('../build/App');

var Index = React.createClass({
  //var formData = createForm()
  render: function() {
    console.log("Render Form")
    return (
		<DefaultLayout content={this.props.content}> 
			<App />
		</DefaultLayout>
    );
  }
});

module.exports = Index;