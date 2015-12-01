/** @jsx React.DOM */
'use strict'

var React = require('react');
var Datatable = require('../../components/Datatables');
var Page = require('page');
var config = require('../../config');
var RedButton = require('./../../components/RedButton');
var RejectReasons = require('./rejectReasonUnapproved');
var LoadingSpinner = require('./../../components/LoadingSpinner');
/* For loading channels */
var Autocomplete = require('react-autocomplete');

module.exports = React.createClass({

    getInitialState: function(){
        /*
        * 'clickedNext' is used to keep track whether the next button is clicked.
        */
        return {voices: null, loading: true, prev_cursors: [null], more: false, pageCount: 1, clickedNext: false, open_modal: false, object: null, edit_key: null, channels: [], channel_id : null}
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
    /**
     * TODO: 1. Auto complete for channels, 2. On submit load that channel clips, 3. Remove expression from a channel(Hanlder)   
     */


    /**
     * [handleKeyUpChannels fetchs channel suggestions to implement auto-complete]
     * @param  {[string]} value [the value of the input field onChange]
     * @return {[null]}       [sets state]
     */
    handleKeyUpChannels: function(value) {

        var _this = this;

        gapi.client.samosa.api.get_actor_suggestions({value: value}).execute(function(resp) {

            var values = resp['values'];

            var value_dict = values.map(function(value){
                return {'name': value}
            })

            _this.setState({actors: value_dict});
        });
    },

    handleClickNext: function() {
        var _this =  this;
        var prev_cursors_array = this.state.prev_cursors;
        prev_cursors_array.push(this.state.cursor);
        var prev_cursors_length = this.state.prev_cursors.length;
        var page_count = this.state.pageCount + 1;
        this.setState({loading: true});
        var language = $('#language').val();
        var type = $('#type').val();
        var clicked_next = true;
        this.executeQueryWithCursor(language, type, this.state.cursor, page_count, prev_cursors_array, clicked_next);

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
        var type = $('#expresion_type').val();
        var prev_cursors_array = this.state.prev_cursors.slice(0, prev_cursors_length - back_pointer);
        var clicked_next = false;
        this.executeQueryWithCursor(language, type, prev_cursor, page_count, prev_cursors_array, clicked_next);

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

        var inputChannelFieldStyle = {
            float: 'left',
            width: '600px',
            height: 'auto',
            margin : '10px'
        }

        var prevButtonStyle = {
            width:'80px', 
            marginTop: '5px',
            marginBottom: '10px',
            padding: '10px'
        }

        var nextButtonStyle = {
            width:'80px', 
            marginTop: '5px',
            marginBottom: '10px',
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
            marginLeft: '330px',
            padding: '10px',
            float: 'left'
        }

        var topElementsStyle = {
            float: 'left',
            margin: '5px',
        }

        var ParagraphStyle = {
            padding: '14px'
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

        if(this.state.open_modal) {
            modalStyle['display'] = 'block';
        }

        // Hiding next and prev buttons
        if ( this.state.more == false || this.state.voices.length < 100){
            nextButtonStyle['display'] = 'none'
        }
        if (this.state.pageCount == 1){
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

        var page_count = this.state.pageCount;

        return (
            
         <div style={RightSideBarStyle}> 
            <div style={titleStyle}> 
                <h3> CHANNELS EDITORIAL (Remove from) channel</h3>
                <div style={inputChannelFieldStyle}>
                    <div style={topElementsStyle}>
                        Channel name:
                        <Autocomplete
                            ref="channel"
                            getItemValue={(item) => item.name}
                            items={this.state.channels}
                            onChange={(event, value) => {
                                this.handleKeyUpChannels(value);
                            }}
                            renderItem={(item, isHighlighted) => (
                                <div
                                style={isHighlighted ? highlightedItem : item}
                                >{item.name}</div>
                            )} />
                    </div>
                    <input type="button" onClick={this.getChannel} value="submit" />
                </div>
            </div>

            {loadingSpinner}
            <Datatable 
                tags= {['transcript','tags','poster_url','language','mp3_url','opus_url', 'key', 'user_key', 'created_at']} 
                actions={[{'name': 'Remove', 'function': this.openModal, 'tag':'key'}]} 
                data = {this.state.voices} />
         </div>


        )
    }
});


