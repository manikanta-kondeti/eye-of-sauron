'use strict'
var React = require('react');
var Page = require('page');
var RedButton = require('../../components/RedButton');
var InputField = require('../../components/InputField');
var config = require('../../config');
var LoadingSpinner = require('./../../components/LoadingSpinner');

module.exports = React.createClass({
	getInitialState : function() {
		return {loading: false}
	},
	componentDidMount : function() {
		// Populate dropdowns 
		$.get(config.ajax_url + '/dashboard_get_params_on_push_test_interface', function(response){
			console.log("admins = " + response.admins + " push_types = " + response.push_types);
			var admins = response['admins'];
            var select = document.getElementById('user_key');
            for(var i=0; i<admins.length; i++) {
                    var opt = document.createElement('option');
                    opt.value = admins[i].id;
                    opt.innerHTML = admins[i].email;
                    select.appendChild(opt);
            }
          	var push_types = response['push_types'];
            var select = document.getElementById('push_type');
            for(var i=0; i<push_types.length; i++) {
                    var opt = document.createElement('option');
                    opt.value = push_types[i].push_value;
                    opt.innerHTML = push_types[i].push_type;
                    select.appendChild(opt);
            }
		})
	},

	validation : function() {
		// Check if key and other params are passed 
		this.submitForm();
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
        };

        var titleStyle = {
        	textAlign : 'center',
        	fontFamily : 'serif',
        	fontSize : '30px'
        };

        var inputFieldStyle = {
        	width: '450px',
        	margin: '15px',
        	padding: '5px'
        };

        var submitStyle = {
            width: '120px',
            height: '30px',
            margin: '30px'
        }

        var formStyle = {
        	marginLeft : '380px',
        	padding : '12px'
        };

        // Adding a loading toast 
        if (this.state.loading){
            var loadingSpinner = <LoadingSpinner />
        }

		return(
			<div style={RightSideBarStyle}>
				<h1 style={titleStyle}> Test Push Notifications</h1>
				<div style={formStyle}>
					<div style={inputFieldStyle}>
						Push Notification Id: 
						<InputField name="push_id" id="push_id" placeholder="Please write a valid push Notification id" />
					</div>
					<div style={inputFieldStyle}>
						User :
						<select name="user_key" id="user_key"> 
							<option value="2dfaYVgHWx"> Abhimanyu </option>
						</select> 
					</div>
					<div style={inputFieldStyle}>
						Type of push Notification :
						<select name="push_type" id="push_type"> 
						</select> 
					</div>
					<div style={inputFieldStyle}>
						Type of Channel :
						<select name="channel_id" id="channel_id"> 
							<option value="others_ringtones">Ringtones</option>
							<option value="actor_pawan_kalyan">Actor Pawan Kalyan</option>
							<option value="movie_dilwale_2015">Movie Dilwale</option>
							<option value="movie_dilwale_2015">Movie Dilwale</option>
						</select> 
					</div>
					<div onClick={this.validation} id="create_channel_button" style={submitStyle}>
	                    <RedButton  text = "Send Notification" />
	                </div>
	            </div>
			</div>
		)
	}
})