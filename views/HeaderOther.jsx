/** @jsx React.DOM */

'use strict';

var React = require('react');
var page = require('page');
var LanguageModal = require('../views/LanguageModal');
var BannerOnMobile = require('../components/BannerOnMobile');
var Radium = require('radium');
var {StyleRoot} = Radium;

var HeaderOther = React.createClass({

	getInitialState: function() {
		return { queryText: null, open_modal: null, login: false};
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

	handleLoginClick: function() {
		FB.login(this.checkLoginState,{scope: 'public_profile,email'});	
	},

	handleLogoutClick: function() {
		FB.logout();
		sessionStorage.setItem('samosa_key', '');
		$('#login').show();
		$('#logout').hide();
	},

	checkLogin: function() {
		if(sessionStorage.getItem('samosa_key')) {
			$('#login').hide();
			$('#logout').show();
		}
		else {
			$('#login').show();
			$('#logout').hide();
		}
	},

	logoClick: function() {
		page('/')
	},

	searchQuery: function(e) {
		if(e.keyCode == 13) {
			var queryText = this.refs.search.getDOMNode().value;
	 		page('/search/'+queryText);
	 	}
	},

	openModal: function() {	
		this.setState({open_modal: true});
	},

	closeModal: function(){
		this.setState({open_modal: false});
	},

	render: function() {
	
		var header =  {
			background: '#4b616e',
			margin: '0 auto',
			height: '200px',
			width: '100%',
			backgroundSize: 'cover',
		}

		var logo = {
			position: 'absolute',
    		background: 'url(/static/images/logo.png) no-repeat center center',
   	 		backgroundSize: 'cover',
    		width: '100px',
    		height: '100px',
    		top: '60px',
    		left: '50px',
    		cursor: 'pointer'
		}

		var title = {
			position: 'absolute',
 			background: 'url(/static/images/title.png) no-repeat center center',
    		backgroundSize: 'cover',
    		top: '85px',
    		left: '145px',
    		width: '130px',
    		height: '40px'
		}

		var wrapper = {
			position: 'relative',
			width: 'auto',
    		margin: '0 auto',
    		padding: '0',
    		height: '100%'
		}

		var headerBtns = {
			width: '220px',
    		height: '50px',
    		right: '0px',
    		position: 'absolute',
    		top: '30px'
		}

		var searchBoxWrapper  = {
			position: 'absolute',
			width: '360px',
			height: '18px',
			top: '84px',
			marginLeft: '-180px',
			left: '50%'
		}

		var searchBox = {
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

		var modalStyle = {
			display: 'none'
		}


	if(this.state.open_modal) {
			modalStyle['display'] = 'block'
	}

 	return (	
 		<StyleRoot>
	 		<div>
	 			<BannerOnMobile />
		 		<div style={header}>
					<div style = {wrapper}>
						<div onClick={this.logoClick} style={logo}></div>
						<div style={title}></div>
						<div style={headerBtns}>
							<span  onClick={this.openModal}  style={languagesBtn}>Select Languages</span> &nbsp;
							<span id="login" onClick={this.handleLoginClick}  href="#" style={loginBtn}>Login</span>
							<span id="logout" onClick={this.handleLogoutClick} style = {loginBtn}> Logout </span>
						</div>
					
						<div style={searchBoxWrapper}>
							<input onKeyDown={this.searchQuery} ref="search" style={searchBox} placeholder = "Search for audio clips, dialouges, proverbs" />
						</div>
						
					</div>

					<div style={modalStyle}> <LanguageModal close_modal={this.closeModal} /> </div>
				</div>
			</div>
		</StyleRoot>
	)}
})

class HeaderOtherWithMediaQuery extends React.Component {
	render() {
		return(
			<StyleRoot>
				<HeaderOther />
			</StyleRoot>
		)
	}
}

module.exports = Radium(HeaderOtherWithMediaQuery);