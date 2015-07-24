/** @jsx React.DOM */

'use strict'

window.init = function() {
     
    var ROOT = 'https://the-tasty-samosa.appspot.com/_ah/api';
    gapi.client.load('samosa', 'v1', function() {


		var React = require('react');
		var page = require('page');

		var Header = require('./views/Header');
<<<<<<< HEAD
		var LeftSideBar = require('./views/LeftSideBar');
		var PopularNow = require('./views/PopularNow');
		var SearchView = require('./views/SearchView');
		var LoginView = require('./views/LoginView');
		var MostRecent = require('./views/MostRecent');
=======
		var LeftSideBar = require('./views/LeftSideBar')
		var PopularNow = require('./views/PopularNow')
		var SearchView = require('./views/SearchView')
>>>>>>> 92d5aea750da3981c4a9fe724732b3383d1c8736

		var Router = React.createClass({

			getInitialState: function () {

  			  return { component: '<div />'};
 		 	},



  			componentDidMount: function () {

  				var _this = this;
   		 		this.props.routes.forEach(function (route) {

      				var url = route[0];
      				var Component = route[1];

<<<<<<< HEAD
     				page(url, function (ctx) {

						document.getElementById('left-side-bar').style.display = 'block';
						document.getElementById('wrapper').style.display = 'block';

=======

     				page(url, function (ctx) {
     				   console.log(ctx.params)
>>>>>>> 92d5aea750da3981c4a9fe724732b3383d1c8736
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
 		 ['/', PopularNow],
<<<<<<< HEAD
 		 ['/popular-now',PopularNow],
 		 ['/most-recent',MostRecent],
 		 ['/search/:queryText', SearchView],
 		 ['/login', LoginView]
=======
 		 ['/search/:queryText', SearchView]
>>>>>>> 92d5aea750da3981c4a9fe724732b3383d1c8736
	];

	React.renderComponent(<Header />, document.getElementById('header'));

	React.renderComponent(<LeftSideBar />,  document.getElementById('left-side-bar'));

	React.renderComponent(<Router routes={routes} />, document.getElementById('right-side-bar'));

		
    }, ROOT);

};
