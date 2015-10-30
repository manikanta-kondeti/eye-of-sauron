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
        console.log(this.props);
        //Fetch ajax call
        $.get(config.ajax_url + '/dashboard_get_unapproved_clip',{expression_key: this.props.edit_key} ,function(response) { 
                  $('#transcript').val(response.voices['transcript']);
                    $('#tags').val(response.voices['tags']);
                    $('#language').val(response.voices['language']);
                    _this.setState({voice: response.voices});
        });
    },

     handleSubmit: function() {
        var transcript = $('#transcript').val();
        var caption = transcript.split(' ').join('-');
        var tags = $('#tags').val().split(',');
        var language = $('#language').val();
        var _this = this;
        //Updating ajax call
         $.ajax({
             type:    "POST",
             url:     config.ajax_url + "/dashboard_post_edited_unapproved_clip",
             data:    {"expression_key": this.props.edit_key, "transcript": transcript, "caption": caption, "tags": tags, "language": language },
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
        var key = this.props.edit_key;
        $.ajax({
             type:    "POST",
             url:     config.ajax_url + "/dashboard_post_unapproved",
             data:    {"expression_key": key,"approval_status": 1 },
            success: function(data) {
                 _this.props.remove_clip(key);
                 alert(data['status']);
                _this.props.close_modal();

            },
            // vvv---- This is the new bit
            error: function(jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
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

        console.log(this.props.edit_key);

        return (

            <div>
                <div onClick={this.blur} style={overlayStyle}></div>
                    <div style={modalStyle}>
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
                                <select id="language">
                                    <option value="telugu">telugu</option>
                                    <option value="tamil">tamil</option>
                                    <option value="hindi">hindi</option>
                                    <option value="global">global</option>
                                    <option value="kannada">kannada</option>
                                    <option value="malayalam">malayalam</option>
                                </select>
                                
                            </div>
                   
                            <div onClick={this.handleSubmit} style={submitStyle}>
                                <RedButton  text = "SUBMIT" />
                            </div>

                            <div onClick={this.approve} style={approveStyle}>
                                <RedButton  text = "APPROVE" />
                            </div>

                        </div>

                        <div style={voiceStyle}>
                            <Clip data ={this.state.voice} />
                        </div>      
                    </div>
            </div>
        )
    }

});