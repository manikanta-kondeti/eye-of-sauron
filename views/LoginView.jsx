/** @jsx React.DOM */

'use strict'

var React = require('react');
var page = require('page');


module.exports = React.createClass({

	getInitialState: function() {
		return {facebookIconHover: false }
	},

	componentDidMount: function() {

		document.getElementById('left-side-bar').style.display = 'none';
		document.getElementById('wrapper').style.display = 'none';

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

			console.log('Welcome!  Fetching your information.... ');
			var _this = this;
			var access_token = response.authResponse.accessToken;
			
			FB.api('/me', function(response) {
				_this.setCookie(access_token, response);
			});
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

		handleClick: function() {
	  		FB.login(this.checkLoginState,{scope: 'public_profile,email'});	
	    },


	    setCookie: function(access_token, response) {
	    		
	    		console.log('hi');

	    		var responseArray = {
	    			'facebook_id':response.id,
   					'email': response.email,
               		'full_name': response.name,
               		'gender': response.gender,
               		'facebook_token': access_token
        		};

			    gapi.client.samosa.api.auth.fb.login(responseArray).execute(
           			function(resp){             			
        				sessionStorage.setItem('samosa_key', resp.auth_key);

           		});
           		//rediret to home page
           		page('/popular-now');
	    },

	    fbIconhover: function() {
	    	this.setState({facebookIconHover: !this.state.facebookIconHover })
	    },

		render: function() {

			var wrapperStyle = {
				position: 'absolute',
				top: '60px',
				bottom: '0px',
				display: 'block',
				width: '100%',
				backgroundImage: 'url(http://localhost:8080/public/images/collage.jpg)',
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover'

			}

			var loginBoxStyle = {
				position: 'fixed',
				top: '50%',
				left: '50%',
				width: '400px',
				height: '230px',
				marginTop: '-120px',
				marginLeft: '-230px',
				backgroundColor: '#fff',
				boxShadow: '0 0 5px rgba(0, 0, 0, .12)',
				padding: '15px',
				textAlign: 'center'

			}

			var contentStyle = {
				width: '200px',
				border: '1px solid #e8e8e8',
				padding: '10px',
				fontSize: '15px'
			}

			var loginIconsStyle = {
				
			}

			var facebookIconStyle = {
				opacity: 0.8
			}

			if(this.state.facebookIconHover){
				facebookIconStyle['opacity'] = 1
			}


		return (

			<div style = {wrapperStyle} >
				<div style = {loginBoxStyle} >
			

					<div style = {loginIconsStyle} >
						<a href="#" onClick={this.handleClick}>
							<img style={facebookIconStyle} onMouseEnter={this.fbIconhover} onMouseLeave={this.fbIconhover} width="200" src ="https://pgprep.com/assets/images/icons/login-fb.png" />
						</a>
					</div> 
			    </div>
			< /div>
	)
}

});