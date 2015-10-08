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
        var languages = $('#languages').val();
        var _this = this;
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


    /**
     * Aprrove function takes clicked voice object as input
    */
    approve: function() {
        var _this = this;
        var object = _this.state.voice;
        var key = object['key'];
        $.ajax({
             type:    "POST",
             url:     config.ajax_url + "/dashboard_post_unapproved",
             data:    {"expression_key": key,"approval_status": 1 },
            success: function(data) {
                 alert(data['status']);
            },
            // vvv---- This is the new bit
            error: function(jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
    },

    reject: function() {
        var _this = this;
        var object = _this.state.voice;
        var key = object['key'];
  
        $.ajax({
             type:    "POST",
             url:     config.ajax_url + "/dashboard_post_unapproved",
             data:    {"expression_key": key,"approval_status": 2 },
            success: function(data) {

                alert(data['status']);
            },
            // vvv---- This is the new bit
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

         var approveStyle= {
            width: '100px',
            height: '30px',
            margin: '15px',
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
        if(this.state.alert_message) {
            alertStyle['display'] = 'block'
        }

        if (this.state.voice['approval_status'] == 2 || this.state.voice['approval_status'] == 1){
            approveStyle['display'] = 'none';
        }

        if (this.state.voice['type'] == 1){
            voiceStyle['display'] = 'none'
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

                        <div onClick={this.approve} style={approveStyle}>
                            <RedButton  text = "APPROVE" />
                        </div>

                        <div onClick={this.reject} style={approveStyle}>
                            <RedButton  text = "REJECT" />
                        </div>

                    </div>

                    <div style={voiceStyle}>
                        <Clip data ={this.state.voice} />
                    </div>                        
                </div>
        )
    }

});