'use strict'

var React = require('react');
var Datatable = require('../../components/Datatables');
var config = require('../../config');
var RedButton = require('./../../components/RedButton');
var LoadingSpinner = require('./../../components/LoadingSpinner');

module.exports = React.createClass({

    getInitialState: function(){
        /*
        * 'clickedNext' is used to keep track whether the next button is clicked.
        */
        return {log_entities: null, user: null, cursor: null, prev_cursors: [null], clickedNext: false, pageCount: 1, loading: true, more: true}
    },

    componentDidMount: function() {
        
        var _this = this;
        $.get(config.ajax_url + '/dashboard_get_user_log_entity', {user_id : this.props.params['key']} ,function(response) {
            _this.setState({log_entities: response.results, cursor: response.cursor, more: response.more, loading: false});
        });

        $.get(config.ajax_url + '/dashboard_get_user_entity', {user_id : this.props.params['key']} ,function(response) {
            _this.setState({user: response.results[0]});
        });
    },


    handleClickNext: function() {
        var _this =  this;
        var page_count = this.state.pageCount;
        page_count += 1;
        // enable loading 
        this.setState({loading: true});
        var prev_cursors_array = this.state.prev_cursors;
        prev_cursors_array.push(this.state.cursor);
        var prev_cursors_length = this.state.prev_cursors.length;
 
        $.get(config.ajax_url + '/dashboard_get_user_log_entity',{user_id : this.props.params['key'], cursor: this.state.cursor} ,function(response) { 
            _this.setState({log_entities: response.results, cursor: response.cursor, more: response.more, loading: false, prev_cursors: prev_cursors_array, pageCount: page_count, clickedNext: true});
        });
    },

    handleClickPrev: function() {
        var _this =  this;
        var back_pointer = 1;
        var page_count = this.state.pageCount;
        if (this.state.clickedNext){
            back_pointer = 2;
        }
        page_count -= 1;
        // enable loading 
        this.setState({loading: true});
        var prev_cursors_length = this.state.prev_cursors.length;
        var prev_cursor = this.state.prev_cursors[prev_cursors_length - back_pointer];
        var prev_cursors_array = this.state.prev_cursors.slice(0, prev_cursors_length - back_pointer);
        $.get(config.ajax_url + '/dashboard_get_user_log_entity',{user_id : this.props.params['key'], cursor: prev_cursor} ,function(response) { 
            _this.setState({log_entities: response.results, cursor: prev_cursor, loading: false, more: response.more, pageCount: page_count, prev_cursors: prev_cursors_array, clickedNext: false});
        });
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

        var textStyle = {
            width:'250px', 
            height: '20px',
            marginLeft: '320px',
            padding: '10px'
        }

        var titleStyle = {          
            marginLeft: '320px'
        }
        // Loading spinner component
        if (this.state.loading){
            var loadingSpinner = <LoadingSpinner />
        }

        // Remove back and next based on page count 
        if (this.state.pageCount == 1){
            prevButtonStyle['display'] = 'none'
        }
        if (this.state.more == false || this.state.cursor == null){
            nextButtonStyle['display'] = 'none'
        }
        if (this.state.more == true){
            nextButtonStyle['display'] = 'block'
        }
        if (this.state.log_entities){
            var items_on_this_page = this.state.log_entities.length; 
        }
        if (this.state.log_entities){
            var page_count_text = <p style={{marginTop: '100px'}}>Page: {this.state.pageCount}, Total entities on this page: <b>{this.state.log_entities.length}</b> </p>
        }

        // User data
        var user_key, user_name, tracked_type;
        if (this.state.user != null){
            user_key = this.state.user.key;
            tracked_type = config.tracked_type[this.state.user.tracked_type];
            user_name = this.state.user.user_name;

            console.log("user "+this.state.user.key)

        }
        return (
        
         <div style={RightSideBarStyle}> 
            <div style={titleStyle}> <h3>USER LOG ENTITY</h3></div>
            <div>
                Userid: <b>{user_key}</b> 
                <br/>
                Username: <b>{user_name} </b>
                <br/>
                Tracked type: <b>{tracked_type}</b>
            </div> 
            <div style={prevButtonStyle} onClick={this.handleClickPrev}> <RedButton text = "<<Back"/> </div>
            <div style={nextButtonStyle} onClick={this.handleClickNext}> <RedButton text = "Next>>"/> </div>
            {loadingSpinner}
            <div>
                {page_count_text}
            </div>
            <Datatable 
                tags= {['created_at', 'endpoint_name',  'installation_key', 'user_key', 'updated_at', 'params' ]}
                data = {this.state.log_entities} />
            <div style={prevButtonStyle} onClick={this.handleClickPrev}> <RedButton text = "<<Back"/> </div>
            <div style={nextButtonStyle} onClick={this.handleClickNext}> <RedButton text = "Next>>"/> </div>
         </div>


        )
    }
});
