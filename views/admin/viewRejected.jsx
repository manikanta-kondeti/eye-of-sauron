'use strict'

var React = require('react');
var Datatable = require('../../components/Datatables');
var Page = require('page');
var config = require('../../config');
var RedButton = require('./../../components/RedButton');
var LoadingSpinner = require('./../../components/LoadingSpinner');

module.exports = React.createClass({

    getInitialState: function(){
        /*
        * 'clickedNext' is used to keep track whether the next button is clicked.
        */
        return {voices: null, cursor: null, prev_cursors: [null], more: false, loading: true, pageCount: 0, clickedNext: false, object: null, edit_key: null}
    },

    componentDidMount: function() {
 
        var _this = this;
        $.get(config.ajax_url + '/dashboard_get_rejected', function(response) {
            _this.setState({voices: response.voices, cursor: response.cursor, loading: false, more: response.more});
        });
    },


    handleClickNext: function() {
        var _this =  this;
        var prev_cursors_array = this.state.prev_cursors;
        prev_cursors_array.push(this.state.cursor);
        var prev_cursors_length = this.state.prev_cursors.length;
        var page_count = this.state.pageCount + 1;
        this.setState({loading: true});
        $.get(config.ajax_url + '/dashboard_get_rejected',{cursor: this.state.cursor} ,function(response) { 
            _this.setState({voices: response.voices, cursor: response.cursor,  loading: false, pageCount: page_count, prev_cursors: prev_cursors_array, clickedNext: true});
        });

    },

    handleClickPrev: function() {
        var _this =  this;
        var back_pointer = 1;
        if (this.state.clickedNext){
            back_pointer = 2;
        }
        this.setState({loading: true});
        var page_count = this.state.pageCount - 1;
        var prev_cursors_length = this.state.prev_cursors.length;
        var prev_cursor = this.state.prev_cursors[prev_cursors_length - back_pointer];
        var prev_cursors_array = this.state.prev_cursors.slice(0, prev_cursors_length - back_pointer);
        $.get(config.ajax_url + '/dashboard_get_rejected',{cursor: prev_cursor} ,function(response) { 
            _this.setState({voices: response.voices, loading: false, cursor: prev_cursor, prev_cursors: prev_cursors_array, pageCount: page_count, clickedNext: false});
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

        var titleStyle = {          
            marginLeft: '330px'
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
            <div style={titleStyle}> <h3> REJECTED CONTENT </h3></div> 
            <div style={prevButtonStyle} onClick={this.handleClickPrev}> <RedButton text = "<<Back"/> </div>
            <div style={nextButtonStyle} onClick={this.handleClickNext}> <RedButton text = "Next>>"/> </div>
            <p> Total entities on this page: {length}</p>
            {loadingSpinner}
            <Datatable 
                tags= {['transcript','tags','poster_url','language','mp3_url','opus_url', 'key', 'user_key', 'created_at']}
                data = {this.state.voices} />
            <div style={prevButtonStyle} onClick={this.handleClickPrev}> <RedButton text = "<<Back"/> </div>
            <div style={nextButtonStyle} onClick={this.handleClickNext}> <RedButton text = "Next>>"/> </div>
         </div>


        )
    }
});
