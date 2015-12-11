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

        var push_search = $('#push_search').val();

        if(!push_search) {
    	
            var language = $('#language').val();

            var _this = this;

            $.get(config.ajax_url + '/push/create_push_notification', {'language': language} , function(response) {

                _this.setState({voices: response.voices, accepted_clips: [], search_flag: false })

            });
        }

        else {

            var _this = this;

            gapi.client.samosa.api.get_search_results({'tags': push_search }).execute(
            function(resp){             
                _this.setState({voices: resp.voices ,prev_cursor: _this.state.present_cursor , present_cursor: resp.cursor, search_flag: true})
            });
        }
    },


    getNextClips: function() {

            var push_search = $('#push_search').val();

            var _this = this;
            _this.setState({loading: true});
            gapi.client.samosa.api.get_search_results({'tags': push_search, cursor: _this.state.present_cursor }).execute(
            function(resp){    
                _this.setState({loading: false});         
                _this.setState({voices: resp.voices ,prev_cursor: _this.state.present_cursor , present_cursor: resp.cursor})
            });
    },


    /** [handleNewActor: Need to pass a few params and add this in movie entity]
    *   @return {[status][description]} 
    */
    handleNewChannel: function(){
        console.log("handleNewChannel");
        Page('/admin/dashboard/add_new_channel')
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
             url:     config.ajax_url + "/dashboard_post_add_to_channel",
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
            width:'112px', 
            height: '30px',
            marginTop: '10px'
        }

        var inputFieldStyle = {
            float: 'left',
            marginRight: '30px'
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

        var submitButtonStyle={
            float:'left', 
            width:'100px', 
            height: '30px',
            marginTop: '10px'
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
          
        // Adding a loading toast 
        if (this.state.loading){
            var loadingSpinner = <LoadingSpinner />
        }   
        return (
            
         <div style={RightSideBarStyle}> 
            <div>
                <h3 style={titleStyle}>Add to channel(Please write a valid channel id)</h3>
                <div style={inputChannelFieldStyle}>
                  Channel:
                  <input type="textbox" id="channel_id" placeholder="Write a valid channel id" name="channel_id"  />
                </div>
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
                <div style={inputFieldStyle}> <InputField id="push_search" placeholder="search for clip" /></div>
        	    <div style={submitButtonStyle} onClick={this.handleOnClick}> <BlueButton text = "GetSearchResults"/> </div>
                <div style={pushButtonStyle} onClick={this.handleChannel}> <RedButton text = "ADD TO CHANNEL"/> </div>
            </div>  
            
            <div id="acceptedClipsDiv" style={acceptedClipsStyle}> 
                        Accepted Clips <hr/>
                        {accepted_clips}   
            </div>
           

            <div style={{marginTop: '100px'}}>
                 <div style={navigateButtonsStyle}>
                    <button onClick={this.getNextClips}> Next </button>
                </div>

                <div style={dataTableStyle}>
                    <p> Total accepted clips: <b>{this.state.accepted_clips.length}</b></p>
                    {loadingSpinner}
                    <Datatable 
                        tags= {['transcript','poster_url','listens','shares','mp3_url']} 
                        actions={[{'name': 'Accept', 'function': this.accept}]} 
                        data = {this.state.voices} />
                </div>

            </div>
            <div style={submitButtonStyle} onClick={this.handleNewChannel}>
              <RedButton text="Create New Channel" />
            </div>
         </div>

        )
    }
});
