/** @jsx React.DOM */

'use strict'

var React = require('react')
var InputField = require('../../components/InputField');
var RedButton = require('../../components/RedButton');
var config = require('../../config');



module.exports = React.createClass({

    getInitialState: function() {
        return({alert_message: false})
    },

    //function to check file size before uploading.
    beforeSubmit: function(){
        //check whether browser fully supports all File API
        if (window.File && window.FileReader && window.FileList && window.Blob)
        {
        
            if($('#file').val()) //check empty input filed
            {
                var fsize = $('#file')[0].files[0].size; //get file size
                var ftype = $('#file')[0].files[0].type; // get file type
        
                //allow only valid image file types 
                if(ftype == "image/jpeg" || ftype =="image/jpg") {
                
                    //Allowed file size is less than 1 MB (1048576)
                    if(fsize>1048576) 
                    {   
                        $("#output").html("<b>"+fsize +"</b> Too big Image file! <br />Please reduce the size of your photo using an image editor.");
                        return false
                    }
                
                    $("#output").html("");  
               
                }
                else {
                    $("#output").html("Please Upload jpg or jpeg format images");
                    return false;
                }

            }
        }
        else
        {
            //Output error to older browsers that do not support HTML5 File API
            $("#output").html("Please upgrade your browser, because your current browser lacks some new features we need!");
            return false;
        }
    },

    handleSubmit: function(e) {

        var keys = this.props.params.keys.split(',')
        var _this = this;

        var options = { 
            target:   '#output',                // target element(s) to be updated with server response 
            beforeSubmit:  _this.beforeSubmit,
            url: config.ajax_url + '/push/get_push_notification_id',
            clearForm: true,       // clear all form fields after successful submit 
            resetForm: true,        // reset the form after successful submit 
            success:    function(response) { 
                $('#alert_message').html('Your Push Id is '+response['push_id']);
                _this.setState({alert_message: true});
            }, 
            error: function(response) {
                $('#alert_message').html(' Notification text is not a localised unicode string. Localise the push notification text.');
            }

        }; 
        
        $('#upload_form').submit(function(e) { 
            $(this).ajaxSubmit(options);  //Ajax Submit form    
            return false;
        }); 
    },

    render: function() {

        var RightSideBarStyle = {
            position: 'absolute',
            marginLeft: '240px',
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

        var expression_list = this.props.params.keys.split(',');

        console.log(expression_list);

        return (

                <div style = {RightSideBarStyle}>


                    GENERATE PUSH NOTIFICATION ID <hr/> 

                    <div id="alert_message" style={alertStyle}>
                        
                    </div>

                    <form method="post" enctype="multipart/form-data" id="upload_form">
                        <div style={inputFieldStyle} >
                            <InputField name="title" placeholder="Title" />
                        </div>
                         <div style={inputFieldStyle} >
                            <InputField name="text" placeholder="Text" />
                        </div>
                        <div style={inputFieldStyle} >
                            <InputField name="name" placeholder="Name" />
                        </div>
                        <div style={inputFieldStyle} >
                            <InputField name="file" id="file" type="file" />
                        </div>
                        <div style={inputFieldStyle} >
                            <input name="expression_list[]" value={expression_list}  type="hidden" />
                        </div>
                        <div onClick={this.handleSubmit} style={inputFieldStyle} >
                            <RedButton id="submit-btn" text = "Upload" />
                        </div>
                    </form>   
                    <div id="output"></div>                    
                </div>
        )
    }

});
