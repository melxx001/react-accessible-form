var React = require( 'react' );
var validator = require( '../validation' );
var formValidation = new validator();

var TextArea = React.createClass({
    propTypes: {
        required: React.PropTypes.bool,
        name: React.PropTypes.string.isRequired,
        label: React.PropTypes.node,
        prelabel: React.PropTypes.node,
        postlabel: React.PropTypes.node,
        placeHolder: React.PropTypes.string,
        minLength: React.PropTypes.number,
        maxLength: React.PropTypes.number,
        groupClassName: React.PropTypes.string,
        labelClassName: React.PropTypes.string,
        errorClassName: React.PropTypes.string,
        fieldClassName: React.PropTypes.string,
        validationEvent: React.PropTypes.string,
        validationPattern: React.PropTypes.string,
        readOnly: React.PropTypes.bool,
        disabled: React.PropTypes.bool,
        id: React.PropTypes.string,
        schemaInfo: React.PropTypes.shape({
            schema: React.PropTypes.object.isRequired,
            definition: React.PropTypes.string.isRequired,
        }),
        field: React.PropTypes.string,
        customValidation: React.PropTypes.func,
        rows: React.PropTypes.number,
        cols: React.PropTypes.number,
        wrap: React.PropTypes.string
    },
    getDefaultProps: function() {
        return {
            initialValue: '',
            schemaInfo: {
                schema: {},
                definition: ''
            },
            field: '' 
        };
    },
    getInitialState: function() {
        return {
            errors: '',
            value: this.props.initialValue,
            isValid: true
        };
    },
    _onChange: function( event ) {
        var target = event.target; 
        var value = target.value;

        this.setState({
            value: value
        }, () => {
            // Run the parent onChange if it exists
            if(this.props.onChange){
                this.props.onChange( this );
            }

            // Validate on onChange if explicitly set
            if( this.props.validationEvent && this.props.validationEvent.toLowerCase() === 'change' ){
                this._validate( this.state.value, target.dataset );
            }
        });
    },
    _onReset: function(){
        this.setState({
            value: this.props.initialValue,
            errors: [],
            isValid: true
        }, () => {
            // Run the parent onReset if it exists
            if( this.props.onReset ){
                this.props.onReset( this );
            }
        });
    },
    _onBlur: function( event ) {
        // Run the parent onBlur if it exists
        if( this.props.onBlur ){
            this.props.onBlur( this );
        }

        // Validate onBlur by default
        if( !this.props.validationEvent || ( this.props.validationEvent && this.props.validationEvent.toLowerCase() === 'blur' ) ){
            this._validate( this.state.value, event.target.dataset );
        }
    },
    _onInput: function( event ) {
        // Run the parent onInput if it exists
        if( this.props.onInput ){
            this.props.onInput( this );
        }

        // Validate on onInput if explicitly set
        if( this.props.validationEvent && this.props.validationEvent.toLowerCase() === 'input' ){
            this._validate( this.state.value, event.target.dataset );
        }
    },
    _validate: function( value, dataset ){
        var results = [];
        var messages = [];
        var schemaInfo = this.props.schemaInfo;

        results = formValidation.validate( value, dataset, this.props.customValidation, {
            value: value, 
            field: this.props.field,
            schema: schemaInfo.schema, 
            definition: schemaInfo.definition
        });

        results.forEach(function( result ){
            if( result.error ){
                messages.push( result.message );
            }
        });

        this.setState({
            errors: messages,
            isValid: ( messages.length === 0 ) ? true : false
        });
    },
    componentWillReceiveProps: function( nextProps = {} ){
        if( nextProps.reset ){
            this._onReset();
        } else if( nextProps.formValidation && nextProps.formValidation.complete ){
            let element = formValidation.findValidatedComponent( nextProps.formValidation.results, this.props ); 
            let messages = [];

            if( element ){
                element.errors.forEach( function( error ){
                    messages.push( error.message );
                });
            }

            this.setState({
                errors: messages,
                isValid: ( messages.length === 0 ) ? true : false
            });
        }
    },
    render: function () {
        var preLabel = undefined;
        var postLabel = undefined;
        var errors = [];
        var errorId = undefined;
        var fieldClassName = this.props.fieldClassName;

        if ( this.props.preLabel || this.props.label ){
            preLabel = <label htmlFor={ this.props.id } className={ this.props.labelClassName }>{ this.props.preLabel || this.props.label }</label>
        }else if ( this.props.postLabel ){
            postLabel = <label htmlFor={ this.props.id } className={ this.props.labelClassName }>{ this.props.postLabel }</label>
        }else{
            console.warn( 'Warning: Failed propType: Required prop `label`, `preLabel` or `postLabel` was not specified in `TextArea`.' );
        }

        if( this.state.errors.length > 0 ){
            errorId = '__' + ( this.props.id ? this.props.id : '' ) + '-errors';
            if(this.props.fieldErrorClassName){
                fieldClassName = [
                    fieldClassName ? fieldClassName : ' ', 
                    this.props.fieldErrorClassName
                ].join('');
            }
            
            this.state.errors.forEach( ( error, i ) => {    // used an arrow function to keep the context of this
                errors.push( <span key={ 'errmessage' + i } className={ this.props.errorClassName }>{ error }</span> );
            });
        }

        return (
            <div className = { this.props.groupClassName }>
                { preLabel }
                <textarea
                    id = { this.props.id }
                    name = { this.props.name }
                    rows = { this.props.rows }
                    cols = { this.props.cols }
                    wrap = { this.props.wrap }
                    data-validate-required = { this.props.required }
                    data-validate-minimum-length = { this.props.minLength }
                    data-validate-maximum-length = { this.props.maxLength }
                    data-validate-pattern = { this.props.validationPattern }
                    data-is-valid = { this.state.isValid }
                    aria-invalid = { !this.state.isValid }  // Is this correct?
                    aria-required = { this.props.required }
                    aria-describedby = { errorId }
                    placeholder = { this.props.placeHolder }
                    onChange = { this._onChange }
                    onBlur = { this._onBlur }
                    onInput = { this._onInput }
                    onReset = { this._onReset }
                    value = { this.state.value }
                    className = { fieldClassName }
                    readOnly = { this.props.readOnly }
                    disabled = { this.props.disabled }
                />
                { postLabel }
                <span id = { errorId } >
                    { errors }
                </span>
            </div>
        );
    }
});

module.exports = TextArea;
