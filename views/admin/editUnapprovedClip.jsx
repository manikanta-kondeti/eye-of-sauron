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
        return({alert_message: false, voice: [], movies: [], actors: [], loading: false})
    },

    componentDidMount: function() {
        var _this = this;
        //Fetch ajax call
        $.get(config.ajax_url + '/dashboard_get_unapproved_clip',{expression_key: this.props.edit_key} ,function(response) { 
                  $('#transcript').val(response.voices['transcript']);
                    $('#tags').val(response.voices['tags']);
                    $('#language').val(response.voices['language']);
                    $('#expression_key').val(response.voices['key']);
                    _this.setState({voice: response.voices});
        });
    },

    /**
     * [handleKeyUpMovies fetchs movies suggestions to implement auto-complete]
     * @param  {[string]} value [the value of the input field onChange]
     * @return {[null]}       [sets state]
     */
    handleKeyUpMovies: function(value) {
        var _this = this;
        gapi.client.samosa.api.get_movie_suggestions({value: value}).execute(function(resp) {

            var values = resp['values'];

            var value_dict = values.map(function(value){
                return {'name': value}
            })

            _this.setState({movies: value_dict});
        });
    },

    /**
     * [handleKeyUpActors fetchs actors suggestions to implement auto-complete]
     * @param  {[string]} value [the value of the input field onChange]
     * @return {[null]}       [sets state]
     */
    handleKeyUpActors: function(value) {

        var _this = this;

        gapi.client.samosa.api.get_actor_suggestions({value: value}).execute(function(resp) {

            var values = resp['values'];

            var value_dict = values.map(function(value){
                return {'name': value}
            })

            _this.setState({actors: value_dict});
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
        var _this = this;
        var actor = $($(this.refs.actor.getDOMNode()).children()[0]).val();
        var movie = $($(this.refs.movie.getDOMNode()).children()[0]).val();
        $('#actor').val(actor);
        $('#movie').val(movie);
        var language = $('#language').val();

        var options = { 
            target:   '#output',
            beforeSubmit:  _this.beforeSubmit,// target element(s) to be updated with server response 
            url: config.ajax_url + '/dashboard_post_edited_unapproved_clip',
            success: function(response) { 
                alert(response['status']);
                _this.setState({loading: false});
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

    /**
     * [handleKeyUpTags fetchs tags suggestion to implement auto-complete]
     * @param  {[string]} value [the value of the input field onChange]
     * @return {[null]}       [sets state]
     */
    handleKeyUpTags: function(value) {
        var _this = this;
        gapi.client.samosa.api.get_autocomplete_search({value: value}).execute(function(resp) {

            var values = resp['values'];
 
            var value_dict = values.map(function(value) {
                return {'name': value}
            })


            _this.setState({tags: value_dict});
        });
    },


    /**
     * Aprrove function takes clicked voice object as input
    */
    approve: function() {
        var _this = this;
        this.setState({loading:true});
        var key = this.props.edit_key;
        $.ajax({
             type:    "POST",
             url:     config.ajax_url + "/dashboard_post_unapproved",
             data:    {"expression_key": key,"approval_status": 1 },
            success: function(data) {
                _this.setState({loading: false})
                _this.props.remove_clip(key);
                alert(data['status']);
                _this.props.close_modal();

            },
            // vvv---- This is the new bit
            error: function(jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
        $('#approve_button').hide();
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

        return (

            <div>
                <div onClick={this.blur} style={overlayStyle}></div>
                    <div style={modalStyle}>
                        <div style={{float: 'left'}} >
                                 EDIT CLIP <hr/><br/> 
                            <form method="post" enctype="multipart/form-data" id="upload_form">
                                <div style={inputFieldStyleActorMovie}>
                                    <div style={topElementsStyle}>
                                        Movies :
                                        <Autocomplete
                                            ref="movie"
                                            getItemValue={(item) => item.name}
                                            items={this.state.movies}
                                            onChange={(event, value) => {
                                                this.handleKeyUpMovies(value);
                                            }}
                                            renderItem={(item, isHighlighted) => (
                                                <div
                                                style={isHighlighted ? highlightedItem : item}
                                                >{item.name}</div>
                                            )} />
                                    </div>

                                    <div style={topElementsStyle}>
                                        Actors :
                                        <Autocomplete
                                            ref="actor"
                                            getItemValue={(item) => item.name}
                                            items={this.state.actors}
                                            onChange={(event, value) => {
                                                this.handleKeyUpActors(value);
                                            }}
                                            renderItem={(item, isHighlighted) => (
                                                <div
                                                style={isHighlighted ? highlightedItem : item}
                                                >{item.name}</div>
                                            )} />
                                    </div>
                                </div>

                                <div style={inputFieldStyle} >
                                    Transcript
                                    <InputField id="transcript" name="transcript" placeholder="Transcript" />
                                </div>
                                <div style={inputFieldStyle}>
                                    Tags
                                    <InputField id="tags" name="tags[]" placeholder="Tags" />
                                </div> 
                                <div style={inputFieldStyle}>
                                    Languages
                                    <select id="language_clip" name="language">
                                        <option value="telugu">telugu</option>
                                        <option value="tamil">tamil</option>
                                        <option value="hindi">hindi</option>
                                        <option value="global">global</option>
                                        <option value="kannada">kannada</option>
                                        <option value="malayalam">malayalam</option>
                                    </select>
                                </div>
                                <div style={inputFieldStyle} >
                                    Poster
                                    <InputField name="file" id="file" type="file" />
                                </div>
                                <div style={inputFieldStyle} >
                                    <input name="expression_key" id="expression_key" type="hidden" />
                                </div>
                                {loadingSpinner}
                                <div onClick={this.handleSubmit} style={submitStyle}>
                                    <RedButton  text = "SUBMIT" />
                                </div>
                               <div style={inputFieldStyle} >
                                    <input name="actor" id="actor" type="hidden" />
                                </div>
                                <div style={inputFieldStyle} >
                                    <input name="movie" id="movie" type="hidden" />
                                </div>
                            </form>

                            <div onClick={this.approve} id="approve_button"  name="approve_button" style={approveStyle}>
                                <RedButton  text = "APPROVE" />
                            </div>
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