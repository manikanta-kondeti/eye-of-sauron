/** @jsx React.DOM */

'use strict'

window.init = function() {
     
    var ROOT = 'https://the-tasty-samosa.appspot.com/_ah/api';
    gapi.client.load('samosa', 'v1', function() {

        var React = require('react');
        var page = require('page');
        var config = require('./config');
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
        var viewUserQueryNoResults = require('./views/admin/viewUserQueryNoResults');
        var viewSearchQueryFrequency = require('./views/admin/viewSearchQueryFrequency');
        var viewRejected = require('./views/admin/viewRejected');
        var viewTrackedUsers = require('./views/admin/viewTrackedUsers');
        var viewUserLogEntity = require('./views/admin/viewUserLogEntity');
        var viewActorsMovies = require('./views/admin/viewActorsMovies.jsx');
        var removeFromChannel = require('./views/admin/removeFromChannel.jsx');
        var addToChannel = require('./views/admin/addToChannel.jsx');
        var addNewChannel = require('./views/admin/addNewChannel.jsx');
        var updateChannel = require('./views/admin/updateChannel.jsx');
        var channelGroups = require('./views/admin/channelGroups.jsx');
        var partnersPermissions = require('./views/admin/partnersPermissions.jsx');
        var Register = require('./views/admin/RegisterNewPartner.jsx');
        var NotificationTest = require('./views/admin/testPushNotification.jsx');
        var RedirectComponent = require('./components/RedirectComponent.jsx');

        var Router = React.createClass({

            getInitialState: function () {

              return { component: 'Component is not mounted on the page. Please contact Admin. Error'};
            },

            componentDidMount: function () {

                var _this = this;
                this.props.routes.forEach(function (route) {

                var url = route[0];
                var Component = route[1];
    
                page(url, function (ctx) {

                  var regex = new RegExp('/admin/dashboard', 'gi');
                  var regex_counter_entities = new RegExp('/admin/dashboard/view_counter_entities', 'gi')
                  if(url.match(regex) && !url.match(regex_counter_entities)) {
                        React.render(<Header search={false} login={false}/>, document.getElementById('header'));
                        React.render(<AdminLeftSideBar />,  document.getElementById('left-side-bar'));  
                  }
                  if(url.match(regex)) {
                        React.render(<Header search={false} login={false}/>, document.getElementById('header')); 
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
    
//     var redirectComponent = <RedirectComponent redirect_url={config.ajax_url+'/admins/dashboard/view_counter_entities'} />;
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
     ['/admin/dashboard/view_counter_entities', viewCounterEntities],
     ['/admin/dashboard/view_counter_entities_redirection', RedirectComponent],
     ['/admin/dashboard/view_user_query_no_results', viewUserQueryNoResults],
     ['/admin/dashboard/view_search_query_frequency',viewSearchQueryFrequency],
     ['/admin/dashboard/view_rejected', viewRejected],
     ['/admin/dashboard/view_tracked_users',viewTrackedUsers],
     ['/admin/dashboard/view_user_log_entity/:key', viewUserLogEntity],
     ['/admin/dashboard/view_actors_movies', viewActorsMovies],
     ['/admin/dashboard/remove_from_channel', removeFromChannel],
     ['/admin/dashboard/add_to_channel', addToChannel],
     ['/admin/dashboard/create_new_channel', addNewChannel],
     ['/admin/dashboard/update_channel', updateChannel],
     ['/admin/dashboard/channel_groups', channelGroups],
     ['/admin/dashboard/partners_permissions', partnersPermissions],
     ['/admin/dashboard/register_a_new_partner', Register],
     ['/admin/dashboard/test_push_notification', NotificationTest]
    ];

    React.render(<Router routes={routes} />, document.getElementById('right-side-bar'));
        
    }, ROOT);

};
