/** @jsx React.DOM */

'use strict'

window.init = function() {
     
    var ROOT = 'https://akshaym1-dot-the-tasty-samosa.appspot.com/_ah/api';
    gapi.client.load('samosa', 'v1', function() {

		var React = require('react');
		var page = require('page');

		var Header = require('./views/Header');
		var LeftSideBar = require('./views/LeftSideBar');
		var PopularNow = require('./views/PopularNow');
		var SearchView = require('./views/SearchView');
		var LoginView = require('./views/LoginView');
		var MostRecent = require('./views/MostRecent');
		var IndividualClip = require('./views/IndividualClip');
    var IframePlayer = require('./views/IframePlayer');

		var AdminLeftSideBar = require('./views/admin/AdminLeftSideBar');		
		var viewPopularNow = require('./views/admin/viewPopularNow');
		var viewApproved = require('./views/admin/viewApproved');	
		var viewUnApproved = require('./views/admin/viewUnApproved');
    var createPushNotification = require('./views/admin/createPushNotification');
    var getPushNotificationId = require('./views/admin/getPushnotificationId');
    var viewClips = require('./views/admin/viewClips');
    var editClip = require('./views/admin/editClip');
    var addRelationShip = require('./views/admin/addRelationShip')

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

     						    document.getElementById('wrapper').style.display = 'block';

          					if(url.match(regex)){
          							console.log('match');
                        document.getElementById('wrapper').style.display = 'none';
                        React.render(<AdminLeftSideBar />,  document.getElementById('left-side-bar'));          						
          					}
          					else{
          						React.render(<LeftSideBar />,  document.getElementById('left-side-bar'));
          					}

          					document.getElementById('left-side-bar').style.display = 'block';
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

     ['/admin/dashboard/view_clips', viewClips],
     ['/admin/dashboard/get_push_notif_id/:keys', getPushNotificationId],
 		 ['/admin/dashboard', viewUnApproved],
 		 ['/admin/dashboard/:view-approved', viewApproved],
     ['/admin/dashboard/create_push_notification', createPushNotification],
     ['/admin/dashboard/edit_clip/:key', editClip],
     ['/admin/dashboard/add_relationship', addRelationShip]
	];

	React.render(<Header />, document.getElementById('header'));

	React.render(<Router routes={routes} />, document.getElementById('right-side-bar'));
		
    }, ROOT);

};
