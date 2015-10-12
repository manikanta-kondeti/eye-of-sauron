'use strict'

var React = require('react');
var Datatable = require('../../components/Datatables');
var Page = require('page');
var config = require('../../config');
var RedButton = require('./../../components/RedButton');
var RejectReasons = require('./rejectReasonUnapproved');

module.exports = React.createClass({

    getInitialState: function(){
        /*
        * 'clickedNext' is used to keep track whether the next button is clicked.
        */
        return {voices: null, cursor: null, prev_cursors: [null], clickedNext: false, open_modal: false, object: null}
    },

    componentDidMount: function() {
 
        var _this = this;
        $.get(config.ajax_url + '/dashboard_get_unapproved', function(response) {
            _this.setState({voices: response.voices, cursor: response.cursor});
        });
    },

    /**
     * Aprrove function takes clicked voice object as input
    */
    approve: function(object) {

        var _this = this;

        var key = object['key'];

        $.ajax({
             type:    "POST",
             url:     config.ajax_url + "/dashboard_post_unapproved",
             data:    {"expression_key": key,"approval_status": 1 },
            success: function(data) {

                var state_voices = _this.state.voices;

                var new_state_voices = []

                for (var i = 0; i < state_voices.length; i++) {
                    if (state_voices[i]['key'] != key) {
                        new_state_voices.push(state_voices[i]);
                    }
                }

                _this.setState({
                    voices: new_state_voices
                });
                 alert(data['status']);
            },
            // vvv---- This is the new bit
            error: function(jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
    },

    openModal: function(object) {
        this.setState({open_modal: true, object: object});
    },

    closeModal: function() {
        this.setState({open_modal: false});
    },

    reject: function(reason) {
        var object = this.state.object;
        var key = object['key'];
  
        var _this = this;
        $.ajax({
             type:    "POST",
             url:     config.ajax_url + "/dashboard_post_unapproved",
             data:    {"expression_key": key,"approval_status": 2, "reject_reason": reason},
            success: function(data) {

                var state_voices = _this.state.voices;

                var new_state_voices = []

                for (var i = 0; i < state_voices.length; i++) {
                    if (state_voices[i]['key'] != key) {
                        new_state_voices.push(state_voices[i]);
                    }
                }

                _this.setState({
                    voices: new_state_voices
                });

                alert(data['status']);
            },
            // vvv---- This is the new bit
            error: function(jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });

    },


    edit: function(object) {
        var _this = this;
        var key = object['key'];

        window.open(config.ajax_url + '/admin/dashboard/edit_unapproved_clip/'+key);
    },

    handleClickNext: function() {
        var _this =  this;
        var prev_cursors_array = this.state.prev_cursors;
        prev_cursors_array.push(this.state.cursor);
        var prev_cursors_length = this.state.prev_cursors.length;
 
        $.get(config.ajax_url + '/dashboard_get_unapproved',{cursor: this.state.cursor} ,function(response) { 
            _this.setState({voices: response.voices, cursor: response.cursor, prev_cursors: prev_cursors_array, clickedNext: true});
        });
    },

    handleClickPrev: function() {
        var _this =  this;
        var back_pointer = 1;
        if (this.state.clickedNext){
            back_pointer = 2;
        }
        var prev_cursors_length = this.state.prev_cursors.length;
        var prev_cursor = this.state.prev_cursors[prev_cursors_length - back_pointer];
        var prev_cursors_array = this.state.prev_cursors.slice(0, prev_cursors_length - back_pointer);
        $.get(config.ajax_url + '/dashboard_get_unapproved',{cursor: prev_cursor} ,function(response) { 
            _this.setState({voices: response.voices, cursor: prev_cursor, prev_cursors: prev_cursors_array, clickedNext: false});
        });
    },

    render: function() {

        var RightSideBarStyle = {
            position: 'absolute',
            marginLeft: '200px',
            top: '60px',
            bottom: '0px',
            display: 'block',
            padding: '9px',
            width: 'auto'
        }

        var prevButtonStyle = {
            width:'100px', 
            height: '50px',
            marginTop: '5px',
            float: 'left',
            padding: '10px'
        }

        var nextButtonStyle = {
            width:'100px', 
            height: '50px',
            marginTop: '5px',
            float: 'left',
            padding: '10px'
        }

        var modalStyle = {
            display: 'none'
        }

        if(this.state.open_modal) {
            modalStyle['display'] = 'block';
        }

        return (
            
         <div style={RightSideBarStyle}> 
            <div style={prevButtonStyle} onClick={this.handleClickPrev}> <RedButton text = "<<Back"/> </div>
            <div style={nextButtonStyle} onClick={this.handleClickNext}> <RedButton text = "Next>>"/> </div>
            <Datatable 
                tags= {['transcript','tags','poster_url','language','mp3_url','opus_url', 'key']} 
                actions={[{'name': 'approve', 'function': this.approve, 'tag': 'key'}, {'name': 'Reject', 'function': this.openModal, 'tag':'key'}, {'name': 'Edit', 'function': this.edit, 'tag':'key'}]} 
                data = {this.state.voices} />
            <div style={prevButtonStyle} onClick={this.handleClickPrev}> <RedButton text = "<<Back"/> </div>
            <div style={nextButtonStyle} onClick={this.handleClickNext}> <RedButton text = "Next>>"/> </div>
            <div style={modalStyle}> <RejectReasons reject={this.reject} close_modal={this.closeModal} /> </div>

         </div>


        )
    }
});
