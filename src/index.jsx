var React = require('react');
var ReactBootstrap  = require('react-bootstrap');
//var validator = require('../concur-form-validator');
//var formValidation = new validator();
var debug = require('debug')('react-accessible-forms:index.jsx');

var generate_schema = require('generate-schema')

function getSchema(json){
	debug("Generating schema");
	return generate_schema.json(json)
}

exports.getSchema = getSchema

var Input = React.createClass({
	propTypes: {
			required: React.PropTypes.bool,
			type: React.PropTypes.string,
			name: React.PropTypes.string,
			label: React.PropTypes.string,
			placeHolder: React.PropTypes.string,
			minLength: React.PropTypes.number
	},
	getDefaultProps () {
		return {
			required: false,
			type: 'text',
			name: "",
			label: "",
			minLength: 0,
			placeHolder: "",
			initialValue: ""
		};
	},
	getInitialState: function() {
		return {
			errors: "",
			isValid: false,
			value: this.props.initialValue
		};
	},
	validate: function(event){
		/*var data = event.target;
		var results = formValidation.validate(data.value, data.dataset);
		var messages = [];
		results.forEach(function(result){
			if(result.error){
				messages.push(result.message)
			}
		});

		this.setState({
			value: data.value,
			errors: messages.join(" - "),
			isValid: (messages.length === 0) ? true : false
		});*/

	},
	render: function () {
		return (
			<div>
				<ReactBootstrap.Input
					type={this.props.type} 
					name={this.props.name}
					label={this.props.label}
					placeholder={this.props.placeHolder}
					data-validate-required={this.props.required}
					data-validate-minimum={this.props.minLength}
					data-isvalid={this.state.isValid}
					bsStyle = {this.state.isValid ? 'success' : 'error'}
					onChange={this.validate}
					value={this.state.value}
					groupClassName='group-class'
					labelClassName='label-class'
				/>
				<span>{this.state.errors}</span>
			</div>
		)
	}
});

var Select = React.createClass({
	propTypes: {
			required: React.PropTypes.bool,
			name: React.PropTypes.string,
			label: React.PropTypes.string,
			options: React.PropTypes.any.isRequired
	},
	getDefaultProps () {
		return {
			required: false,
			name: "",
			label: "",
			options: [["",""]],
			initialValue: ""
		};
	},
	getInitialState: function() {
		return {
			errors: "",
			isValid: false,
			value: this.props.initialValue
		};
	},
	validate: function(event){
		var data = event.target;
		var results = formValidation.validate(data.value, data.dataset);
		var messages = [];
		results.forEach(function(result){
			if(result.error){
				messages.push(result.message)
			}
		});

		this.setState({
			value: data.value,
			errors: messages.join(" - "),
			isValid: (messages.length === 0) ? true : false
		});

	},
	render: function () {
		var options = this.props.options;
		var optionsHtml = [];
		Object.keys(options).forEach(function(option, i){
			var choice = options[i];
			optionsHtml.push(<option key={i} value={choice[0]}>{choice[1]}</option>);
		});
		return (
			<div>
				<label>{this.props.label}</label>
				<select 
					name={this.props.name}
					placeholder={this.props.placeHolder}
					data-validate-required={this.props.required}
					data-isvalid={this.state.isValid}
					onChange={this.validate}
					value={this.state.value}  
				>
				{optionsHtml}
				</select>
				<span>{this.state.errors}</span>
			</div>
		)
	}
});

var fields = {
	input: function(options){
		return <Input {...options} />
	},
	select: function(options){
		return <Select {...options} />
	}
}

var FormComponent = React.createClass({
	getInitialState: function(){
		return {
			options: this.props 	// Probably don't need this as a state
		}
	},
	render: function(){
		var temp = [];
		var options = this.state.options;

		Object.keys(options).forEach(function(option, i){
			var formRowData = options[option];
			formRowData.key = i;
			temp.push(fields[formRowData.widget.toLowerCase()](formRowData));
		});

		return (
			<div>{temp}</div>
		)
	}
});

exports.Input = Input;
exports.Select = Select;
exports.FormComponent = FormComponent;
