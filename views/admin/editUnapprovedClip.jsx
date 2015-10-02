/** @jsx React.DOM */

'use strict'

var React = require('react')
var InputField = require('../../components/InputField');
var RedButton = require('../../components/RedButton');
var Clip = require('../../components/showClip');
var config = require('../../config');



module.exports = React.createClass({

    getInitialState: function() {
        return({alert_message: false, voice: []})
    },

    componentDidMount: function() {
        var _this = this;
        //Fetch ajax call
        console.log('Component did mount')
        $.get(config.ajax_url + '/dashboard_get_unapproved_clip',{expression_key: this.props.params.key} ,function(response) { 
                  $('#transcript').val(response.voices['transcript']);
                    $('#tags').val(response.voices['tags']);
                    $('#languages').val(response.voices['language']);
                    _this.setState({voice: response.voices});
        });
    },

    handleSubmit: function() {
        var transcript = $('#transcript').val();
        var caption = transcript.split(' ').join('-');
        var tags = $('#tags').val().split(',');
        var languages = $('#languages').val().split(',');
        var _this = this;

        console.log(tags);
        //Updating ajax call

         $.ajax({
             type:    "POST",
             url:     config.ajax_url + "/dashboard_post_edited_unapproved_clip",
             data:    {"expression_key": this.props.params.key, "transcript":transcript, "caption": caption, "tags": tags, "languages": languages },
            success: function(data) {
                 alert(data['status']);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });

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
            height: 'auto',
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
            lineHeight: '45px'
        }

        if(this.state.alert_message) {
            console.log('alert');
            alertStyle['display'] = 'block'
        }

        return (

                <div style = {RightSideBarStyle}>
                    <div style={{float: 'left'}} >
                        EDIT CLIP <hr/><br/> 

                        <div id="alert_message" style={alertStyle}>
                                Clip has been updated !!! 
                        </div>

                        <div style={inputFieldStyle} >
                            Transcript
                            <InputField id="transcript" placeholder="Transcript" />
                        </div>
                        <div style={inputFieldStyle}>
                            Tags
                            <InputField id="tags" placeholder="Tags" />
                        </div> 
                        <div style={inputFieldStyle}>
                            Languages
                            <InputField id="languages" placeholder="Languages" />
                        </div> 
                        <div onClick={this.handleSubmit} style={submitStyle}>
                            <RedButton  text = "SUBMIT" />
                        </div>
                    </div>

                    <div style={{float: 'left', marginLeft: '30px'}}>
                        <Clip data ={this.state.voice} />
                    </div>                        
                </div>
        )
    }

});