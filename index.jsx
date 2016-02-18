/** @jsx React.DOM */

'use strict'

window.init = function() {
     
    var ROOT = 'https://mani-dev-dot-the-tasty-samosa.appspot.com/_ah/api';
    gapi.client.load('samosa', 'v1', function() {

		var React = require('react');
		var page = require('page');
    var Radium = require('Radium');
    var HeaderHome = require('./views/HeaderHome');
    var Header = require('./views/Header');
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
    var UserProfile = require('./views/UserProfile');
    var ChannelPage = require('./views/ChannelPage');
    var ErrorPage = require('./components/ErrorPage');
    var ChannelsGroupView = require('./views/ChannelsGroupView');
		var Router = React.createClass({

			getInitialState: function () {

  			  return { component: <ErrorPage />};
 		 	},

  		componentDidMount: function () {

  				var _this = this;
   		 		this.props.routes.forEach(function (route) {

      			var url = route[0];
      			var Component = route[1];
    
     				page(url, function (ctx) {

                var regex = new RegExp('/admin/dashboard', 'gi');
                var regex_partners = new RegExp('/partners/dashboard', 'gi');
                if(url.match(regex) || url.match(regex_partners)){
                        React.render(<Header />, document.getElementById('header'));
                        $('#wrapper').html(' ');
                        React.render(<AdminLeftSideBar />,  document.getElementById('left-side-bar'));                      
                }

                else { 
                  //Only admin has left side bar 
                  $('#left-side-bar').html('');

                  if(url == "/" || url == "/popular-now" || url == "" || url == "/most-recent" || url == "/actors" || url == "/latest_movies" || url == "/greetings" || url == "/trending_channels" || url == "/movies" || url == "/politics") {
                      Renderer.unmount(document.getElementById('header'));
                      React.render(<HeaderHome />, document.getElementById('header'));
                  }					

                  else if(url == "/popular-now-iframe"){
                    Renderer.unmount(document.getElementById('header'));
                    $('#header').html('')
                  }
                
                  else if(url.split('/')[1] == "play" || url.split('/')[1] == "search") {
                      Renderer.unmount(document.getElementById('header'));
                      React.render(<HeaderOther />, document.getElementById('header'));
                  }

                  else {
                      Renderer.unmount(document.getElementById('header'));
                      React.render(<Header />, document.getElementById('header'));
                  }
                } 

          
                _this.setState({ component: <Component params={ctx.params} /> });
     				});
   			  });

  			page.start();
 		 },

  		render: function () {

          var element = <div id="component"> {this.state.component} </div>
          Renderer.unmount(document.getElementById('component'));

          return element;
 		 }

	});
  
  /**
   * Ref : https://github.com/facebook/react/issues/4498
   * This helps us in  unmounting the component
  **/
  var Renderer = {
    unmount: function(node) {
      if( node != null) { 
        React.unmountComponentAtNode(node);
      }
    }
  }

	var routes = [
 		 ['', PopularNow],
     ['/search', PopularNow],
 		 ['/popular-now',PopularNow],
 		 ['/most-recent',MostRecent],
 		 ['/search/:queryText', SearchView],
 		 ['/login', LoginView],
 		 ['/play/:key', IndividualClip],
     ['/embed/:key', IframePlayer],
     ['/user/:key', UserProfile],
     ['/channel/:key', ChannelPage],
     ['/notification/:key', PushNotificationOnWeb],
     ['/embed-popular-now', EmbedPopularNow],
     ['/popular-now-iframe', PopularNowIframe],
     ['/edit-videos', EditVideos],
     ['/latest_movies', ChannelsGroupView],
     ['/actors', ChannelsGroupView],
     ['/greetings', ChannelsGroupView],
     ['/trending_channels', ChannelsGroupView],
     ['/movies', ChannelsGroupView],
     ['/politics', ChannelsGroupView]
	];

	React.render(<Router routes={routes} />, document.getElementById('right-side-bar'));
		
    }, ROOT);

};
