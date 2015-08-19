/** @jsx React.DOM */

'use strict'

window.init = function() {
     
     console.log('ho');

    var ROOT = 'https://the-tasty-samosa.appspot.com/_ah/api';
    gapi.client.load('samosa', 'v1', function() {

    console.log('Root');

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
     						
          					if(url.match(regex)){
          							React.renderComponent(<AdminLeftSideBar />,  document.getElementById('left-side-bar'));          						
          					}
          					else{
          						React.renderComponent(<LeftSideBar />,  document.getElementById('left-side-bar'));
          					}

          					console.log('hi');
          					document.getElementById('left-side-bar').style.display = 'block';
							document.getElementById('wrapper').style.display = 'block';
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
 		 ['/popular-now',PopularNow],
 		 ['/most-recent',MostRecent],
 		 ['/search/:queryText', SearchView],
 		 ['/login', LoginView],
 		 ['/play/:key', IndividualClip],
     ['/embed/:key', IframePlayer],


 		 ['/admin/dashboard', viewUnApproved],
 		 ['/admin/dashboard/:view-approved', viewApproved]

	];

	React.renderComponent(<Header />, document.getElementById('header'));

	React.renderComponent(<Router routes={routes} />, document.getElementById('right-side-bar'));
		
    }, ROOT);

};
