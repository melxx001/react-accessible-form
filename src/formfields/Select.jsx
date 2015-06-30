var React = require( 'react' )
var validator = require( '../validation' )
var formValidation = new validator()

var Select = React.createClass({
    propTypes: {
        required: React.PropTypes.bool,
        name: React.PropTypes.string,
        label: React.PropTypes.node,
        prelabel: React.PropTypes.node,
        postlabel: React.PropTypes.node,
        groupClassName: React.PropTypes.string,
        labelClassName: React.PropTypes.string,
        errorClassName: React.PropTypes.string,
        fieldClassName: React.PropTypes.string,
        validationEvent: React.PropTypes.string,
        disabled: React.PropTypes.bool,
        options: React.PropTypes.array,
        id: React.PropTypes.string.isRequired,
        swagger: React.PropTypes.shape({
            schema: React.PropTypes.object.isRequired,
            definition: React.PropTypes.string.isRequired,
        }),
        initialValue: React.PropTypes.string,
        field: React.PropTypes.string,
        customValidation: React.PropTypes.func
    },
    getDefaultProps: function() {
        return {
            options: [["",""]],
            initialValue: ''
        };
    },
    getInitialState: function() {
        return {
            errors: '',
            value: this.props.initialValue,
            isValid: this.props.initialValue ? true : false
        };
    },
    _onChange: function( event ) {
        var value = event.target.value.trim();
        this.setState({
            value: value
        }, () => {
            // Run the parent onChange if it exists
            if(this.props.onChange){
                this.props.onChange( this );
            }

            // Validate on onChange if explicitly set
            if( this.props.validationEvent && this.props.validationEvent.toLowerCase() === 'change' ){
                this._validate( this.state.value, event.target.dataset );
            }
        });
    },
    _onBlur: function( event ) {
        // Run the parent onBlur if it exists
        if( this.props.onBlur ){
            this.props.onBlur(this);
        }

        // Validate onBlur by default
        if( !this.props.validationEvent || ( this.props.validationEvent && this.props.validationEvent.toLowerCase() === 'blur' ) ){
            this._validate( this.state.value, event.target.dataset );
        }
    },
    _getSwaggerProperties: function( schema , definition ){
        if( !schema || !definition ){
            return null;
        }

        var definitions = schema.definitions;
        var properties = {};

        Object.keys(definitions).map( ( def ) => {
            if( def === definition.replace( '#/definitions/' , '' ) ){
                properties = definitions[ def ].properties;
            }
        });

        return properties;
    },
    _validate: function( value, dataset ){
        var results = [];
        var messages = [];
        var swagger = this.props.swagger;

        if( swagger && swagger.schema && swagger.definition ){
            if( this.props.field ){
                let properties = this._getSwaggerProperties( swagger.schema, swagger.definition );
                if( properties ){
                    results = formValidation.swaggerValidate( value, this.props.field, swagger.schema, properties, swagger.definition );
                }
            }else{
                console.warn( 'Warning: The property `field` must be part of this.props for swagger validation. Check if this.props.field is defined.' );
            }
        }else{
            results = formValidation.validate( value, dataset, this.props.customValidation );
        }

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
    render: function () {
        var preLabel = undefined;
        var postLabel = undefined;
        var errors = [];
        var options = this.props.options;
        var optionsHtml = [];
        var errorId = undefined;
        var fieldClassName = this.props.fieldClassName;

        if ( this.props.preLabel || this.props.label ){
            preLabel = <label htmlFor={ this.props.id } className={ this.props.labelClassName }>{ this.props.preLabel || this.props.label }</label>
        }else if ( this.props.postLabel ){
            postLabel = <label htmlFor={ this.props.id } className={ this.props.labelClassName }>{ this.props.postLabel }</label>
        }else{
            console.warn( 'Warning: Failed propType: Required prop `label`, `preLabel` or `postLabel` was not specified in `Select`.' );
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
            })
        }

        Object.keys(options).forEach(function( option, i ){
            var choice = options[i];
            optionsHtml.push( <option key={ 'option' + i } value={ choice[0] }>{ choice[1] }</option> );
        })

        return (
            <div className = { this.props.groupClassName }>
                { preLabel }
                <select
                    id = { this.props.id }
                    name = { this.props.name }
                    data-validate-required = { this.props.required }
                    data-isvalid = { this.state.isValid }
                    aria-invalid = { !this.state.isValid }
                    aria-required = { this.props.required }
                    aria-describedby = { errorId }
                    onChange = { this._onChange }
                    onBlur = { this._onBlur }
                    className = { fieldClassName }
                    value = { this.state.value }    // Manipulation of the component's options is though value
                    disabled = { this.props.disabled }
                >
                { optionsHtml }
                </select>
                { postLabel }
                <span id = { errorId } >
                    { errors }
                </span>
            </div>
        )
    }
});

module.exports = Select;
