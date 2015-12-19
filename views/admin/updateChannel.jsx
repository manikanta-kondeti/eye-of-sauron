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

    componentDidMount: function() {
        // Update fields with current channel fields 

        var _this = this;
        /*
        $.get(config.ajax_url + '/dashboard_get_user_owned_channels' ,function(response) { 
            // List of channels
            var channels = response['channels'];
            var channels_length = response['channels_length'];
            var select = document.getElementById('select_channel');
            for(var i=0; i<channels_length; i++) {
                    var opt = document.createElement('option');
                    opt.value = channels[i].id;
                    opt.innerHTML = channels[i].name;
                    select.appendChild(opt);
            }
        }); 
        */ 
    },

    /**
     * getChannelInfo: This method will query the server for channel information
    **/
    getChannelInfo: function() {
        var _this = this;
        this.setState({loading: true});
        // Get Channel information from server 
        $.get(config.ajax_url + '/dashboard_get_user_owned_channel' , { channel_id : document.getElementById('select_channel').value }, function(resp){
                    if ('status' in resp) {
                        alert(resp['status']);
                        _this.setState({loading: false});
                        return
                    }
                    $('#display_name').val(resp['name']);
                    $('#tags').val(resp['tags']);
                    if ('primary_languages' in resp) {
                        $('#primary_language').val(resp['primary_languages'][0]);
                    }
                    $('#is_comments_enabled').val(String(resp['is_comments_enabled']));
                    $('#poster').attr('src',resp['poster_url']);
                    _this.setState({loading: false});

                    if (resp['poster_url'] == null) {
                        $('#poster').attr('src', "http://s11.postimg.org/9d1tac1rn/upload_poster.jpg");
                    }
        }).fail(function() {
                console.log("e.status ");
                alert("INTERNAL SERVER ERROR, please report it to ADMIN");
                _this.setState({loading: false});               
        });

        // Updating channel's image
        
    },

    /** 
     * This method is used to validate file sizes before submitting the form.
    **/
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
     * This method handles validation(empty checks) before it submits the form
     */
    validation: function() {

        var display_name = document.getElementById('display_name').value;
        if (display_name == "") {
            alert('Display name is empty');
            return false;
        }
        var tags = document.getElementById('tags').value;
        if (tags == "") {
            alert('Tags are empty');
            return false;
        }

        this.handleSubmitChannel();
    },

    /**
     * This method is used to edit changes of the unapproved clip
     * @params: These are the six fields sent: languages, primary_language, actor_unique_id, movie_id, display_name, gender
     * @return: status of the request  
    */
    handleSubmitChannel: function() {
        var _this = this;
        this.setState({loading: true});

        $('#create_channel_button').hide();
        var options = { 
            target:   '#output',
            beforeSubmit:  _this.beforeSubmit,// target element(s) to be updated with server response 
            url: config.ajax_url + '/dashboard_post_channels_editorial',
            success: function(response) { 
                alert(response['status']);
                _this.setState({loading: false});
                $("#upload_form_of_channel")[0].reset();
                $('#create_channel_button').show();
                // Update poster 
                $('#poster').attr('src', "http://s21.postimg.org/6rrgmvyt3/select_a_channel.jpg");

            }, 
            error: function(e,status) {
                console.log("e.status ");
                if (e.status == 404) {
                    alert("404 error");
                }
                if (e.status >= 500) {
                    alert("Internal Server Error, please report it to admin");
                }
                _this.setState({loading: false});
                
            }
        }; 
        
        $('#upload_form_of_channel').submit(function(e) {   //Ajax Submit form   
            e.preventDefault();
            e.stopImmediatePropagation(); 
            $(this).ajaxSubmit(options);
            return false;
        });           
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

        var voiceStyle = {
            float: 'right', 
            marginRight: '150px',
            display: 'block'
        }

        var posterStyle = {
            width: 'auto',
            height: 'auto'
        }

        var inputChannelStyle = {
            width: '125px',
            height : '25px',
            margin: '2px',
            padding: '2px'
        }
        // Adding a loading toast 
        if (this.state.loading){
            var loadingSpinner = <LoadingSpinner />
        }

        return(
            <div style = {RightSideBarStyle}>
                <h2 style = {titleStyle}> Update Channel </h2> 
                <hr/>
                    <div style={voiceStyle}>
                        <img id="poster" src="http://s21.postimg.org/6rrgmvyt3/select_a_channel.jpg" width="350px" height="350px" />
                    </div>
                    <form method="post" enctype="multipart/form-data" id="upload_form_of_channel">
                        <div style={selectBoxStyle}>
                           Channel :
                           <input type="textbox" style={inputChannelStyle} id="select_channel" name="channel_id" />
                           <input type="button" value="Get Channel" onClick={this.getChannelInfo} />
                        </div>

                        <div style={inputFieldStyle}>
                            Display Name:
                            <InputField id="display_name" name="display_name" placeholder="Display Name: (V6 news, TV9 news, Radiomirchi 98.3 FM) " />
                        </div> 
                        <div style={inputFieldStyle}>
                            Tags: 
                            <InputField id="tags" name="tags[]" placeholder="Tags: (V6 news, sports, news, politics, family, entertainment etc.) " />
                        </div> 
                        <div style={selectBoxStyle}>
                            Primary language:
                           <select id="primary_language" name="primary_language">
                               <option value="None"> </option>
                               <option value="telugu">Telugu</option>
                               <option value="tamil">Tamil</option>
                               <option value="hindi">Hindi</option>
                               <option value="kannada">Kannada</option>
                               <option value="malayalam">Malayalam</option>
                            </select>
                        </div>
                        <div style={selectBoxStyle}>
                            Is Replies Enabled: 
                            <select id="is_comments_enabled" name="is_comments_enabled">
                               <option value="true">True</option>
                               <option value="false">False</option>
                            </select>
                        </div>
                        <div style={inputFieldStyle} >
                            Channel Poster(Mandatory)
                            <InputField name="image_file" id="image_file" type="file" />
                        </div>
                        <div onClick={this.validation} id="create_channel_button" style={submitStyle}>
                            <RedButton  text = "Update Channel" />
                        </div>
                        <div style={inputFieldStyle} >
                            <input name="type_of_query" id="type_of_query" value="old_channel" type="hidden" />  
                        </div>
                        {loadingSpinner}
                    </form>
                <div id="output"></div>
            </div>
        )
    }
})