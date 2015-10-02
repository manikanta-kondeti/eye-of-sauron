/** @jsx React.DOM */

'use strict'

window.init = function() {
     
    var ROOT = 'https://the-tasty-samosa.appspot.com/_ah/api';
    gapi.client.load('samosa', 'v1', function() {

        var React = require('react');
        var page = require('page');


        var Header = require('./views/Header');
        var AdminLeftSideBar = require('./views/admin/AdminLeftSideBar');       
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
      
     ['/admin/dashboard/view_clips', viewClips],
     ['/admin/dashboard/get_push_notif_id/:keys', getPushNotificationId],
     ['/admin/dashboard', viewUnApproved],
     ['/admin/dashboard/:view-approved', viewApproved],
     ['/admin/dashboard/create_push_notification', createPushNotification],
     ['/admin/dashboard/edit_clip/:key', editClip],
     ['/admin/dashboard/edit_unapproved_clip/:key', editUnapprovedClip],
     ['/admin/dashboard/add_relationship', addRelationShip],
     ['/admin/dashboard/add_new_actor_movie', addNewActorMovie],
     ['/admin/dashboard/view_counter_entities', viewCounterEntities]

    ];

    React.render(<Router routes={routes} />, document.getElementById('right-side-bar'));
        
    }, ROOT);

};
