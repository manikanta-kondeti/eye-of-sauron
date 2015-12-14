/** @jsx React.DOM */
'use strict'
var React = require('react');
var Page = require('page');
var RedButton = require('../../components/RedButton');
var InputField = require('../../components/InputField');
var config = require('../../config');
var LoadingSpinner = require('./../../components/LoadingSpinner');

module.exports = React.createClass({
    getInitialState: function(){
        return({alert_message: false, loading: false})
    },

    /** 
     * This method is used to validate file sizes before submitting the form.
    */
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

    /**
     * This method handles validation(empty checks) before it submits the form.
     */
    validation: function() {
        var transcript = document.getElementById('transcript').value;
        console.log(transcript);
        if (transcript == "") {
            alert('Transcript is empty');
            return false;
        }
        var tags = document.getElementById('tags').value;
        if (tags == "") {
            alert('Tags is empty');
            return false;
        }
        var image_file = document.getElementById('image_file').value;
        if (image_file == "") {
            alert('Image file is empty');
            return false;
        }
        var audio_file = document.getElementById('audio_file').value
        if (audio_file == "") {
            alert('Audio file is empty');
            return false;
        } 

        this.handleSubmitExpression();
    },

    /**
     * This method handles creation of new expression from on browser
    */
    handleSubmitExpression: function() {
        var _this = this;
        this.setState({loading: true});
        var validate_response = this.validation();
        console.log("validate response = " + validate_response);
        if (validate_response == false) {
            return;
        }
        /*
        var options = { 
            target:   '#output',
            beforeSubmit:  _this.beforeSubmit,// target element(s) to be updated with server response 
            url: config.ajax_url + '/dashboard_post_upload_expression',
            success: function(response) { 
                alert(response['status']);
                _this.setState({loading: false});
            }, 
            error: function(response) {
                $('#alert_message').html(' Notification text is not a localised unicode string. Localise the push notification text.');
            }
        }; 
        
        $('#upload_form_of_expression').submit(function(e) { 
            $(this).ajaxSubmit(options);  //Ajax Submit form    
            return false;
        });
        */           
    },




    render: function(){
        
        var RightSideBarStyle = {
            position: 'absolute',
            marginLeft: '240px',
            top: '60px',
            bottom: '0px',
            display: 'block',
            padding: '9px',
            width: '83%'      
        }

        var titleStyle = {
            margin: '12px',
            padding: '10px'
        }

        var selectBoxStyle = {
           width: '600px',
            height: '10px',
            margin : '20px',
            padding: '10px'
        }

        var inputFieldStyle = {
            width: '600px',
            height: '36px',
            margin : '20px',
            padding: '10px'
        }

        var submitStyle = {
            width: '120px',
            height: '30px',
            margin: '30px'
        }

        // Adding a loading toast 
        if (this.state.loading){
            var loadingSpinner = <LoadingSpinner />
        }

        return(
            <div style = {RightSideBarStyle}>
                <h2 style = {titleStyle}> Upload New Expression </h2> 
                <hr/>
                    <form method="post" enctype="multipart/form-data" id="upload_form_of_expression">
                        <div style={inputFieldStyle}>
                            Transcript:
                             <InputField id="transcript" name="transcript" placeholder="Transcript" />
                        </div>
                        <div style={inputFieldStyle}>
                            Tags : 
                            <InputField id="tags" name="tags[]" placeholder="Coma separated values. eg: (news, kcr, telangana, farmers)" />
                        </div> 
        
                        <div style={selectBoxStyle}>
                           Language:
                           <select id="language" name="language">
                               <option value="telugu">Telugu</option>
                               <option value="tamil">Tamil</option>
                               <option value="hindi">Hindi</option>
                               <option value="kannada">Kannada</option>
                               <option value="malayalam">Malayalam</option>
                            </select>
                        </div>
                        <div style={inputFieldStyle}>
                            HTTP link of the video:
                             <InputField id="http_link" name="http_link" placeholder="URL of the video: (eg: https://www.youtube.com/watch?v=RgKAFK5djSk)" />
                        </div>
                        <div style={inputFieldStyle} >
                            Audio file:
                            <InputField name="audio_file" id="audio_file" type="file" />
                        </div>
                        <div style={inputFieldStyle} >
                            Expression Poster:
                            <InputField name="image_file" id="image_file" type="file" />
                        </div>
                        <div onClick={this.validation} style={submitStyle}>
                            <RedButton text = "Upload Expression" />
                        </div>
                        {loadingSpinner}
                    </form>
                <div id="output"></div>
            </div>
        )
    }
})