'use strict'
var react = require('react');
var LoadingSpinner = require('./../../components/LoadingSpinner');
var InputField = require('../../components/InputField');
var RedButton = require('./../../components/RedButton');
var BlueButton = require('./../../components/BlueButton');
var page = require('page');
var config = require('../../config');
var Register = require('./../admin/RegisterNewPartner.jsx');

module.exports = React.createClass({
	getInitialState : function() {
		return {loading: true}
	},

	componentDidMount : function() {
		this.setState({loading: false, permission_type: 0});
	},

	validation : function() {
		var select_permission = document.getElementById('permission_type').value;
		if (select_permission == 0) {
			alert('Please select a valid permission');
			return false;
		}
		var email_id = document.getElementById('email_id').value;
		if (email_id == "") {
			alert('Email address is null');
			return false;
		}
		var x = email_id;
		var atpos = x.indexOf("@");
	    var dotpos = x.lastIndexOf(".");
	    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
	        alert("Not a valid e-mail address");
	        return false;
	    }
		// On success of both params, submit the form
		this.submitForm();
	},

	submitForm : function() {
		var _this = this;
        this.setState({loading: true});

        $('#create_permission_button').hide();
        var options = { 
            target:   '#output',
            url: config.ajax_url + '/dashboard_post_change_permission',
            success: function(response) { 
                alert(response['status']);
                _this.setState({loading: false});
                $("#upload_form_of_permissions_form")[0].reset();
                $('#create_permission_button').show();
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

                $('#create_permission_button').show();
                
            }
        }; 
        
        $('#upload_form_of_permissions_form').submit(function(e) {   //Ajax Submit form   
            e.preventDefault();
            e.stopImmediatePropagation(); 
            $(this).ajaxSubmit(options);
            return false;
        });      
	},

	register : function(url) {
		page(url);
	},

	render : function() {

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

        var submitButtonStyle = {
        	width: '150px',
        	height: '30px',
        	marginLeft: '120px',
        	padding: '10px'
        };

        var formDiv = {
        	marginLeft: '380px',
        	padding: '12px'
        };

        var registerDiv = {
        	marginLeft: '450px',
        	width: '330px',
        	height: '30px',
        	padding: '5px'

        };

        // Adding a loading toast 
        if (this.state.loading){
            var loadingSpinner = <LoadingSpinner />
        }

		return (
			<div style={RightSideBarStyle}>
				<div>
					<h1 style={titleStyle}> Handling permissions </h1>
					<div style={formDiv}>
						<form method="POST" enctype="multipart/form-data" id="upload_form_of_permissions_form">
							{loadingSpinner}
							<div style={inputFieldStyle}>
								Email id: 
								<InputField name="email_id" id="email_id" placeholder="Please write a valid email id which has a samosa account" />
							</div>
							<div style={inputFieldStyle}>
								Permission type :
								<select name="permission_type" id="permission_type">
									<option value="0">NONE</option>
									<option value="2">ADMIN</option> 
									<option value="1">PARTNER</option>
								</select>
							</div>
							<div style={submitButtonStyle} onClick={this.validation} id="create_permission_button">
								<RedButton text="Create Permission" />
							</div>
						</form>
					</div>
					<div style={registerDiv} onClick={this.register.bind(this, '/admin/dashboard/register_a_new_partner')}> 
						<p> <b>Note</b> : If not a Samosa User, Please register here.</p>
						<BlueButton text="Register" />
					</div>
				</div>
				<div id="output"></div>
			</div>
		)
	}
})

