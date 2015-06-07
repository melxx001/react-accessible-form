var React = require('react')
var DefaultLayout = require('../views/layout')
var SwaggerformApp = require('../build/components/SwaggerFormApp')

var Swaggerform = React.createClass({
  render: function() {
    return (
		<DefaultLayout content={this.props.content} client="swaggerformClient" title={this.props.title}> 
			<SwaggerformApp />
		</DefaultLayout>
    )
  }
})

module.exports = Swaggerform