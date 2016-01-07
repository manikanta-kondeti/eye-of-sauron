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
            var selected_user = document.getElementById('user_key');
            for(var i=0; i<admins.length; i++) {
                    var opt = document.createElement('option');
                    opt.value = admins[i].id;
                    opt.innerHTML = admins[i].email;
                    selected_user.appendChild(opt);
            }
          	var push_types = response['push_types'];
            var selected_push_type = document.getElementById('push_type');
            for(var i=0; i<push_types.length; i++) {
                    var opt = document.createElement('option');
                    opt.value = push_types[i].push_value;
                    opt.innerHTML = push_types[i].push_type;
                    selected_push_type.appendChild(opt);
            }

            var channels = response['channel_types']
            var selected_channel = document.getElementById('channel');
            for(var i=0; i<channels.length; i++) {
                    var opt = document.createElement('option');
                    opt.value = channels[i];
                    opt.innerHTML = channels[i];
                    selected_channel.appendChild(opt);
            }
		})
	},

	sendNotification : function() {
		var _this = this;
		console.log("force = " + force);
 		this.setState({loading : true});
 		$('#send_notification_button').hide();
       
        var options = { 
            url: config.ajax_url + '/dashboard_post_send_test_notification',
            success: function(response) { 
                alert(response);
                _this.setState({loading: false});
                //$("#upload_form_of_notification")[0].reset();
                $('#send_notification_button').show();
            }, 
            error: function(e,status) {
                if (e.status == 404) {
                    alert("404 error");
                }
                if (e.status >= 500) {
                    alert("Internal Server Error, please report it to admin");
                }
                _this.setState({loading: false});
                $('#send_notification_button').show();
                
            }
        }; 
        
        $('#upload_form_of_notification').submit(function(e) {   //Ajax Submit form   
            e.preventDefault();
            e.stopImmediatePropagation(); 
            $(this).ajaxSubmit(options);
            return false;
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
        	marginLeft : '35%',
        	padding : '12px'
        };

        // Adding a loading toast 
        if (this.state.loading){
            var loadingSpinner = <LoadingSpinner />
        }
		/*
		<div style={inputFieldStyle}>
			Push Notification Id (Not operational right now + Optional): 
			<InputField name="push_id" id="push_id" placeholder="Please write a valid push Notification id" />
		</div>
		<div style={inputFieldStyle}>
			Type of Channel :
			<select name="channel" id="channel"> 
			</select> 
		</div>
		*/
		return(
			<div style={RightSideBarStyle}>
				<h1 style={titleStyle}> Test Push Notifications</h1>
				{loadingSpinner}
				<form method="post" enctype="multipart/form-data" id="upload_form_of_notification">
					<div style={formStyle}>

						<div style={inputFieldStyle}>
							User :
							<select name="user_key" id="user_key"> 
								<option value="2dfaYVgHWx"> Abhimanyu </option>
								<option value="uijclcCkOv"> Manikanta </option>
							</select> 
						</div>
						<div style={inputFieldStyle}>
							Type of push Notification :
							<select name="push_type" id="push_type"> 
							</select> 
						</div>
						<div style={inputFieldStyle}>
							Type of Channel(Optional) :
							<select name="device" id="device">
								<option value="ANDROID">ANDROID</option>
								<option value="iOS+PRODUCTION">iOS_PRODUCTION</option>
                                <option value="iOS+DEVELOPMENT">iOS_DEVELOPMENT</option> 
							</select> 
						</div>
						<div style={inputFieldStyle}>
							Force :
							<input type="checkbox" id="force" name="force" checked />
						</div>
						<div onClick={this.sendNotification} id="send_notification_button" style={submitStyle}>
		                    <RedButton  text = "Send Notification" />
		                </div>
		            </div>
		        </form>
		        <div id="output"></div>
			</div>
		)
	}
})