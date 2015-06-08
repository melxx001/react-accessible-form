var React = require('react/addons')
var SwaggerForm = require('../../../lib/SwaggerValidationForm')

var App = React.createClass({
      render: function () {
        return (
          <div>
            <SwaggerForm />
          </div>
        )
      }
  })

module.exports = App