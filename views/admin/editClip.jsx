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
        return({alert_message: false, voice: [], movies: [], actors: [], loading: true})
    },

    componentDidMount: function() {
        var _this = this;
        gapi.client.samosa.api.get_expression_by_key({'id': this.props.params.key}).execute(
        function(resp){
                    $('#transcript').val(resp['transcript']);
                    $('#tags').val(resp['tags']);
                    $('#language').val(resp['language']);
                    $('#expression_key').val(resp['key']);
                    $('#actor_key').val(resp['actor_key']);
                    $('#movie_key').val(resp['movie_key']);
                    _this.setState({voice: resp, loading: false});
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

    handleSubmit: function() {
        var _this = this;
        this.setState({loading: true});
        var _this = this;
        var actor = $($(this.refs.actor.getDOMNode()).children()[0]).val();
        var movie = $($(this.refs.movie.getDOMNode()).children()[0]).val();
        $('#actor').val(actor);
        $('#movie').val(movie);
        var options = { 
            target:   '#output',
            beforeSubmit:  _this.beforeSubmit,// target element(s) to be updated with server response 
            url: config.ajax_url + '/dashboard_post_update_expression',
            success:    function(response) { 
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

        var inputMovieFieldStyle = {
            float: 'left',
            width: '600px',
            height: 'auto',
            margin : '10px'
        }

        var submitStyle= {
            width: '100px',
            height: '30px',
            margin: '15px'
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

        var actorMovieStyle = {
            float: 'left'
        }

        if(this.state.alert_message) {
            console.log('alert');
            alertStyle['display'] = 'block'
        }

        // Adding a loading toast 
        if (this.state.loading){
            var loadingSpinner = <LoadingSpinner />
        }

        return (

                <div style = {RightSideBarStyle}>
                    <div style={{float: 'left'}} >
                        EDIT CLIP <hr/><br/> 

                        <div id="alert_message" style={alertStyle}>
                                Clip has been updated !!! 
                        </div>
                        <form method="post" enctype="multipart/form-data" id="upload_form">
                                <div style={inputFieldStyle} >
                                    Transcript
                                    <InputField name="transcript" id="transcript" placeholder="Transcript" />
                                </div>
                                <div style={inputFieldStyle}>
                                    Tags
                                    <InputField name="tags[]" id="tags" placeholder="Tags" />
                                </div> 
                                <div style={inputFieldStyle}>
                                    Language
                                    <InputField name="language" id="language" placeholder="Language" />
                                </div> 
                                
                                <div style={inputFieldStyle} >
                                    Poster
                                    <InputField name="file" id="file" type="file" />
                                </div>
                                {loadingSpinner}
                                <div>
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
                                            )}
                                        />
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
                                            )}
                                        />
                                    </div>
                                </div>


                                <div style={inputFieldStyle} >
                                    <input name="expression_key" id="expression_key" type="hidden" />
                                </div>
                                <div style={inputFieldStyle} >
                                    <input name="actor" id="actor" type="hidden" />
                                </div>
                                <div style={inputFieldStyle} >
                                    <input name="movie" id="movie" type="hidden" />
                                </div>
                                <div onClick={this.handleSubmit} style={submitStyle}>
                                    <RedButton  text = "SUBMIT" />
                                </div>
  
                        </form> 
                        </div>
                        <div style={{float: 'left', marginLeft: '30px'}}>
                            <Clip data ={this.state.voice} />
                        </div>   
                        <div style={{ marginLeft: '30px'}}>
                            Actor:
                            <input name="actor_key" id="actor_key" />
                        </div>
                        <div style={{ marginLeft: '30px'}}>
                            Movie:
                            <input name="movie_key" id="movie_key" />
                        </div>    
                    <div id="output"></div>
                </div>
        )
    }

});