var React = require('react');
var Forms = require('../lib');
var FormComponent = Forms.FormComponent;

var formData = {
	location: { widget: 'input', type: 'text', label: 'Location', placeHolder: 'Enter a location', required: true },
	address: { widget: 'input', type: 'text', required: true , label: 'Address', placeHolder: 'Enter an address', minLength: 2},
	city: { widget: 'input', type: 'text', required: true , label: 'City', placeHolder: 'Enter a city' },
	state: {widget: 'select', label: 'State/Province/Region', options: [["", "--"], ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["VA", "Virginia"]]},
	postalcode: { widget: 'input', type: 'text', required: true , label: 'Postal Code', placeHolder: 'Enter a postal code', minLength: 5, isNumber: true },
	country: {widget: 'select', label: 'Country', options: [["", "--"], ["US", "United States of America"], ["UY", "Uruguay"], ["UM", "USA Minor Outlying Islands"], ["UZ", "Uzbekistan"]]}
};

var Component = React.createClass({
	// mixins: [React.addons.LinkedStateMixin],
	getInitialState: function() {
		return {
			canSubmit: false,
			submittedMessage: ""
		};
	},
	_onSubmit: function(e){
		e.preventDefault();
		// if (this.state.canSubmit) {
			console.log("valid form submitted");
			this.setState({
				submittedMessage: "Form has been submitted"
			});
		// }
	},
	checkForm: function(){
	},
	reset: function(){
		this.setState({
			canSubmit: false,
			submittedMessage: ""
		});
	},
	enableButton: function () {
		this.setState({
			canSubmit: true
		});
	},
	disableButton: function () {
		this.setState({
			canSubmit: false
		});
	},
	render: function () {
		return (
			<form ref="form" onSubmit={this._onSubmit} onChange={this.checkForm}>
				<FormComponent {...formData} />
				<button>Save</button>
				<div>{this.state.submittedMessage}</div>
			</form>
		);
	}
});

module.exports = Component;
