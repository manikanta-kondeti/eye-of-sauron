/** @jsx React.DOM */


'use strict'

var React = require('react');
var page = require('page');
var LanguageModal = require('../views/LanguageModal');



module.exports = React.createClass({

	getInitialState: function() {
		return { queryText: null, open_modal: null, login: false, header_fix: false};
	},

	componentDidMount: function() {

		this.checkLogin();

		window.addEventListener('scroll', this.handleScroll);

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

	handleScroll: function() {

		  var opacity = (window.scrollY == 0 ) ? 1 : 30/window.scrollY

		  $('#title').css('opacity', opacity);
		  $('#downloadIconsWrapper').css('opacity', opacity);


		  (window.scrollY >= 280) ? this.fixHeader(true) : this.fixHeader(false) 
	},

	fixHeader: function(header_fix) {
		this.setState({header_fix: header_fix});
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

	logoClick: function() {
		page('/');
	},

	searchQuery: function(e) {
		if(e.keyCode == 13) {
			var queryText = this.refs.search.getDOMNode().value;
	 		page('/search/'+queryText);
	 	}
	},

	render: function() {

		var header =  {
				position: 'fixed',
				background: 'url(/static/images/header_bg.png) no-repeat center center',
				margin: '0 auto',
				height: '350px',
				width: '100%',
				backgroundSize: 'cover'
		}

		var logo = {
				position: 'absolute',
				background: 'url(/static/images/logo.png) no-repeat center center',
				backgroundSize: 'cover',
				width: '110px',
				height: '110px',
				top: '80px',
				left: '80px',
				cursor: 'pointer',
				opacity: '1'
			}
		var title = {
				position: 'fixed',
				background: 'url(/static/images/title.png) no-repeat center center',
				backgroundSize: 'cover',
				top: '80px',
				left: '50%',
				width: '320px',
				height: '100px',
				marginLeft: '-160px'
			}

		var wrapper = {
				position: 'relative',
			    width: 'auto',
    			margin: '0 auto',
    			padding: '0'
			}

		var downloadIconsWrapper = {
				position: 'fixed',
				top:'215px',
				left: '50%',
				width: '410px',
				marginLeft: '-205px',
				height: '80px',
				opacity: '1'
			}

		var downloadIcons = {
				float: 'left',
				padding: '5px',
				width: '125px',
				cursor: 'pointer'
			}

		var headerBtns =  {
				width: '220px',
    			height: '50px',
    			right: '0px',
    			position: 'absolute',
    			top: '30px'
			}

		var searchBoxWrapper = {
				position: 'absolute',
				width: '600px',
				height: '25px',
				top: '290px',
				marginLeft: '-300px',
				left: '50%'
			}

		var searchBox =  {
				width: '100%',
				height: '100%',
				padding: '10px',
				borderRadius: '5px',
				border: '1px solid #eee'
			}

		var languagesBtn =  {
				boxShadow: 'inset 0px 1px 0px 0px #ffffff',
				backgroundColor: '#ffffff',
				borderRadius: '30px',
				border: '1px solid #dcdcdc',
				display: 'inline-block',
				cursor: 'pointer',
				color: '#666666',
				fontFamily: 'Arial',
				fontSize: '10px',
				padding: '8px 16px',
				textDecoration: 'none',
				textShadow: '0px 0px 0px #ffffff'
			}
			
			// var languagesBtn:hover {
			// 	background-color:#f6f6f6;
			// }
			// .languagesBtn:active {
			// 	position:relative;
			// 	top:1px;
			// }

	var loginBtn = {
		boxShadow: '0px 0px 0px 1px #38474F',
		backgroundColor: '#38474F',
		borderRadius: '30px',	
		display: 'inline-block',
		cursor: 'pointer',
		color: '#ffffff',
		fontFamily: 'Arial',
		fontSize: '10px',
		padding: '8px 24px',
		textDecoration: 'none',
		textShadow: '0px 1px 0px #283966'	
	}

	if(this.state.header_fix) {

		header['position'] = 'fixed';
		header['height'] = '80px';
		 header['zIndex'] = '100';

		 title['top'] = '26px';
		 title['width'] = '115px';
		 title['left'] = '24%';
		 title['height'] = '35px';


		 logo['top'] = '10px';
		 logo['width'] = '70px';
		 logo['height'] = '70px';
		 logo['opacity'] = '1';

		 searchBoxWrapper['top'] = '20px';
		 downloadIconsWrapper['display'] = 'none';

	}
		return (

			<div style= {header}>
				<div style = {wrapper}>
					<div onClick={this.logoClick} style={logo}></div>
					<div id="title" style= {title}></div>
					<div id="downloadIconsWrapper" style={downloadIconsWrapper}>
						<div style={downloadIcons}>
							<img width="100%" src ="/static/images/android.png" />
						</div>
						<div style={downloadIcons}>
							<img width="100%" src ="/static/images/appstore.png" />
						</div>
						<div style={downloadIcons}>
							<img width="100%" src ="/static/images/windows.png" />
						</div>
					</div>
			
					<div style={headerBtns}>
						<a href="#" style={languagesBtn}>Select Languages</a> &nbsp;
						<a href="#" style={loginBtn}>Login</a>
					</div>
			
					<div style={searchBoxWrapper}>
						<input onKeyDown={this.searchQuery} ref="search" style={searchBox} placeholder = "Search for audio clips, dialouges, proverbs" />
					</div>
				</div>
			</div>


		)
	}
});

