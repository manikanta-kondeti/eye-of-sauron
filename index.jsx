/** @jsx React.DOM */

'use strict'

window.init = function() {
     
    var ROOT = 'https://the-tasty-samosa.appspot.com/_ah/api';
    gapi.client.load('samosa', 'v1', function() {


		var React = require('react');
		var page = require('page');

		var Header = require('./views/Header');
		var LeftSideBar = require('./views/LeftSideBar')
		var PopularNow = require('./views/PopularNow')
		var SearchView = require('./views/SearchView')

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
     				   console.log(ctx.params)
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
 		 ['/Popular-now',PopularNow],
 		 ['/search/:queryText', SearchView]
	];

	React.renderComponent(<Header />, document.getElementById('header'));

	React.renderComponent(<LeftSideBar />,  document.getElementById('left-side-bar'));

	React.renderComponent(<Router routes={routes} />, document.getElementById('right-side-bar'));

		
    }, ROOT);

};
