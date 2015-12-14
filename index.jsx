/** @jsx React.DOM */

'use strict'

window.init = function() {
     
    var ROOT = 'https://the-tasty-samosa.appspot.com/_ah/api';
    gapi.client.load('samosa', 'v1', function() {

		var React = require('react');
		var page = require('page');

    var HeaderHome = require('./views/HeaderHome');
		var HeaderOther = require('./views/HeaderOther');
		var LeftSideBar = require('./views/LeftSideBar');
		var PopularNow = require('./views/PopularNow');
		var SearchView = require('./views/SearchView');
		var LoginView = require('./views/LoginView');
		var MostRecent = require('./views/MostRecent');
		var IndividualClip = require('./views/IndividualClip');
    var IframePlayer = require('./views/IframePlayer');
    var PushNotificationOnWeb = require('./views/PushViewOnWeb')
    var PopularNowIframe = require('./views/PopularNowIframe');
    var EmbedPopularNow = require('./views/EmbedPopularNow');
    var EditVideos = require('./views/EditVideos');

		var Router = React.createClass({

			getInitialState: function () {

  			  return { component: '<div />'};
 		 	},

  		componentDidMount: function () {

  				var _this = this;
   		 		this.props.routes.forEach(function (route) {

      			var url = route[0];
      			var Component = route[1];
    
     				page(url, function (ctx) {

                var regex = new RegExp('/admin/dashboard', 'gi');
                var regex_partners = new RegExp('/partners/dashboard', 'gi');
                console.log("Regex partners = " + url.match(regex_partners));
                if(url.match(regex) || url.match(regex_partners)){
                        React.render(<Header />, document.getElementById('header'));
                        $('#wrapper').html(' ');
                        React.render(<AdminLeftSideBar />,  document.getElementById('left-side-bar'));                      
                }

                else { 

                  //Only admin has left side bar 
                  $('#left-side-bar').html('');

                  if(url == "/" || url =="/popular-now" || url =="" || url=="/most-recent") {
                      React.render(<HeaderHome />, document.getElementById('header'));
                  }					

                  else if(url == "/popular-now-iframe"){
                    $('#header').html('')
                  }
                
                  else {

                      React.render(<HeaderOther />, document.getElementById('header'));
                  }
                } 

     					  _this.setState({ component: <Component params={ctx.params} /> });
     				});
   			  });


  			page.start();
 		 },

  		render: function () {
  			  return <div> {this.state.component} </div>;
 		 }

	});

	var routes = [
 		 ['', PopularNow],
     ['/search', PopularNow],
 		 ['/popular-now',PopularNow],
 		 ['/most-recent',MostRecent],
 		 ['/search/:queryText', SearchView],
 		 ['/login', LoginView],
 		 ['/play/:key', IndividualClip],
     ['/embed/:key', IframePlayer],
     ['/notification/:key', PushNotificationOnWeb],
     ['/embed-popular-now', EmbedPopularNow],
     ['/popular-now-iframe', PopularNowIframe],
     ['/edit-videos', EditVideos]
	];

	React.render(<Router routes={routes} />, document.getElementById('right-side-bar'));
		
    }, ROOT);

};
