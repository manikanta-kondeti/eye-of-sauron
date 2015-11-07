'use strict'

var React = require('react');
var Datatable = require('../../components/Datatables');
var config = require('../../config');
var RedButton = require('./../../components/RedButton');
var LoadingSpinner = require('./../../components/LoadingSpinner');
var page = require('page');

module.exports = React.createClass({

    getInitialState: function(){
        /*
        * 'clickedNext' is used to keep track whether the next button is clicked.
        */
        return {users: null, cursor: null, loading: true}
    },

    componentDidMount: function() {
 
        var _this = this;
        $.get(config.ajax_url + '/dashboard_get_tracked_users', function(response) {
            _this.setState({users: response.users, loading: false});
        });
    },


    /**
     * Aprrove function takes clicked voice object as input
     */
    logs: function(object) {

        var _this = this;

        var key = object['key'];
        this.setState({loading: true});
        page('/admin/dashboard/view_user_log_entity/'+key);
    },

    render: function() {

        var RightSideBarStyle = {
            position: 'absolute',
            marginLeft: '240px',
            top: '60px',
            bottom: '0px',
            display: 'block',
            padding: '9px',
            width: 'auto'
        }

        var prevButtonStyle = {
            width:'80px', 
            height: '40px',
            marginTop: '5px',
            float: 'left',
            padding: '10px'
        }

        var nextButtonStyle = {
            width:'80px', 
            height: '40px',
            marginTop: '5px',
            float: 'left',
            padding: '10px'
        }
        var DropdownStyle = {
            float: 'left',
            marginLeft: '20px'
 
        }
        var modalStyle = {
            display: 'none',
            marginLeft: '15px'
        }

        var editModalStyle = {
            display: 'none'
        }

        var titleStyle = {          
            marginLeft: '330px'
        }

        var ParagraphStyle = {
            padding: '14px'
        }

        /**
            loading spinner
        */
        if (this.state.loading){
            var loadingSpinner = <LoadingSpinner />
        }


        return (
            
         <div style={RightSideBarStyle}> 
            <div style={titleStyle}> <h3> TRACKED USERS LIST( Click on Logs to check the entire log )</h3></div> 
  
            {loadingSpinner}
            <Datatable 
                tags= {['updated_at', 'key', 'user_name', 'languages_set', 'score', 'email']} 
                actions={[{'name': 'Logs', 'function': this.logs, 'tag':'key'}]} 
                data = {this.state.users} />
         </div>


        )
    }
});
