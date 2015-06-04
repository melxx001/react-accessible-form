var React = require('react/addons');
var Form = require('../../lib');


var App = React.createClass({
      componentDidMount: function () {
          /* do something */
      },
      render: function () {
        return (
          <div>
            <Form />
          </div>
        )
      }
  });

/* Module.exports instead of normal dom mounting */
module.exports = App;