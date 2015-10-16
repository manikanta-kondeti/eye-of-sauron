/** @jsx React.DOM */

'use strict'

var React = require('react')
var InputField = require('../../components/InputField');
var RedButton = require('../../components/RedButton');
var Clip = require('../../components/showClip');



module.exports = React.createClass({

    getInitialState: function() {
        return({alert_message: false, voice: []})
    },

    componentDidMount: function() {
        var _this = this;
        gapi.client.samosa.api.get_expression_by_key({'id': this.props.params.key}).execute(
        function(resp){
                    $('#transcript').val(resp['transcript']);
                    $('#tags').val(resp['tags']);
                    _this.setState({voice: resp});
        });
    },

    handleSubmit: function() {
        var transcript = $('#transcript').val();
        var caption = transcript.split(' ').join('-');
        var tags = $('#tags').val().split(',');
        var _this = this;

        console.log(tags);

        gapi.client.samosa.api.update_expression({
                                                    'id': this.props.params.key,
                                                    'transcript': transcript,
                                                    'caption': caption,
                                                    'tags': tags
                                            }).execute(
                                                function(resp) {
                                                    _this.setState({alert_message: true});
                                                
                                            })
          
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