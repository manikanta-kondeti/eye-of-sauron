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
     * This method is used to edit changes of the unapproved clip
     * @params: These are the six fields sent: languages, primary_language, actor_unique_id, movie_id, display_name, gender
     * @return: status of the request  
    */
    handleSubmitActor: function() {
        var _this = this;
        this.setState({loading: true});

        var options = { 
            target:   '#output',
            beforeSubmit:  _this.beforeSubmit,// target element(s) to be updated with server response 
            url: config.ajax_url + '/dashboard_post_add_new_actor',
            success: function(response) { 
                alert(response['status']);
                _this.setState({loading: false});
            }, 
            error: function(response) {
                $('#alert_message').html(' Notification text is not a localised unicode string. Localise the push notification text.');
            }
        }; 
        
        $('#upload_form_of_actor').submit(function(e) { 
            $(this).ajaxSubmit(options);  //Ajax Submit form    
            return false;
        });           
    },


    /**
     * This method is used to add new movie entity 
     * @params: These are the six fields sent: languages, movie_unique_id, movie_id, display_name, gender, movie_image_file
     * @return: status of the request  
    */
    handleSubmitMovie: function() {
        var _this = this;
        this.setState({loading: true});

        var options = { 
            target:   '#output',
            beforeSubmit:  _this.beforeSubmit,// target element(s) to be updated with server response 
            url: config.ajax_url + '/dashboard_post_add_new_movie',
            success: function(response) { 
                alert(response['status']);
                _this.setState({loading: false});
            }, 
            error: function(response) {
                $('#alert_message').html(' Notification text is not a localised unicode string. Localise the push notification text.');
            }
        }; 
        
        $('#upload_form_of_movie').submit(function(e) { 
            $(this).ajaxSubmit(options);  //Ajax Submit form    
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

        var inputFieldStyle = {
            width: '600px',
            height: '36px',
            margin : '10px'
        }

        var submitStyle= {
            width: '100px',
            height: '30px',
            margin: '30px'
        }

        // Adding a loading toast 
        if (this.state.loading){
            var loadingSpinner = <LoadingSpinner />
        }

		return(
			<div style = {RightSideBarStyle}>
				Add a New Actor Entity <hr/>
                    <form method="post" enctype="multipart/form-data" id="upload_form_of_actor">
    					<div style={inputFieldStyle}>
                             <InputField id="actor_unique_id_actor" name="actor_unique_id" placeholder="Actor Unique ID  Eg: pawan_kalyan, mahesh_babu, salman_khan" />
                        </div>
                        <div style={inputFieldStyle}>
                            <InputField id="display_name_actor" name="display_name" placeholder="Display Name" />
                        </div> 
                        <div style={inputFieldStyle}>
                             <InputField id="gender_actor" name="gender" placeholder="Gender male/female" />
                        </div>
                        <div style={inputFieldStyle}>
                             <InputField id="primary_language_actor" name="primary_language" placeholder="Primary Language" />
                        </div>
                        <div style={inputFieldStyle}>
                             <InputField id="languages_actor" name="languages[]" placeholder="Coma separated languages eg: telugu,hindi,tamil,bengali" />
                        </div>
                        <div style={inputFieldStyle}>
                             <InputField id="movie_unique_id_actor"  name="movie_unique_id" placeholder="Movie Unique ID: atleast one movie of the actor, this should be in Datastore" />
                        </div>
                        <div style={inputFieldStyle} >
                            Actor Poster(Mandatory)
                            <InputField name="actor_image_file" id="actor_image_file" type="file" />
                        </div>
                        <div onClick={this.handleSubmitActor} style={submitStyle}>
                            <RedButton  text = "CreateActor" />
                        </div>
                        {loadingSpinner}
                    </form>

                Add a New Movie Entity <hr/>
                    <form method="post" enctype="multipart/form-data" id="upload_form_of_movie">
                    	<div style={inputFieldStyle}>
                             <InputField id="movie_unique_id_movie" name="movie_unique_id" placeholder="Movie Unique ID   Eg:  jalsa_2008, temper_2015, dookudu_2011" />
                        </div>
                        <div style={inputFieldStyle}>
                             <InputField id="year_movie" name="year" placeholder="Year" />
                        </div>
    					<div style={inputFieldStyle} >
                            <InputField id="full_name_movie" name="full_name" placeholder="Full Name" />
                        </div>
                        <div style={inputFieldStyle}>
                            <InputField id="display_name_movie" name="display_name" placeholder="Display Name" />
                        </div> 
                        <div style={inputFieldStyle}>
                             <InputField id="languages_movie" name="languages[]" placeholder="Coma separated languages eg: telugu,hindi,tamil,bengali" />
                        </div>
                         <div style={inputFieldStyle} >
                            Movie Poster(Mandatory)
                            <InputField name="movie_image_file" id="movie_image_file" type="file" />
                        </div>
                         <div onClick={this.handleSubmitMovie} style={submitStyle}>
                            <RedButton  text = "CreateMovie" />
                        </div>
                        {loadingSpinner}   
                    </form>
			    <div id="output"></div>
            </div>
		)
	}
})