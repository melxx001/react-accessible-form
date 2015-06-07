var React = require('react')
var DefaultLayout = require('../views/layout')
var App = require('../build/components/App')

var Index = React.createClass({
  render: function() {
    return (
		<DefaultLayout content={this.props.content} client="indexClient" title={this.props.title}> 
			<App />
		</DefaultLayout>
    )
  }
})

module.exports = Index