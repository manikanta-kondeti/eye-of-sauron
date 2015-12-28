'use strict'
var react = require('react');
var InputField = require('./../../components/InputField');
var RedButton = require('./../../components/RedButton');
var LoadingSpinner = require('./../../components/LoadingSpinner');
var config = require('../../config');

module.exports = React.createClass({
	getInitialState : function() {
		return {loading: false}
	},

	validation : function() {
		var email = document.getElementById('email').value;
		if (email == "") {
			alert('Email id field is empty');
			return false;
		}
		// Checking if it is a valid id
		var x = email;
		var atpos = x.indexOf("@");
	    var dotpos = x.lastIndexOf(".");
	    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
	        alert("Not a valid e-mail address");
	        return false;
	    }

	    var user_name = document.getElementById('user_name').value;
		if (user_name == "") {
			alert('Username field is empty');
			return false;
		}
		var first_name = document.getElementById('first_name').value;
		if (first_name == "") {
			alert('Firstname is empty');
			return false;
		}
		var last_name = document.getElementById('last_name').value;
		if (last_name == "") {
			alert('Lastname is empty');
			return false;
		}

		var gender = document.getElementById('gender').value;
		if (gender == "0") {
			alert('Gender is wrong');
			return false;
		}

		// Submit after success of this validation
		this.submitForm();
	},

	submitForm : function() {
		var _this = this;
        this.setState({loading: true});

        $('#register_new_user_button').hide();
        var options = { 
            target:   '#output',
            url: config.ajax_url + '/dashboard_post_create_new_partner',
            success: function(response) { 
                alert(response['status']);
                _this.setState({loading: false});
                $("#upload_form_register_new_partner")[0].reset();
                $('#register_new_user_button').show();
            }, 
            error: function(e,status) {
                console.log("e.status ");
                if (e.status == 404) {
                    alert("404 error");
                }
                if (e.status >= 500) {
                    alert("Internal Server Error, please report it to admin");
                }
                _this.setState({loading: false});
                $('#register_new_user_button').show();
                
            }
        }; 
        
        $('#upload_form_register_new_partner').submit(function(e) {   //Ajax Submit form   
            e.preventDefault();
            e.stopImmediatePropagation(); 
            $(this).ajaxSubmit(options);
            return false;
        });      
	},

	render: function() {
		/**
		 *  @params: email, username, first_name, last_name, gender
		**/
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
        	fontFamily : 'serif'
        };

        var submitButtonStyle = {
        	width: '150px',
        	height: '30px',
        	marginLeft: '120px',
        	padding: '10px'
        };

        var inputFieldStyle = {
        	width: '450px',
        	margin: '15px',
        	padding: '5px'
        };

        var registerFormDiv = {
        	marginLeft : '360px'
        };

        // Adding a loading toast 
        if (this.state.loading){
            var loadingSpinner = <LoadingSpinner />
        }

		return(
			<div style={RightSideBarStyle}>
				<div>
					<h1 style={titleStyle}> Register New Partner </h1> 
					<div style={registerFormDiv}> 
						<form method="POST" enctype="multipart/form-data" id="upload_form_register_new_partner">
							{loadingSpinner}
							<div style={inputFieldStyle}>
								Email :
								<InputField placeholder="Write a valid email id" name="email" id="email" />
							</div>
							<div style={inputFieldStyle}>
								Username :
								<InputField placeholder="Enter a user name" name="user_name" id="user_name" />
							</div>
							<div style={inputFieldStyle}>
								Firstname :
								<InputField placeholder="Enter first name" name="first_name" id="first_name" />
							</div>
							<div style={inputFieldStyle}>
								Lastname :
								<InputField placeholder="Enter last name" name="last_name" id="last_name" />
							</div>
							<div style={inputFieldStyle}>
								Gender :
								<select name="gender" id="gender"> 
									<option value="0">None</option>
									<option value="male"> Male </option>
									<option value="female"> Female </option>
	 							</select> 
							</div>
							<div style={submitButtonStyle} onClick={this.validation} id="register_new_user_button">
								<RedButton text="Sign Up" />
							</div>
						</form>
					</div>
				</div>
				<div id="output"></div>
			</div>
		)
	}
})