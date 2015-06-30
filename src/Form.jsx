var React = require('react');
var { Input, Select, CheckBox, Button, Radio } = require( './FormFields' );

var fields = {
    input: function(options){
        return <Input {...options} />
    },
    select: function(options){
        return <Select {...options} />
    },
    checkBox: function(options){
        return <CheckBox {...options} />
    }/*,
    button: function(options){
        return <Button {...options} />
    },
    radio: function(options){
        return <Radio {...options} />
    }*/
}

var Form = React.createClass({
    propTypes: {
        schemaInfo: React.PropTypes.shape({
            schema: React.PropTypes.object.isRequired,
            definition: React.PropTypes.string.isRequired,
        }),
        formData: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element)
            /*,React.PropTypes.shape({
                widget: React.PropTypes.string,
                type: React.PropTypes.string,
                label: React.PropTypes.string,
                placeHolder: React.PropTypes.string,
                id: React.PropTypes.string 
            })*/
        ]),
        formClassName: React.PropTypes.string
    },
    getDefaultProps: function() {
        return {
            type: 'text',
            initialValue: ''
        };
    },
    getInitialState: function() {
        return {
            errors: '',
            isValid: false
        };
    },
    _validate: function(){

    },
    render: function () {
        var formItems = [];

        if( this.props.schemaInfo && this.props.schemaInfo.schema && this.props.schemaInfo.schema ){
            var definitions = schema.definitions;
            Object.keys(definitions).map((form) => {
                var properties = definitions[form].properties;
                Object.keys(properties).map((item,i) => {
                    var formField = properties[item];
                    formItems.push(
//                        <Input schema={schema} properties={properties} key={item} type={getType(formField.type, formField.format)} label={localization(item)} field={item} />
                    );
                });
            });
        }else if( this.props.formData ){
            formItems = this.props.formData;
        }

        return (
            <div className={this.props.formClassName}> 
                {formItems}
            </div>
        );
    }
});
