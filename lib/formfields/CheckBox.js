'use strict';

var React = require('react');
var validator = require('../validation');
var formValidation = new validator();

var CheckBox = React.createClass({ displayName: 'CheckBox',
    propTypes: {
        name: React.PropTypes.string.isRequired,
        label: React.PropTypes.string,
        prelabel: React.PropTypes.string,
        postlabel: React.PropTypes.string,
        groupClassName: React.PropTypes.string,
        labelClassName: React.PropTypes.string,
        errorClassName: React.PropTypes.string,
        fieldClassName: React.PropTypes.string,
        validationEvent: React.PropTypes.string,
        disabled: React.PropTypes.bool,
        checked: React.PropTypes.bool,
        value: React.PropTypes.string.isRequired,
        id: React.PropTypes.string.isRequired
    },
    getDefaultProps: function getDefaultProps() {
        return {
            checked: false
        };
    },
    getInitialState: function getInitialState() {
        return {
            checked: this.props.checked
        };
    },
    _onChange: function _onChange(event) {
        this.setState({
            checked: !this.state.checked
        });

        // Run the parent onChange if it exists
        if (this.props.onChange) {
            this.props.onChange(this);
        }
    },
    _onReset: function _onReset() {
        // Run the parent onReset if it exists
        if (this.props.onReset) {
            this.props.onReset(this);
        }

        this.setState({
            value: this.props.checked
        });
    },
    componentWillReceiveProps: function componentWillReceiveProps() {
        var nextProps = arguments[0] === undefined ? {} : arguments[0];

        if (nextProps.reset) {
            this._onReset();
        }
    },
    render: function render() {
        var preLabel = undefined;
        var postLabel = undefined;
        var errors = [];

        if (this.props.preLabel || this.props.label) {
            preLabel = React.createElement('label', { htmlFor: this.props.id, className: this.props.labelClassName }, this.props.preLabel || this.props.label);
        } else if (this.props.postLabel) {
            postLabel = React.createElement('label', { htmlFor: this.props.id, className: this.props.labelClassName }, this.props.postLabel);
        } else {
            console.warn('Warning: Failed propType: Required prop `label`, `preLabel` or `postLabel` was not specified in `CheckBox`.');
        }

        return React.createElement('div', { className: this.props.groupClassName }, preLabel, React.createElement('input', {
            id: this.props.id,
            type: 'checkbox',
            name: this.props.name,
            onChange: this._onChange,
            onReset: this._onReset,
            value: this.props.value,
            className: this.props.fieldClassName,
            disabled: this.props.disabled,
            checked: this.state.checked }), postLabel);
    }
});

module.exports = CheckBox;