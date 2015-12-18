/** @jsx React.DOM */


'use strict'

var React = require('react');
var page = require('page');
var Logo = require('../components/Image');
var InputField = require('../components/InputField');
var RedButton = require('../components/RedButton');
var LinkTo = require('../components/LinkTo');
var LanguageModal = require('../views/LanguageModal');


module.exports = React.createClass({

	getInitialState: function() {
		return { queryText: null, open_modal: null, login: false};
	},

	componentDidMount: function() {

		this.checkLogin();

		window.fbAsyncInit = function() {
			FB.init({
				appId: '580678502050494',
				cookie: true, // enable cookies to allow the server to access
				// the session
				xfbml: true, // parse social plugins on this page
				version: 'v2.1' // use version 2.1
			});

			// Now that we've initialized the JavaScript SDK, we call
			// FB.getLoginStatus().  This function gets the state of the
			// person visiting this page and can return one of three states to
			// the callback you provide.  They can be:
			//
			// 1. Logged into your app ('connected')
			// 2. Logged into Facebook, but not your app ('not_authorized')
			// 3. Not logged into Facebook and can't tell if they are logged into
			//    your app or not.
			//
			// These three cases are handled in the callback function.
			FB.getLoginStatus(function(response) {
				this.statusChangeCallback(response);
			}.bind(this));
		}.bind(this);

		// Load the SDK asynchronously
		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s);
			js.id = id;
			js.src = "//connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	},

	// Here we run a very simple test of the Graph API after login is
	// successful.  See statusChangeCallback() for when this call is made.
	testAPI: function(response) {

		//if the session is now set then fetch the user details and set the cookie

		if(!sessionStorage.getItem('samosa_key')) {

			console.log('Welcome!  Fetching your information.... ');
			var _this = this;
			var access_token = response.authResponse.accessToken;

			FB.api('/me', function(response) {
				_this.setCookie(access_token, response);
			});
		 }
	},

		// This is called with the results from from FB.getLoginStatus().
		statusChangeCallback: function(response) {

			// The response object is returned with a status field that lets the
			// app know the current login status of the person.
			// Full docs on the response object can be found in the documentation
			// for FB.getLoginStatus().
			if (response.status === 'connected') {
				// Logged into your app and Facebook.
				this.testAPI(response);

			} else if (response.status === 'not_authorized') {
				// The person is logged into Facebook, but not your app.

			} else {
				// The person is not logged into Facebook, so we're not sure if
				// they are logged into this app or not.

			}
		},

		// This function is called when someone finishes with the Login
		// Button.  See the onlogin handler attached to it in the sample
		// code below.
		checkLoginState: function() {
			FB.getLoginStatus(function(response) {
				this.statusChangeCallback(response);
			}.bind(this));
	},

	setCookie: function(access_token, response) {

	    		var responseArray = {
	    			'facebook_id':response.id,
   					'email': response.email,
               		'full_name': response.name,
               		'gender': response.gender,
               		'facebook_token': access_token
        		};

        		var _this = this;
			    gapi.client.samosa.api.auth.fb.login(responseArray).execute(
           			function(resp){             			
        				sessionStorage.setItem('samosa_key', resp.auth_key);
        				_this.checkLogin();
           		});

	},

	handleLoginClick: function() {
		FB.login(this.checkLoginState,{scope: 'public_profile,email'});	
	},

	handleLogoutClick: function() {
		FB.logout();
		sessionStorage.setItem('samosa_key', '');
		this.setState({'login': false});
	},

	handleSubmimt: function(e) {
		e.preventDefault()
		var queryText = this.refs.search.getDOMNode().value;
	 	page('/search/'+queryText);
	},

	openModal: function() {	
		this.setState({open_modal: true});
	},

	closeModal: function(){
		this.setState({open_modal: false});
	},

	navigate: function(url) {
		page(url);
	},

	checkLogin: function() {
		if(sessionStorage.getItem('samosa_key')) {
			this.setState({login: true});
		}
	},

	render: function() {

		var headerStyle = {
			display: 'block',
			width: '100%',
			backgroundColor: '#fff',
			height: '59px',
			position: 'fixed',
			top: '0',
			left: '0',
			boxShadow: '0 0 5px rgba(0, 0, 0, .12)',
			zIndex: 100
		};

		var titleStyle = {
			float: 'left',
			fontSize: '24px',
			marginTop: '9px',
			marginLeft: '5px',
			fontFamily: 'cursive',
			width: '250px',
			cursor: 'pointer'
		};

		var logoStyle = {
			float: 'left',
			marginLeft: '20px',
			marginTop: '9px'
		};

		var searchBoxStyle = {
			float: 'left',
			width: '43%',
			marginTop: '3px',
			height: '45px'
		}

		var rightblockStyle = {
			float: 'right',
			marginTop: '15px',
			width: '280px',
			height: 'auto'
	
		}

		var buttonStyleLogin = {
			float: 'left',
			width: '100px',
			height: '30px',
			marginLeft: '38px',
			display: 'block',
		}

		var buttonStyleLogout = {
			float: 'left',
			width: '100px',
			height: '30px',
			marginLeft: '38px',
			display: 'block',
		}

		var langStyle = {
			fontSize: '10px',
			width: 'auto',
			float: 'left',
			margin: '7px'
		}

		var modalStyle = {
			display: 'none'
		}

		var myAccountStyle = {
			display: 'none'
		}

		if(this.state.open_modal) {
			modalStyle['display'] = 'block'

		}

		if(this.state.login) {
			buttonStyleLogin['display'] = 'none';	
		}
		else{
			buttonStyleLogout['display'] = 'none';
		}

		if(!this.props.search) {
			searchBoxStyle['display'] = 'none';
		}
		
		if(!this.props.login) {
			langStyle['display'] = 'none';
			buttonStyleLogin['display'] = 'none';
		}

		return (

		 <div> 
			<div style = {headerStyle} > 
				<div onClick={this.navigate.bind(this, '/')}>
					<div style = {logoStyle}> <Logo  src="https://lh5.ggpht.com/oJpCSXfyxWeLDSM8GKN-SHyv8ZK29pF2NURecNkK1aQD_9mH0ZYscux07oNPgxog28RU=w300" width="35" height="35"/> </div>
					<div style = {titleStyle}> SAMOSA PARTNERS </div>
				</div>
				<div id = "wrapper">
					<div style = {searchBoxStyle}>
						 <form onSubmit={this.handleSubmimt}>
						 	<InputField ref="search" placeholder = "Search For Audio Clips" />
						 </form>
					 </div>

				 	<div style= {rightblockStyle}>
					
						 <div onClick={this.openModal} style = {langStyle}><LinkTo text="SELECT LANGUAGES" color="black" hover_color="#cc181e" /> </div>
					 	
				 	</div>
				</div>
			</div>

			<div style={modalStyle}> <LanguageModal close_modal={this.closeModal} /> </div>

		</div>


		)
	}
});
