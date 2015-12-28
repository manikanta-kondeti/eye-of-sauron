'use strict'

var react = require('react');
var Page = require('page');
var RedButton = require('../../components/RedButton');
var InputField = require('../../components/InputField');
var config = require('../../config');
var LoadingSpinner = require('./../../components/LoadingSpinner');
var Datatable = require('../../components/Datatables');
var Clip = require('../../components/showClip');

module.exports = React.createClass({
	getInitialState : function() {
		return {channels_in_group : [],  channels_in_search : [], cursor_for_group_query: null, accepted_clips : [], removed_clips : [], loading : true, cursor_for_search_query : null}
	},

	componentDidMount : function() {
		var _this = this;
		this.setState({loading: false});
		this.getChannelByGroup();
        gapi.client.samosa.api.get_search_results({'type_filters' : 11}).execute(
        	function(response) {
        		_this.setState({channels_in_search: response.channels, cursor_for_search_query: response.cursor});
        });
	},

	getBySearchInput: function(event) {
		var _this = this;
		console.log("getBySearchInput = " + event.keyCode);
		if (event.which == 13 || event.keyCode == 13) {
	        //Search channels based on input
	        _this.setState({loading: true});
	        var search_input = document.getElementById('search_input').value;
	        console.log(search_input);
	        gapi.client.samosa.api.get_search_results({'type_filters' : 11, 'tags' : [search_input] }).execute(
	        	function(response) {
	        		_this.setState({loading: false, channels_in_search: response.channels, cursor_for_search_query: response.cursor});
	        });
	        return false;
	    }
	},

	getChannelByGroup: function() {
	   /**
		*  Get channels based on a group id
		*	Logic: Get id from dropdown list and sending a post request
	   **/
		var _this = this;
		this.setState({loading: true, channels_in_group: [], accepted_clips: [], removed_clips: []});
		var group_id = document.getElementById('channel_group').value;
		gapi.client.samosa.api.get_channels_by_type({'channel_group_type' : group_id}).execute(
      		function(response) {
      			_this.setState({loading: false, channels_in_group : response.channels, cursor_for_group_query : response.cursor });
        });

	},

	/**
	 * These two methods handles addition and removal of channels into/from groups.
	 **/
 	addIntoChannel: function(object) {
 		// Logic: Get the channel key and add put it into accepted_clips
 		console.log("Add to channel clicked");
        var state_channels = this.state.channels_in_search;

        var new_state_channels = [];
        var new_state_channels_in_group = [];
        var accepted_clip;

        if (this.state.channels_in_group) {
            new_state_channels_in_group = this.state.channels_in_group.reverse();
        }
        for(var i = 0; i < state_channels.length; i++) {

            if(state_channels[i]['key'] != object['key']){
                new_state_channels.push(state_channels[i]);
            }
            else{
                accepted_clip = state_channels[i];
            }
        }
        new_state_channels_in_group.push(accepted_clip);
        new_state_channels_in_group.reverse();
        this.setState({channels_in_group:new_state_channels_in_group, channels_in_search: new_state_channels, accepted_clips: this.state.accepted_clips.concat(accepted_clip) });
 	},

 	removeFromChannel: function(object) {
 		// Logic: Get the channel keys and put it into removed_clips from a group
 		// We have to check if it is in accepted clip then remove from accepted clip and also new channels in group array, else add it in group.
 		var old_channels_in_group = this.state.channels_in_group;
 		var removed_clip = null;
 		var new_channels_in_group = [];
 		var new_accepted_clips = [];
 		var new_removed_clips = this.state.removed_clips;
 		var new_channels_in_search = this.state.channels_in_search.reverse();

 		//Check in accepted clip first
 		for (var i=0; i<this.state.accepted_clips.length; i++) {
 			if (object['key'] == this.state.accepted_clips[i]['key']) {
 				removed_clip = object;
 				new_channels_in_search.push(object);
 			}
 			else {
 				new_accepted_clips.push(this.state.accepted_clips[i]);
 			}
 		}

 		if (removed_clip == null) {
 			new_removed_clips.push(object);
 		}

 		for(var i=0; i<old_channels_in_group.length; i++) {
 			//Check if object['key'] == old_channels_in_group['key']
 			if(object['key'] != old_channels_in_group[i]['key']) {
 				new_channels_in_group.push(old_channels_in_group[i]);
 			}
 			else {
 				removed_clip = object;
 			}
 		}
 		new_channels_in_search.reverse();
 		console.log("New removed clips = " + new_removed_clips);
 		// Set new state 
 		this.setState({channels_in_group:new_channels_in_group, channels_in_search: new_channels_in_search, accepted_clips: new_accepted_clips, removed_clips: new_removed_clips});
 	}, 

    /**
     *   This method sends an ajax request with params: removed clip id's and accepted clip id's 
    **/
    submitChanges: function() {
        // Asking user permission before we send
        var _this = this;
        var group = document.getElementById('channel_group');
        if (this.state.accepted_clips.length == 0 && this.state.removed_clips.length ==0) {
            alert('Nothing is added, please add or remove channels and then click submit');
            return;
        }
        var user_approved = confirm('Are you sure you want remove = ('+ this.state.removed_clips.length +') and add('+ this.state.accepted_clips.length +') these channels into this group = ' + group.selectedOptions[0].innerHTML);
        if (!user_approved) {
            return;
        }
        // Flow: Send two arrays of channel id's that needs to removed and added into a group
        var removed_channels = this.state.removed_clips;
        var accepted_channels = this.state.accepted_clips;
        // Extract keys from object 
        var removed_channels_keys = []
        var accepted_channels_keys = []

        for(var i=0; i<removed_channels.length; i++) {
            removed_channels_keys.push(removed_channels[i]['key']);
        }
        for(var i=0; i<accepted_channels.length; i++) {
            accepted_channels_keys.push(accepted_channels[i]['key']);
        }
        // Send ajax request
        
        this.setState({loading: true});
        $.ajax({
            type:    "POST",
            url:     config.ajax_url + "/dashboard_post_groups_editorial",
            data:    {"group_id": group.value, "removed_channels":JSON.stringify(removed_channels_keys), "accepted_channels":JSON.stringify(accepted_channels_keys)},
            success: function(data) {
                alert(data['status']);
                _this.setState({channels_in_group : [],  channels_in_search : [], cursor_for_group_query: null, accepted_clips : [], removed_clips : [], loading : false, cursor_for_search_query : null});
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("INTERNAL SERVER ERROR, please report it to ADMIN");
                _this.setState({channels_in_group : [],  channels_in_search : [], cursor_for_group_query: null, accepted_clips : [], removed_clips : [], loading : false, cursor_for_search_query : null});
            }
        });
    },

	render: function() {
		var _this = this;

        var RightSideBarStyle = {
            position: 'absolute',
            marginLeft: '240px',
            top: '60px',
            bottom: '0px',
            display: 'block',
            padding: '9px',
           	width: '83%'      
        }
        var titleStyle = {
        	fontFamily: 'serif',
        	fontSize: '30px',
        	textAlign : 'center'
        }

        var LeftTableStyle = {
        	float: 'left',
        	margin: '15px'
        }

        var selectBoxStyle = {
           width: '220px',
            height: '30px',
            margin : '5px',
            padding: '5px'
        }

        var inputFieldStyle = {
            width: '250px',
            margin: '10px'
        }

        var RightTableStyle = {
        	float: 'right',
        	margin: '15px'
        }

        var subTitleStyle = {
        	fontSize: '14px',
        	margin: '1px',
        	padding: '1px'
        }

        var SearchInputStyle = {
        	width: '300px',
    		height: '20px',
    		lineHeight: '28px',
    		paddingLeft: '10px',
    		color: 'darkgreen',
    		border: '3px solid rgb(255, 255, 255)',
    		fontFamily: 'arial,sans-serif',
    		fontSize: '15px',
    		margin: '5px',
    		boxShadow: 'rgb(220, 220, 220) 1px 1px' 
        }

        var submitStyle = {
            width: '50px',
            margin: '0 auto',
            padding: '2px'
        }
       	var total_accepted_clips = 0, total_removed_clips = 0;
       	
       	if (this.state.accepted_clips != []) {
       		total_accepted_clips = this.state.accepted_clips.length;
       	}
       	if (this.state.removed_clips != []) {
       		total_removed_clips = this.state.removed_clips.length;
       	}
        
        // Adding a loading toast 
        if (this.state.loading){
            var loadingSpinner = <LoadingSpinner />
        }
		return(
			<div style={RightSideBarStyle}>
				<h1 style={titleStyle}> Channel Groups(And & Remove from Groups)</h1>
				<div style={submitStyle} onClick={this.submitChanges}>
                    <RedButton text="Submit" />
                </div>
                <div>
					<div style={LeftTableStyle}>
						<p style={subTitleStyle}> Total Removed Clips: {total_removed_clips} </p>
            			<div style={selectBoxStyle}>
	                       Channel Group:
	                       <select id="channel_group" name="channel_group" onChange={this.getChannelByGroup}>
	                           <option value="0">Recommended for you</option>
	                           <option value="1">Latest Movies</option>
	                           <option value="2">Editors Pick</option>
	                           <option value="3">Greetings</option>
                               <option value="4">Politics</option>
                               <option value="5">By Actor</option>
	                           <option value="6">By Movie</option>
	                           <option value="7">Trending channels</option>
	                        </select>
	                    </div>
						{loadingSpinner}
						<Datatable
							width_style = 'true'  
	            			tags = {['key', 'name', 'poster_url']} 
	            			actions={[{'name': 'Remove', 'function': this.removeFromChannel, 'tag':'key'}]} 
	            			data = {this.state.channels_in_group} />
	            	</div>

	            	<div style={RightTableStyle}>
	            		<p style={subTitleStyle}> Total Accepted Clips: {total_accepted_clips} </p>
	            		<div style={inputFieldStyle}> <input style={SearchInputStyle} id="search_input" onKeyPress={this.getBySearchInput.bind(event)} placeholder="Search for channels" /></div>
	            		{loadingSpinner}
	            		<Datatable 
	            			width_style = 'true'
	            			tags = {['key', 'name', 'poster_url']} 
	            			actions={[{'name': 'Add', 'function': this.addIntoChannel, 'tag':'key'}]} 
	            			data = {this.state.channels_in_search} />
					</div>
				</div>
			</div>
		)
	}
})