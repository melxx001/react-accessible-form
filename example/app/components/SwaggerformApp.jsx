var React = require('react/addons')
var SwaggerForm = require('../../../lib/swaggerform')

var SwaggerFormApp = React.createClass({
      render: function () {
        return (
          <div>
            <SwaggerForm />
          </div>
        )
      }
  })

module.exports = SwaggerFormApp