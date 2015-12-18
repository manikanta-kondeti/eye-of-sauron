'use strict'

var React = require('react');
var Datatable = require('../../components/Datatables');
var Page = require('page');
var config = require('../../config');
var RedButton = require('./../../components/RedButton');
var RejectReasons = require('./rejectReasonUnapproved');
var EditUnapprovedClip = require('./editActorMovie.jsx');
var LoadingSpinner = require('./../../components/LoadingSpinner');

module.exports = React.createClass({

    getInitialState: function(){
        /*
        * 'clickedNext' is used to keep track whether the next button is clicked.
        */
        return {voices: null, cursor: null, loading: true, prev_cursors: [null], more: false, pageCount: 1, clickedNext: false, open_modal: false, object: null, isTypeQuery: false, isLanguageQuery: false, edit_key: null}
    },

    componentDidMount: function() {
 
        var _this = this;
        $.get(config.ajax_url + '/dashboard_get_actor_movie_entities', {type: "actor"},function(response) {
            _this.setState({voices: response.voices, loading: false, cursor: response.cursor, more: response.more});
        });
    },

    /**
       This method will execute the query and update voice and other variable in the state.
    */
    executeQueryWithCursor: function(language, type, cursor, page_count, prev_cursors_array, clicked_next) {
        var _this = this;
        console.log("isLanguageQuery = "+this.state.isLanguageQuery+" isTypeQuery = "+this.state.isTypeQuery);
        if (this.state.isLanguageQuery && !this.state.isTypeQuery) {
            $.get(config.ajax_url + '/dashboard_get_actor_movie_entities', {cursor: cursor, language: language, type: type}, function(response) { 
                _this.setState({voices: response.voices, loading: false, cursor: response.cursor, pageCount: page_count, prev_cursors: prev_cursors_array, clickedNext: clicked_next});
            });
        }
        else if (this.state.isTypeQuery && !this.state.isLanguageQuery) {
            $.get(config.ajax_url + '/dashboard_get_actor_movie_entities', {cursor: cursor, language: language, type: type}, function(response) { 
                _this.setState({voices: response.voices, loading: false, cursor: response.cursor, pageCount: page_count, prev_cursors: prev_cursors_array, clickedNext: clicked_next});
            });
        }
        else if (this.state.isTypeQuery && this.state.isLanguageQuery) {
            $.get(config.ajax_url + '/dashboard_get_actor_movie_entities', {cursor: cursor, language: language, type: type}, function(response) { 
                _this.setState({voices: response.voices, loading: false, cursor: response.cursor, pageCount: page_count, prev_cursors: prev_cursors_array, clickedNext: clicked_next});
            });
        }
        else if (!this.state.isTypeQuery && !this.state.isLanguageQuery) {
            $.get(config.ajax_url + '/dashboard_get_actor_movie_entities', {cursor: cursor, language: language, type: type}, function(response) { 
                _this.setState({voices: response.voices, loading: false, cursor: response.cursor, pageCount: page_count, prev_cursors: prev_cursors_array, clickedNext: clicked_next});
            });
        }

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
        var entity_type = $('#type').val();
        this.setState({edit_key: key});
    },

    closeModalEdit: function() {
        console.log('close modal');
        this.setState({edit_key: null});
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
        var language = $('#language').val();
        var type = $('#type').val();
        var prev_cursors_array = this.state.prev_cursors.slice(0, prev_cursors_length - back_pointer);
        var clicked_next = false;
        this.executeQueryWithCursor(language, type, prev_cursor, page_count, prev_cursors_array, clicked_next);

    },

    /**
        This filter helps in querying enitites based on language  
        @params: language
        @return:
            response['voices']
    */
    getByLanguage: function() {
        var _this = this;
        console.log("Query by language");
        this.setState({loading: true});
        var language = $('#language').val();
        var type = $('#type').val();

        $.get(config.ajax_url + '/dashboard_get_actor_movie_entities', {language: language, type: type }, function(response) { 
            _this.setState({voices: response.voices, loading: false, cursor: response.cursor, pageCount: 1, prev_cursors: [null], clickedNext: false});
        });
    },


    /**
        This filter helps in querying entities based on expression type(audio, quote, photo)
        @params: type
        @return:
            response['voices']
    */
    getByEntityType: function() {
        var _this = this;
        this.setState({loading: true, isTypeQuery: true});
        var type = $('#type').val();
        var language = $('#language').val();
        $.get(config.ajax_url + '/dashboard_get_actor_movie_entities', {language: language, type: type }, function(response) { 
            _this.setState({voices: response.voices, loading: false, cursor: response.cursor, pageCount: 1, prev_cursors: [null], clickedNext: false});
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
            <div style={titleStyle}> <h3> Actors, Movies </h3></div> 
            <div style={prevButtonStyle} onClick={this.handleClickPrev}> <RedButton text = "<<Back"/> </div>
            <div style={nextButtonStyle} onClick={this.handleClickNext}> <RedButton text = "Next>>"/> </div>
            <div>
                <p style={ParagraphStyle}> Page no: {page_count} ,   Total entities on this page: {length} </p> 
        
                    <select style={DropdownStyle} id="language" name="language" onChange={this.getByLanguage}>
                        <option value="All">All</option>
                        <option value="telugu">telugu</option>
                        <option value="tamil">tamil</option>
                        <option value="hindi">hindi</option>
                        <option value="kannada">kannada</option>
                        <option value="malayalam">malayalam</option>
                    </select>

                    <select style={DropdownStyle} id="type" name="type" onChange={this.getByEntityType}>
                        <option value="actor">Actor</option>
                        <option value="movie">Movie</option>
                    </select>
            </div>
            {loadingSpinner}
            <Datatable 
                tags= {['key', 'display_name','full_name','tags','poster_url','primary_languages','is_associated_with_an_expression', 'key', 'created_at']} 
                actions={[{'name': 'Edit', 'function': this.openModalEdit, 'tag':'key'}]} 
                data = {this.state.voices} />
            <div style={prevButtonStyle} onClick={this.handleClickPrev}> <RedButton text = "<<Back" /> </div>
            <div style={nextButtonStyle} onClick={this.handleClickNext}> <RedButton text = "Next>>" /> </div>
            <div style={modalStyle}> <RejectReasons reject={this.reject} close_modal={this.closeModal} /> </div>
            <div style={editModalStyle}> {edit_approved_clip_modal} </div>
         </div>


        )
    }
});
