var React = require('react')
var DefaultLayout = require('../views/layout')
var App = require('../build/App')

var Index = React.createClass({
  render: function() {
    return (
		<DefaultLayout content={this.props.content}> 
			<App />
		</DefaultLayout>
    )
  }
})

module.exports = Index