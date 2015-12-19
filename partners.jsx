/** @jsx React.DOM */

'use strict'

window.init = function() {
     
    var ROOT = 'https://the-tasty-samosa.appspot.com/_ah/api';
    gapi.client.load('samosa', 'v1', function() {

        var React = require('react');
        var page = require('page');
        var Header = require('./views/HeaderPartners');
        var PartnersLeftSideBar = require('./views/admin/PartnersLeftSideBar');
        /**
         * Views served for partners
         */
        var viewClips = require('./views/partners/editExpressions');
        var editClip = require('./views/admin/editClip');
        var removeFromChannel = require('./views/partners/removeFromChannel.jsx');
        var addToChannel = require('./views/partners/addToChannel.jsx');
        var addNewChannel = require('./views/partners/addNewChannel.jsx');
        var addNewExpression = require('./views/admin/addNewExpression.jsx');
        var viewInstructions = require('./views/partners/viewInstructions.jsx');
        var updateChannel = require('./views/partners/updateChannel.jsx');

        var Router = React.createClass({

            getInitialState: function () {
             console.log("Partners ");
              return { component: 'Error'};
            },

            componentDidMount: function () {

                var _this = this;
                this.props.routes.forEach(function (route) {

                var url = route[0];
                var Component = route[1];
    
                page(url, function (ctx) {

                  var regex = new RegExp('/partners/dashboard', 'gi');
                 
                  if(url.match(regex)) {
                        React.render(<Header search={false} login={false}/>, document.getElementById('header'));
                        React.render(<PartnersLeftSideBar />,  document.getElementById('left-side-bar'));  
                  }

                  else { 
                   //Only admin has left side bar 
                    $('#left-side-bar').html('');

                    if(url == "/" || url =="/popular-now" || url =="" || url=="/most-recent") {
                        React.render(<HeaderHome />, document.getElementById('header'));
                    }                 

                    else if(url == "/popular-now-iframe") {
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
         ['/partners/dashboard/create_new_channel', addNewChannel],
         ['/partners/dashboard/upload_an_expression', addNewExpression],
         ['/partners/dashboard/view_clips', viewClips],
         ['/partners/dashboard/edit_clip/:key', editClip],
         ['/partners/dashboard/remove_from_channel', removeFromChannel],
         ['/partners/dashboard/add_to_channel', addToChannel],
         ['/partners/dashboard/add_new_channel', addNewChannel],
         ['/partners/dashboard', viewInstructions],
         ['/partners/dashboard/edit_clip/:key', editClip],
         ['/partners/dashboard/update_channel', updateChannel]
    ];

    React.render(<Router routes={routes} />, document.getElementById('right-side-bar'));
        
    }, ROOT);

};
