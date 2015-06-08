var React = require('react')
var DefaultLayout = require('../views/layout/Layout')
var Swaggerform = require('../build/components/SwaggerValidationForm')

var App = React.createClass({
  render: function() {
    return (
		<DefaultLayout content={this.props.content} client="SwaggerValidationFormClient" title={this.props.title}> 
			<Swaggerform />
		</DefaultLayout>
    )
  }
})

module.exports = App