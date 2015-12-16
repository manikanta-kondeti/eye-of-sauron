'use strict'

var React = require('react');
var Page = require('page');
var Datatable = require('../../components/Datatables');
var RedButton = require('../../components/RedButton');
var InputField = require('../../components/InputField');
var Clip = require('../../components/showClip');
var config = require('../../config');


module.exports = React.createClass({

    getInitialState: function(){
        return {voices: null, cursor: '', accepted_clips: [], prev_cursor: '', present_cursor: '', search_flag: false, loading: false}
    },

    componentDidMount: function() {
        // Get auth key
        var _this = this;
        $.get(config.ajax_url + '/dashboard_get_user_owned_channels' ,function(response) { 
            // List of channels
            var channels = response['channels'];
            var channels_length = response['channels_length'];
            var select = document.getElementById('channel_id');
            for(var i=0; i<channels_length; i++) {
                    var opt = document.createElement('option');
                    opt.value = channels[i].key;
                    opt.innerHTML = channels[i].name;
                    select.appendChild(opt);
            }
        }); 
 
    },

    editClip: function(object) {
        var key = object['key'];
        var url_path = window.location. pathname;
        var url = url_path.split('/');
        // To use the same url for both admin and partners dashboard
        if (url[1] == "admin") {
            Page('/admin/dashboard/edit_clip/'+key);
        }
       else if (url[1] == "partners") {
            Page('/partners/dashboard/edit_clip/'+key);
        }
    },



    handleOnClick: function() {
        /**
         * TODO:
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
            var search_value = $('#search').val();
            var _this = this;
            if(search_value != "") {
                gapi.client.samosa.api.get_expressions_in_channel({'channel_id': channel_id, 'cursor': _this.state.cursor}).execute(
                function(resp){  
                    _this.setState({loading: false});           
                    _this.setState({voices: resp.voices ,prev_cursor: _this.state.present_cursor , present_cursor: resp.cursor, search_flag: true})
                });
            }
            else {
                gapi.client.samosa.api.get_expressions_in_channel({'channel_id': channel_id, 'cursor': _this.state.cursor}).execute(
                function(resp){  
                    _this.setState({loading: false});           
                    _this.setState({voices: resp.voices ,prev_cursor: _this.state.present_cursor , present_cursor: resp.cursor, search_flag: true})
                });
            }
    },

    getPrevClips: function() {

    },
    
    render: function() {

        console.log(this.state.voices);

        var RightSideBarStyle = {
            position: 'absolute',
            marginLeft: '240px',
            top: '60px',
            bottom: '0px',
            display: 'block',
            padding: '9px',
            width: '83%'
        }

        var submitButtonStyle={
            float:'left', 
            width:'100px', 
            height: '40px',
            marginTop: '6px'
        }

        var inputChannelFieldStyle = {
            position: 'relative',
            width: '60px',
            padding: '10px',
            height: 'auto',
            margin : '10px'
        }

        var inputFieldStyle = {
            float: 'left',
            marginRight: '30px',
            width: '500px'
        }

        var dataTableStyle = {
            float: 'left',
            background: 'white',
            border: '1px solid #e8e8e8',
            padding: '5px',
            width: '100%'
        }

        var navigateButtonsStyle = {
            marginTop: '80px'
        }

        var pushButtonStyle = {
            float: 'right',
            width: '250px',
            height: '50px',
            marginTop: '10px'
        }

        return (
            
         <div style={RightSideBarStyle}> 
            
            <div>
		  
                <div style={inputChannelFieldStyle}>
                    Channel :
                    <select id="channel_id" name="channel_id">
                           // This gets populated in this.componentDidUpdate()
                           <option value="None"> </option>
                    </select>
                </div>

        	    <div style={submitButtonStyle} onClick={this.handleOnClick}> <RedButton text = "Get Channel Expressions"/> </div>
          
            </div>  
            
           
            <div style={{marginTop: '100px'}}>

                <div style={navigateButtonsStyle}>
                    <button onClick={this.getNextClips}> Next </button>
                </div>

                <div style={dataTableStyle}>
                    <Datatable 
                        tags= {['transcript','poster_url','actor_key','movie_key','listens','shares','mp3_url']} 
                        actions={[{'name': 'Edit', 'function': this.editClip}]} 
                        data = {this.state.voices} />
                </div>

            </div>
         </div>

        )
    }
});
