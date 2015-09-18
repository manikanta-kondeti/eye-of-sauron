/** @jsx React.DOM */

'use strict'

var React = require('react')
var InputField = require('../../components/InputField');
var RedButton = require('../../components/RedButton');




module.exports = React.createClass({

    getInitialState: function() {
        return({alert_message: false})
    },

    handleSubmit: function() {

        var keys = this.props.params.keys.split(',')
        var _this = this;

        $.get('https://the-tasty-samosa.appspot.com/push/get_push_notification_id',
            {
                'title': $('#push_title').val(),
                'text': $('#push_text').val(),
                'name': $('#push_name').val(),
                'expression_list': keys
            },
            function(response) {
                console.log('hi');
                $('#alert_message').html('Your Push Id is '+response['push_id']);
                _this.setState({alert_message: true});
            },
        'json');
    },

    render: function() {

        var RightSideBarStyle = {
            position: 'absolute',
            marginLeft: '200px',
            top: '60px',
            bottom: '0px',
            display: 'block',
            padding: '9px',
            width: '83%'      
        }

        var inputFieldStyle = {
            width: '600px',
            height: '36px',
            margin : '10px'
        }

        var submitStyle= {
            width: '100px',
            height: '30px',
            margin: '15px'
        }

        var alertStyle = {
            display: 'none',
            width: '600px',
            margin: '15px',
            background: '#dff0d8',
            border: '1px solid #d6e9c6',
            height: '50px',
            color: 'white',
            padding: '10px'
        }

        if(this.state.alert_message) {
            alertStyle['display'] = 'block'
        }

        return (

                <div style = {RightSideBarStyle}>


                    GENERATE PUSH NOTIFICATION ID <hr/> 

                    <div id="alert_message" style={alertStyle}>
                        
                    </div>


                    <div style={inputFieldStyle} >
                        <InputField id="push_title" placeholder="Title" />
                    </div>
                    <div style={inputFieldStyle}>
                        <InputField id="push_text" placeholder="Text" />
                    </div> 
                    <div style={inputFieldStyle}>
                         <InputField id="push_name" placeholder="Name" />
                    </div>

                    <div onClick={this.handleSubmit} style={submitStyle}>
                        <RedButton  text = "SUBMIT" />
                    </div>                        
                </div>
        )
    }

});
