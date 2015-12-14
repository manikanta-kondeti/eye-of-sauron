/** @jsx React.DOM */

'use strict'

window.init = function() {
     
    var ROOT = 'https://the-tasty-samosa.appspot.com/_ah/api';
    gapi.client.load('samosa', 'v1', function() {

        var React = require('react');
        var page = require('page');

        var Header = require('./views/Header');
        var PartnersLeftSideBar = require('./views/admin/PartnersLeftSideBar');       
        var viewPopularNow = require('./views/admin/viewPopularNow');
        var viewApproved = require('./views/admin/viewApproved');   
        var viewUnApproved = require('./views/admin/viewUnApproved');
        var createPushNotification = require('./views/admin/createPushNotification');
        var getPushNotificationId = require('./views/admin/getPushnotificationId');
        var viewClips = require('./views/admin/viewClips');
        var editClip = require('./views/admin/editClip');
        var editUnapprovedClip = require('./views/admin/editUnapprovedClip');
        var addRelationShip = require('./views/admin/addRelationShip')
        var addNewActorMovie = require('./views/admin/addNewActorMovie')
        var viewCounterEntities = require('./views/admin/viewCounterEntities');
        var viewUserQueryNoResults = require('./views/admin/viewUserQueryNoResults');
        var viewSearchQueryFrequency = require('./views/admin/viewSearchQueryFrequency');
        var viewRejected = require('./views/admin/viewRejected');
        var viewTrackedUsers = require('./views/admin/viewTrackedUsers');
        var viewUserLogEntity = require('./views/admin/viewUserLogEntity');
        var removeFromChannel = require('./views/admin/removeFromChannel.jsx');
        var addToChannel = require('./views/admin/addToChannel.jsx');
        var addNewChannel = require('./views/admin/addNewChannel.jsx');
        var addNewExpression = require('./views/admin/addNewExpression.jsx');
        var viewInstructions = require('./views/partners/viewInstructions.jsx');

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
         ['/partners/dashboard/editClip/:key', editClip]
    ];

    React.render(<Router routes={routes} />, document.getElementById('right-side-bar'));
        
    }, ROOT);

};
