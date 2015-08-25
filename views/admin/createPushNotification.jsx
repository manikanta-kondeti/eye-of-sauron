'use strict'

var React = require('react');
var Page = require('page');
var Datatable = require('../../components/Datatables');
var RedButton = require('../../components/RedButton');
var InputField = require('../../components/InputField');
var Clip = require('../../components/showClip');



var acceptedClip = React.createClass({

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
                <div style={acceptedClipStyle}>
                    <Clip data={this.props.data} />
                    <button style={rejectButtonStyle} onClick={this.handleOnClick}> X </button>
                </div>                           
            )

    }

});



module.exports = React.createClass({

    getInitialState: function(){
        return {voices: null, accepted_clips: [], prev_cursor: '', present_cursor: '', search_flag: false}
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

            $.get('https://web-og-tags-dot-the-tasty-samosa.appspot.com/create_push_notification', {'language': language} , function(response) {
                    
                console.log(response);

                _this.setState({voices: response.voices, accepted_clips: [], search_flag: false })

            });
        }

        else {

            var _this = this;


            console.log(_this.state.prev_cursor);
            console.log(_this.state.present_cursor);



            gapi.client.samosa.api.get_search_results({'tags': push_search }).execute(
            function(resp){             
                _this.setState({voices: resp.voices ,prev_cursor: _this.state.present_cursor , present_cursor: resp.cursor, search_flag: true})
            });
        }
    },


    getNextClips: function() {

            var push_search = $('#push_search').val();

            var _this = this;

            gapi.client.samosa.api.get_search_results({'tags': push_search, cursor: _this.state.present_cursor }).execute(
            function(resp){             
                _this.setState({voices: resp.voices ,prev_cursor: _this.state.present_cursor , present_cursor: resp.cursor})
            });

    },

    handlePushNotif: function() {

        var clip_keys = []

        var clips = this.state.accepted_clips;


        for(var i=0; i<clips.length; i++){
            clip_keys.push(clips[i]['key']);
        }

        console.log(clip_keys);

        Page('/admin/dashboard/get_push_notif_id/'+clip_keys)

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

        var selectBoxStyle={
            float: 'left',
            marginRight: '20px',
            marginTop: '10px'
        }

        var submitButtonStyle={
            float:'left', 
            width:'100px', 
            height: '30px',
            marginTop: '10px'
        }

        var inputFieldStyle = {
            float: 'left',
            marginRight: '30px'
        }

        var dataTableStyle = {
            float: 'left',
            background: 'white',
            border: '1px solid #e8e8e8',
            padding: '5px',
            width: '60%'
        }

        var acceptedClipsStyle = {
            float: 'right',
            background: 'white',
            height: 'auto',
            border: '1px solid #e8e8e8',
            padding: '10px',
            width: '35%'
        }

        var navigateButtonsStyle = {
            marginTop: '80px',
            display: 'none'
        }

        var pushButtonStyle = {
            float: 'right',
            width: '250px',
            height: '50px',
            marginTop: '10px'
        }

        var _this = this;

        var accepted_clips = this.state.accepted_clips.map(function(data, index) {
               return  <acceptedClip reject={_this.reject.bind(_this, data)} data={data} />
                    
        });

        if(this.state.search_flag) {
            navigateButtonsStyle['display'] = 'block'
        }
             
        return (
            
         <div style={RightSideBarStyle}> 
            
            <div>
                <div style={selectBoxStyle}>
            	   <select id="language">
  			           <option value="telugu">Telugu</option>
		      		   <option value="tamil">Tamil</option>
  			   	       <option value="malayalam">Malayalam</option>
			        </select>
                </div>
		  
                <div style={inputFieldStyle}> <InputField id="push_search" placeholder="search for clip" /></div>

        	    <div style={submitButtonStyle} onClick={this.handleOnClick}> <RedButton text = "SUBMIT"/> </div>
          
                <div style={pushButtonStyle} onClick={this.handlePushNotif}> <RedButton text = "CREATE PUSH NOTIFICATION"/> </div>
          
            </div>  
            
           

            <div style={{marginTop: '100px'}}>

                 <div style={navigateButtonsStyle}>
                    <button onClick={this.getNextClips}> Next </button>
                </div>


                <div style={dataTableStyle}>
                    <Datatable 
                        tags= {['transcript','listens','shares','poster_url','mp3_url']} 
                        actions={[{'name': 'Accept', 'function': this.accept}]} 
                        data = {this.state.voices} />
                </div>

                <div style={acceptedClipsStyle}> 
                        Accepted Clips <hr/>
                        {accepted_clips}   
                </div>
            </div>

         </div>

        )
    }
});