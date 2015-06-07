var React = require('react/addons')
var SwaggerForm = require('../../../lib/buildswaggerform')

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