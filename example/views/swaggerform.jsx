var React = require('react')
var DefaultLayout = require('../views/layout')
var SwaggerformApp = require('../build/components/SwaggerformApp')

var Swaggerform = React.createClass({
  render: function() {
    return (
		<DefaultLayout content={this.props.content}> 
			<SwaggerformApp />
		</DefaultLayout>
    )
  }
})

module.exports = Swaggerform