'use strict'

var React = require('react');
var Datatable = require('../../components/Datatables');
var config = require('../../config');
var RedButton = require('./../../components/RedButton');

module.exports = React.createClass({

    getInitialState: function(){
        /*
        * 'clickedNext' is used to keep track whether the next button is clicked.
        */
        return {voices: null, cursor: null, prev_cursors: [null], clickedNext: false}
    },

    componentDidMount: function() {
 
        var _this = this;
        $.get(config.ajax_url + '/dashboard_get_search_query_frequency', function(response) {
            _this.setState({voices: response.results, cursor: response.cursor});
        });
    },


    handleClickNext: function() {
        var _this =  this;
        var prev_cursors_array = this.state.prev_cursors;
        prev_cursors_array.push(this.state.cursor);
        var prev_cursors_length = this.state.prev_cursors.length;
 
        $.get(config.ajax_url + '/dashboard_get_search_query_frequency',{cursor: this.state.cursor} ,function(response) { 
            _this.setState({voices: response.results, cursor: response.cursor, prev_cursors: prev_cursors_array, clickedNext: true});
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
        $.get(config.ajax_url + '/dashboard_get_search_query_frequency',{cursor: prev_cursor} ,function(response) { 
            _this.setState({voices: response.results, cursor: prev_cursor, prev_cursors: prev_cursors_array, clickedNext: false});
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


        return (
            
         <div style={RightSideBarStyle}> 
            <div style={prevButtonStyle} onClick={this.handleClickPrev}> <RedButton text = "<<Back"/> </div>
            <div style={nextButtonStyle} onClick={this.handleClickNext}> <RedButton text = "Next>>"/> </div>
            <Datatable 
                tags= {['created_at','search_query','type','value','search_tags']}
                data = {this.state.voices} />
            <div style={prevButtonStyle} onClick={this.handleClickPrev}> <RedButton text = "<<Back"/> </div>
            <div style={nextButtonStyle} onClick={this.handleClickNext}> <RedButton text = "Next>>"/> </div>
         </div>


        )
    }
});
