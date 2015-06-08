var React = require('react')
var DefaultLayout = require('../views/layout/Layout')
var Swaggerform = require('../build/components/BuildJSONSchemaForm')

var App = React.createClass({
  render: function() {
    return (
		<DefaultLayout content={this.props.content} client="BuildJSONSchemaFormClient" title={this.props.title}> 
			<Swaggerform />
		</DefaultLayout>
    )
  }
})

module.exports = App