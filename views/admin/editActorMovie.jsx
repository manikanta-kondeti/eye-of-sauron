/** @jsx React.DOM */

'use strict'

var React = require('react')
var InputField = require('../../components/InputField');
var RedButton = require('../../components/RedButton');
var Clip = require('../../components/showClip');
var config = require('../../config');
var Autocomplete = require('react-autocomplete');
var LoadingSpinner = require('./../../components/LoadingSpinner');

module.exports = React.createClass({

    getInitialState: function() {
        return({alert_message: false, voice: [], entity_type: null, loading: false})
    },

    componentDidMount: function() {
        var _this = this;
        //Fetch ajax call
        $.get(config.ajax_url + '/dashboard_get_actor_movie_entity',{key: this.props.edit_key} ,function(response) { 
                    // Writing results here 
                     $('#key').val(response.results['key']);
                     $('#tags').val(response.results['tags']);
                     $('#display_name').val(response.results['display_name']);
                     $('#full_name').val(response.results['full_name']);
                     $('#gender').val(response.results['gender']);
                     $('#primary_languages').val(response.results['primary_languages']);
                     console.log("Entity type in response = "+response.entity_type);
                    _this.setState({voice: response.results, entity_type: response.entity_type});
        });
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
     * This method is used to edit changes of the unapproved clip
     * @params: These are the fields sent: transcript, actor, movie, tags, language, file
     * @return: status of the request  
    */
    handleSubmit: function() {
        var _this = this;
        this.setState({loading: true});

        var options = { 
            target:   '#output',
            beforeSubmit:  _this.beforeSubmit,// target element(s) to be updated with server response 
            url: config.ajax_url + '/dashboard_post_actor_movie_entity',
            success: function(response) { 
                alert(response['status']);
                _this.setState({loading: false});
                _this.props.close_modal();
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

    blur: function() {
        this.props.close_modal();
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
            height: 'auto',
            margin : '10px'
        }

        var inputFieldStyleActorMovie = {
            width: '600px',
            height: '30px',
            margin : '5px'
        }

        var submitStyle= {
            width: '100px',
            height: '30px',
            margin: '5px',
            padding: '5px'
        }

        var alertStyle = {
            display: 'none',
            width: '600px',
            margin: '15px',
            background: '#dff0d8',
            border: '1px solid #d6e9c6',
            height: '50px',
            color: 'white',
            lineHeight: '45px'
        }

         var approveStyle= {
            width: '100px',
            height: '30px',
            margin: '5px',
            padding: '5px',
            float: 'left'
        }

        var inputStyle = {
            width: '96%',
            height: '100%',
            lineHeight: '38px',
            paddingLeft: '10px',
            color: '#999',
            border: '1px solid #dcdcdc',
            fontFamily: 'Helvetica,Arial',
            fontSize: '12px',
            margin: '5px',
            boxShadow: '1px 1px 7px #dcdcdc'
        }

        var voiceStyle = {
            float: 'left', 
            marginLeft: '30px',
            display: 'block'
        }

        var topElementsStyle = {
            float: 'left',
            margin: '5px',
        }

        var highlightedItem = {
            color: 'white',
            background: 'hsl(200, 50%, 50%)',
            padding: '2px 6px',
            cursor: 'default'
        }
        var overlayStyle = {
            visibility: 'visible',
            position: 'fixed',
            left: '0px',
            top: '0px',
            width: '100%',
            height: '100%',
            zIndex: '1000',
            background: 'rgba(0, 0, 0, 0.8)',
        }

        var inputMovieFieldStyle = {
            float: 'left',
            width: '600px',
            height: 'auto',
            margin : '10px'
        }

        var modalStyle = {
            position: 'fixed',
            width: '900px',
            height: '600px',
            left: '50%',
            top: '50%',
            marginLeft: '-450px',
            marginTop: '-300px',
            backgroundColor: '#fff',
            border: '1px solid #000',
            padding: '15px',
            zIndex: '5000'
        }


        if(this.state.alert_message) {
            alertStyle['display'] = 'block'
        }

        if (this.state.voice['approval_status'] == 2 || this.state.voice['approval_status'] == 1) {
            approveStyle['display'] = 'none';
        }

        if (this.state.voice['type'] == 1) {
            voiceStyle['display'] = 'none'
        }

        if (this.state.loading){
            var loadingSpinner = <LoadingSpinner />
        }
        var gender = null, based_on_type = null, text = null;
        if (this.state.entity_type == "actor") {
            text = "Gender"
            based_on_type = <InputField id="gender" name="gender" placeholder={this.state.voice['gender']} />
        }
        if (this.state.entity_type == "movie") {
            text = "Full Name"
            based_on_type = <InputField id="full_name" name="full_name" placeholder={this.state.voice['full_name']} />
        }
        return (

            <div>
                <div onClick={this.blur} style={overlayStyle}></div>
                    <div style={modalStyle}>
                        <div style={{float: 'left'}} >
                            Update {this.state.entity_type}<hr/><br/> 
                            <form method="post" enctype="multipart/form-data" id="upload_form">
                                <div style={inputFieldStyle}>
                                    Key : {this.state.voice['key']}
                                </div>
                                <div style={inputFieldStyle}>
                                    Tags:
                                    <InputField id="tags" name="tags[]" placeholder="Tags" />
                                </div>
                                <div style={inputFieldStyle}>
                                    Display Name
                                    <InputField id="display_name" name="display_name" placeholder="Display Name" />
                                </div> 
                                <div style={inputFieldStyle}>
                                    Primary Languages
                                    <InputField id="primary_languages" name="primary_languages[]" placeholder="Primary Language" />
                                </div>
                                <div style={inputFieldStyle} >
                                    Poster(Mandatory)
                                    <InputField name="image_file" id="image_file" type="file" />
                                </div>
                                <input id="key" name="key" type="hidden" />
                                <div onClick={this.handleSubmit} style={submitStyle}>
                                    <RedButton  text = "Update" />
                                </div>
                                {loadingSpinner}
                            </form>
                        </div>

                        <div style={voiceStyle}>
                            <Clip data ={this.state.voice} />
                        </div>      
                    </div>
                <div id="output"></div>   
            </div>
        )
    }

});