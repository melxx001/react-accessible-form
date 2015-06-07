var React = require('react')
var DefaultLayout = require('../views/layout')
var SwaggerformApp = require('../build/components/BuildSwaggerFormApp')

var Swaggerform = React.createClass({
  render: function() {
    return (
		<DefaultLayout content={this.props.content} client="buildswaggerformClient" title={this.props.title}> 
			<SwaggerformApp />
		</DefaultLayout>
    )
  }
})

module.exports = Swaggerform