var React = require('react')
var DefaultLayout = require('../views/layout/Layout')
var Swaggerform = require('../build/components/BuildSwaggerForm')

var App = React.createClass({
  render: function() {
    return (
		<DefaultLayout content={this.props.content} client="BuildSwaggerFormClient" title={this.props.title}> 
			<Swaggerform />
		</DefaultLayout>
    )
  }
})

module.exports = App