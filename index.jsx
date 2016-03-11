/** @jsx React.DOM */

'use strict'

window.init = function() {
     
    var ROOT = 'https://the-eye-of-sauron.appspot.com/_ah/api';
    gapi.client.load('sauron', 'v1', function() {

		var React = require('react');
		var page = require('page');
    var Header = require('./views/Header');
    var HeaderAfterLogin = require('./views/HeaderAfterLogin');
    var ErrorPage = require('./components/ErrorPage');
    var Feed = require('./views/Feed');
    
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
                React.render(<Header />, document.getElementById('header'))
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
 		 ['', Feed],
     ['/feed', Feed]
	];

	React.render(<Router routes={routes} />, document.getElementById('right-side-bar'));
		
    }, ROOT);

};
