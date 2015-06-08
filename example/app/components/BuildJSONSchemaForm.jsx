var React = require('react/addons')
var JSONSwaggerForm = require('../../../lib/BuildJSONSchemaForm')

var App = React.createClass({
      render: function () {
        return (
          <div>
            <JSONSwaggerForm />
          </div>
        )
      }
  })

module.exports = App