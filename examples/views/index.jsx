var React = require('react');
var DefaultLayout = require('./layout');

var HelloMessage = React.createClass({
  render: function() {
    return (
      <DefaultLayout title={this.props.swagger}>
        <div>Hello {this.props}</div>
      </DefaultLayout>
    );
  }
});

module.exports = HelloMessage;