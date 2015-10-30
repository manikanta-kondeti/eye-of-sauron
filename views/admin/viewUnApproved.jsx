'use strict'

var React = require('react');
var Datatable = require('../../components/Datatables');
var Page = require('page');
var config = require('../../config');
var RedButton = require('./../../components/RedButton');
var RejectReasons = require('./rejectReasonUnapproved');
var EditUnapprovedClip = require('./editUnapprovedClip');
var LoadingSpinner = require('./../../components/LoadingSpinner');

module.exports = React.createClass({

    getInitialState: function(){
        /*
        * 'clickedNext' is used to keep track whether the next button is clicked.
        */
        return {voices: null, cursor: null, loading: true, prev_cursors: [null], more: false, pageCount: 0, clickedNext: false, open_modal: false, object: null, edit_key: null}
    },

    componentDidMount: function() {
 
        var _this = this;
        $.get(config.ajax_url + '/dashboard_get_unapproved', function(response) {
            _this.setState({voices: response.voices, loading: false, cursor: response.cursor, more: response.more});
        });
    },

    setNewVoices: function(key) {
        var state_voices = this.state.voices;
        var new_state_voices = [];

        for (var i = 0; i < state_voices.length; i++) {
            if (state_voices[i]['key'] != key) {
                new_state_voices.push(state_voices[i]);
            }
        }

        this.setState({voices: new_state_voices});
    },

    /**
     * Aprrove function takes clicked voice object as input
    */
    approve: function(object) {

        var _this = this;

        var key = object['key'];
        this.setState({loading: true});
        $.ajax({
             type:    "POST",
             url:     config.ajax_url + "/dashboard_post_unapproved",
             data:    {"expression_key": key,"approval_status": 1 },
            success: function(data) {

                 _this.setNewVoices(key);
                _this.setState({loading: false});
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


    openModalEdit: function(object) {
        var key = object['key'];
        console.log('open modal');
        this.setState({edit_key: key});
    },

    closeModalEdit: function() {
        console.log('close modal');
        this.setState({edit_key: null});
    },


    reject: function(reason) {
        var object = this.state.object;
        var key = object['key'];
        this.setState({loading: true});
        var _this = this;
        $.ajax({
             type:    "POST",
             url:     config.ajax_url + "/dashboard_post_unapproved",
             data:    {"expression_key": key,"approval_status": 2, "reject_reason": reason},
            success: function(data) {

                _this.setNewVoices(key);
                _this.setState({loading: false});
                alert(data['status']);
            },
            // vvv---- This is the new bit
            error: function(jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });

    },

    handleClickNext: function() {
        var _this =  this;
        var prev_cursors_array = this.state.prev_cursors;
        prev_cursors_array.push(this.state.cursor);
        var prev_cursors_length = this.state.prev_cursors.length;
        var page_count = this.state.pageCount + 1;
        this.setState({loading: true});
        $.get(config.ajax_url + '/dashboard_get_unapproved',{cursor: this.state.cursor} ,function(response) { 
            _this.setState({voices: response.voices, loading: false, cursor: response.cursor, pageCount: page_count, prev_cursors: prev_cursors_array, clickedNext: true});
        });

    },

    handleClickPrev: function() {
        var _this =  this;
        var back_pointer = 1;
        if (this.state.clickedNext){
            back_pointer = 2;
        }
        var page_count = this.state.pageCount - 1;
        var prev_cursors_length = this.state.prev_cursors.length;
        var prev_cursor = this.state.prev_cursors[prev_cursors_length - back_pointer];
        this.setState({loading: true});
        var prev_cursors_array = this.state.prev_cursors.slice(0, prev_cursors_length - back_pointer);
        $.get(config.ajax_url + '/dashboard_get_unapproved',{cursor: prev_cursor} ,function(response) { 
            _this.setState({voices: response.voices, loading: false, cursor: prev_cursor, pageCount: page_count, prev_cursors: prev_cursors_array, clickedNext: false});
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

        var modalStyle = {
            display: 'none'
        }

        var editModalStyle = {
            display: 'none'
        }

        var titleStyle = {          
            marginLeft: '330px'
        }

        if(this.state.open_modal) {
            modalStyle['display'] = 'block';
        }

        if(this.state.edit_key) {
            editModalStyle['display'] = 'block';
            var edit_approved_clip_modal =  <EditUnapprovedClip edit_key={this.state.edit_key} remove_clip={this.setNewVoices} close_modal={this.closeModalEdit} />
        }
        else {
            var edit_approved_clip_modal = ""
        }

        // Hiding next and prev buttons
        if ( this.state.more == false || this.state.voices < 500){
            nextButtonStyle['display'] = 'none'
        }
        if (this.state.pageCount == 0){
            prevButtonStyle['display'] = 'none'
        }   
        var length;
        if (this.state.voices){
            var length = this.state.voices.length;
        }
        else{
            var length = 0;            
        }


        /**
            loading spinner
        */
        if (this.state.loading){
            var loadingSpinner = <LoadingSpinner />
        }

        return (
            
         <div style={RightSideBarStyle}> 
            <div style={titleStyle}> <h3>USER UPLOADED CONTENT ( Approve or Reject )</h3></div> 
            <div style={prevButtonStyle} onClick={this.handleClickPrev}> <RedButton text = "<<Back"/> </div>
            <div style={nextButtonStyle} onClick={this.handleClickNext}> <RedButton text = "Next>>"/> </div>
            <p> Total entities on this page: {length}</p>
            {loadingSpinner}
            <Datatable 
                tags= {['transcript','tags','poster_url','language','mp3_url','opus_url', 'key', 'user_key', 'created_at']} 
                actions={[{'name': 'Reject', 'function': this.openModal, 'tag':'key'}, {'name': 'Edit', 'function': this.openModalEdit, 'tag':'key'}]} 
                data = {this.state.voices} />
            <div style={prevButtonStyle} onClick={this.handleClickPrev}> <RedButton text = "<<Back"/> </div>
            <div style={nextButtonStyle} onClick={this.handleClickNext}> <RedButton text = "Next>>"/> </div>
            <div style={modalStyle}> <RejectReasons reject={this.reject} close_modal={this.closeModal} /> </div>
            <div style={editModalStyle}> {edit_approved_clip_modal} </div>
         </div>


        )
    }
});
