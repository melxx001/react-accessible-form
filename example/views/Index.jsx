var React = require('react')
var DefaultLayout = require('../views/layout/Layout')
var App = require('../build/components/Index')

var Index = React.createClass({
  render: function() {
    return (
		<DefaultLayout content={this.props.content} client="AppClient" title={this.props.title}> 
			<App />
		</DefaultLayout>
    )
  }
})

module.exports = Index