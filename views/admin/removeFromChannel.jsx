'use strict'

var React = require('react');
var Page = require('page');
var Datatable = require('../../components/Datatables');
var RedButton = require('../../components/RedButton');
var BlueButton = require('../../components/BlueButton');
var InputField = require('../../components/InputField');
var Clip = require('../../components/showClip');
var config = require('../../config');
var LoadingSpinner = require('./../../components/LoadingSpinner');

var AcceptedClip = React.createClass({

    handleOnClick: function() {
        this.props.reject();
    },

    render: function() {

        var acceptedClipStyle = {
            float: 'left'
        }

        var rejectButtonStyle = {
            marginLeft:'-8px',
            cursor: 'pointer'
        }

        return(
                <div id="acceptedClip" style={acceptedClipStyle}>
                    <Clip data={this.props.data} />
                    <button style={rejectButtonStyle} onClick={this.handleOnClick}> X </button>
                </div>                           
            )

    }

});



module.exports = React.createClass({

    getInitialState: function(){
        return {voices: null, accepted_clips: [], prev_cursor: '', present_cursor: '', search_flag: false, loading: false}
    },

    accept: function(object) {

        var state_voices = this.state.voices;

        var new_state_voices = [];
        var accepted_clip;

        for(var i=0; i< state_voices.length; i++) {

            if(state_voices[i]['key'] != object['key']){
                new_state_voices.push(state_voices[i]);
            }
            else{
                accepted_clip = state_voices[i];
            }
        }

        this.setState({voices: new_state_voices, accepted_clips: this.state.accepted_clips.concat(accepted_clip) });
    },

    reject: function(object) {

        var accepted_clips = this.state.accepted_clips;

        var new_accepted_clips = [];

        for(var i=0; i< accepted_clips.length; i++) {

            if(accepted_clips[i]['key'] != object['key']){
                new_accepted_clips.push(accepted_clips[i]);
            }
        }

        this.setState({accepted_clips: new_accepted_clips });
        
    }, 

    handleOnClick: function() {
        /**
         * Get expressions from that particular channel 
         * Channel_id
         */
        this.setState({loading: true});
        var channel_id = $('#channel_id').val();
        var _this = this;
        gapi.client.samosa.api.get_expressions_in_channel({'channel_id': channel_id }).execute(
        function(resp){  
            _this.setState({loading: false});           
            _this.setState({voices: resp.voices ,prev_cursor: _this.state.present_cursor , present_cursor: resp.cursor, search_flag: true})
        });
    },


    getNextClips: function() {

        var channel_id = $('#channel_id').val();

        var _this = this;
        this.setState({loading: true});
        gapi.client.samosa.api.get_expressions_in_channel({'channel_id': channel_id, cursor: _this.state.present_cursor }).execute(
        function(resp){     
            _this.setState({loading: false});        
            _this.setState({voices: resp.voices ,prev_cursor: _this.state.present_cursor , present_cursor: resp.cursor})
        });

    },

    handleChannel: function() {

        var clip_keys = []

        var clips = this.state.accepted_clips;
        var channel_id = $('#channel_id').val();

        for(var i=0; i<clips.length; i++){
            clip_keys.push(clips[i]['key']);
        }
        console.log("Channel id is " + channel_id + "clip_keys = " + clip_keys);
        console.log(typeof(channel_id));
        if (channel_id == "" || clip_keys == ""){
            alert('Channel ID is Empty or no accepted_clips');
            return
        }

        /**
         * TODO: Ajax, post params and success message
         */
        this.setState({loading: true});
        $.ajax({
             type:    "POST",
             url:     config.ajax_url + "/dashboard_post_remove_from_channels",
             data:    {"channel_id": channel_id,"expression_list": clip_keys },
            success: function(data) {
                _this.setState({loading: false});
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
            marginLeft: '240px',
            top: '60px',
            bottom: '0px',
            display: 'block',
            padding: '9px',
            width: '83%'
        }

        var selectBoxStyle={
            float: 'left',
            marginRight: '20px',
            marginTop: '10px'
        }

        var submitButtonStyle={
            float:'left', 
            width:'140px', 
            height: '30px',
            marginTop: '10px'
        }

        var inputFieldStyle = {
            float: 'left',
            width: '145px',
            lineHeight: '38px',
            paddingLeft: '10px',
            color: '#999',
            border: '1px solid #dcdcdc',
            fontFamily: 'Helvetica,Arial',
            fontSize: '12px',
            margin: '5px',
            boxShadow: '1px 1px 7px #121E33'
        }

        var inputChannelFieldStyle = {
            position: 'absolute',
            marginLeft: '40%',
            width: '20px',
            padding: '20px',
            height: 'auto'
        }

        var dataTableStyle = {
            background: 'white',
            border: '1px solid #e8e8e8',
            padding: '10px',
            width: '100%'
        }

        var acceptedClipsStyle = {
            display: 'none',
            background: 'white',
            marginTop: '100px',
            height: 'auto',
            border: '1px solid #e8e8e8',
            padding: '10px',
            width: '100%',
            overflow: 'auto'
        }

        var navigateButtonsStyle = {
            marginTop: '80px',
            display: 'none'
        }

        var pushButtonStyle = {
            float: 'right',
            width: '200px',
            height: '30px',
            marginTop: '10px'
        }

        var titleStyle = {
            textAlign: 'center'
        }

        var _this = this;

        var accepted_clips = this.state.accepted_clips.map(function(data, index) {
               return  <AcceptedClip reject={_this.reject.bind(_this, data)} data={data} />
                    
        });

        if(this.state.search_flag) {
            navigateButtonsStyle['display'] = 'block'
        }

        if(this.state.accepted_clips.length != 0) {
            acceptedClipsStyle['display'] = 'block';
        }
        var voices_length = 0; 
        if (this.state.voices != null) {
            voices_length = this.state.voices.length
        }

        // Adding a loading toast 
        if (this.state.loading){
            var loadingSpinner = <LoadingSpinner />
        }
        return (
            
         <div style={RightSideBarStyle}> 
            <div>
                <h3 style={titleStyle}>Remove From channel(Please write a valid channel id)</h3>
            </div>

            <div>
                <div style={selectBoxStyle}>
            	   <select id="language">
                       <option value="global">Global</option>
  			           <option value="telugu">Telugu</option>
		      		   <option value="tamil">Tamil</option>
                       <option value="hindi">Hindi</option>
                       <option value="kannada">Kannada</option>
  			   	       <option value="malayalam">Malayalam</option>
			        </select>
                </div>
                <div style={inputFieldStyle}> <input type="textbox" id="channel_id" placeholder="Write a valid channel id" name="channel_id"  /></div>
        	    <div style={submitButtonStyle} onClick={this.handleOnClick}> <BlueButton text = "GetChannelExpressions"/> </div>
                <div style={pushButtonStyle} onClick={this.handleChannel}> <RedButton text = "REMOVE FROM CHANNEL"/> </div>
            </div>  
            
            <div id="acceptedClipsDiv" style={acceptedClipsStyle}> 
                        Clips that should be Removed<hr/>
                        {accepted_clips}   
            </div>
           

            <div style={{marginTop: '100px'}}>
                 <div style={navigateButtonsStyle}>
                    <button onClick={this.getNextClips}> Next </button>
                </div>

                <div style={dataTableStyle}>
                    <p> Total clips on this page: <b>{voices_length}</b></p>
                    <p> Total removable clips: <b>{this.state.accepted_clips.length}</b></p>
                    {loadingSpinner}
                    <Datatable 
                        tags= {['transcript','poster_url','listens','shares','mp3_url']} 
                        actions={[{'name': 'Remove', 'function': this.accept}]} 
                        data = {this.state.voices} />
                </div>

            </div>

         </div>

        )
    }
});

