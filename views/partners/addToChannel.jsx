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

    componentDidMount: function() {
        var _this = this;
        $.get(config.ajax_url + '/dashboard_get_user_owned_channels' ,function(response) { 
            // List of channels
            var channels = response['channels'];
            var channels_length = response['channels_length'];
            var select = document.getElementById('select_channel');
            for(var i=0; i<channels_length; i++) {
                    var opt = document.createElement('option');
                    opt.value = channels[i].id;
                    opt.innerHTML = channels[i].name;
                    select.appendChild(opt);
            }
        }); 
 
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


    /**
     * This method handles validation(empty checks) before it submits the form
     */
    validation: function() {
        // Accepted clips should be more than 0
        if (this.state.accepted_clips.length == 0) {
            alert('Select clips to be added');
            return
        } 
        var channel_id = document.getElementById('select_channel').value;
        if (channel_id == "None") {
            alert('Channel id is empty, please select a channel id');
            return
        }
        this.handleChannel();
    },

    handleOnClick: function() {
        var _this = this;
        var push_search = $('#push_search').val();

        if(!push_search) {
    	
            var language = $('#language').val();

            $.get(config.ajax_url + '/push/create_push_notification', {'language': language} , function(response) {

                _this.setState({voices: response.voices, accepted_clips: [], search_flag: false })

            });
        }

        else {

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
        var _this = this;
        var clips = this.state.accepted_clips;
        var channel_id = $('#select_channel').val();

        for(var i=0; i<clips.length; i++){
            clip_keys.push(clips[i]['key']);
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
                _this.setState({voices: null, accepted_clips: [], prev_cursor: '', present_cursor: '', search_flag: false, loading: false});
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
            width: '250px',
            marginRight: '30px'
        }

        var inputChannelFieldStyle = {
            position: 'relative',
            width: '60px',
            padding: '10px',
            height: 'auto',
            margin : '10px'
        }

        var inputStyle = {
            margin: '130px',
            height: '25px'
        }

        var dataTableStyle = {
            background: 'white',
            border: '1px solid #e8e8e8',
            padding: '10px',
            width: '100%'
        }

        var submitButtonStyle={
            float:'left', 
            width:'150px', 
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
            margin: '12px',
            padding: '10px',
            textAlign: 'center'
        }

        var addToChannelStyle = {
            margin: '12px',
            padding: '10px',
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
                <h3 style={titleStyle}>Add to channel</h3>
                <hr/>
                <div style={inputChannelFieldStyle}>
                    Channel :
                    <select id="select_channel" name="channel_id">
                           // This gets populated in this.componentDidUpdate()
                           <option value="None"> </option>
                    </select>
                </div>
            </div>
            <div style = {addToChannelStyle}>
                <div style={inputFieldStyle}> <InputField id="push_search" placeholder="search for clip" /></div>
        	    <div style={submitButtonStyle} onClick={this.handleOnClick}> <BlueButton text = "Get Search Results"/> </div>
                <div style={pushButtonStyle} onClick={this.validation}> <RedButton text = "ADD TO CHANNEL"/> </div>
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
         </div>

        )
    }
});