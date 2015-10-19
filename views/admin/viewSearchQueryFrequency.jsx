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
        return {voices: null, cursor: null, prev_cursors: [null], clickedNext: false, queryType: 0, totalValue: 0, pageCount: 1, loading: true, more: false}
    },

    componentDidMount: function() {
 
        var _this = this;
        $.get(config.ajax_url + '/dashboard_get_search_query_frequency',{query_type: this.state.queryType}, function(response) {
            var total_value = _this.countValue(response.results);
            _this.setState({voices: response.results, more: response.more, cursor: response.cursor, totalValue: total_value,loading: false});
        });
    },

    countValue: function(array){
        var value = 0;
        var obj;
        for (var i=0;i<array.length;i++) {;
            obj = array[i];
            value += obj['value'];
        }   
        return value;
    },

    handleClickNext: function() {
        var _this =  this;
        var page_count = this.state.pageCount;
        page_count += 1;
        var prev_cursors_array = this.state.prev_cursors;
        prev_cursors_array.push(this.state.cursor);
        var prev_cursors_length = this.state.prev_cursors.length;
        this.setState({loading:true});
        $.get(config.ajax_url + '/dashboard_get_search_query_frequency',{cursor: this.state.cursor, query_type: this.state.queryType} ,function(response) { 
            var total_value = _this.countValue(response.results);
            _this.setState({voices: response.results, loading: false,cursor: response.cursor, totalValue: total_value, more: response.more, prev_cursors: prev_cursors_array, pageCount: page_count,clickedNext: true});
        });
    },

    handleClickPrev: function() {
        var _this =  this;
        var back_pointer = 1;
        var page_count = this.state.pageCount;
        page_count -= 1;
        this.setState({loading:true});
        if (this.state.clickedNext){
            back_pointer = 2;
        }
        var prev_cursors_length = this.state.prev_cursors.length;
        var prev_cursor = this.state.prev_cursors[prev_cursors_length - back_pointer];
        var prev_cursors_array = this.state.prev_cursors.slice(0, prev_cursors_length - back_pointer);
        $.get(config.ajax_url + '/dashboard_get_search_query_frequency',{cursor: prev_cursor, query_type: this.state.queryType} ,function(response) { 
            var total_value = _this.countValue(response.results);
            _this.setState({voices: response.results, loading: false,cursor: prev_cursor, totalValue: total_value, more: response.more, pageCount: page_count, prev_cursors: prev_cursors_array, clickedNext: false});
        });
    },
    /*
    *   handleSubmit function will take a parameter and send a query to the dashboard, retrieve all the results.
    *   @params: queryType, cursor.
    */
    handleSubmit: function() {
        var _this = this;
        //Get the value from select box
        var query_type = $('select[name=query_types]').val();
        var input_box_value = $('input[name=textbox]').val();
        this.setState({loading:true});
        if (query_type == this.state.queryType && this.state.queryType != 4){
            $.get(config.ajax_url + '/dashboard_get_search_query_frequency',{query_type: query_type} ,function(response) { 
                var total_value = _this.countValue(response.results);
                _this.setState({queryType: query_type, voices: response.results, cursor: response.cursor, totalValue: total_value, more: response.more, prev_cursors: [null], clickedNext: false, loading: false, pageCount: 1});
            });
        }
        else if (this.state.queryType == 4){
            $.get(config.ajax_url + '/dashboard_get_search_query_frequency',{query_type: query_type, search_value: input_box_value} ,function(response) { 
                var total_value = _this.countValue(response.results);
                _this.setState({queryType: query_type, voices: response.results, totalValue: total_value, cursor: response.cursor, more: response.more, prev_cursors: [null], clickedNext: false, loading: false, pageCount: 1});
            });
        }
        else if (query_type != this.state.queryType){
            $.get(config.ajax_url + '/dashboard_get_search_query_frequency',{query_type: query_type} ,function(response) { 
                var total_value = _this.countValue(response.results);
                _this.setState({queryType: query_type, voices: response.results, totalValue: total_value, cursor: response.cursor, more: response.more, prev_cursors: [null], clickedNext: false, loading: false, pageCount: 1});
            });
        }
    },

    /*
    *   addTextBox function will trigger when there is a change on text box   
    *   @params: queryType, cursor.
    */
    addTextBox: function() {
        var query_type = $('select[name=query_types]').val();
        if (query_type == 4){
            this.setState({queryType : query_type});
        }

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

        var dropDownStyle = {
            float: 'left',
            margin: '20px',
            width : '150px'
        }

        var submitStyle = {
            width : '50px',
            height : '25px'
        } 

        var QueryTextStyle = {
            float: 'left',
            marginLeft: '100px',
            position: 'relative'
        }

        var titleStyle = {          
            marginLeft: '330px'
        }

        /**
            To make sure back and next buttons are removed when there is no need for them to display
        */
        if (this.state.pageCount == 1){
            prevButtonStyle['display'] = 'none'
        }
        /**
        *  Hide next button when more is false 
        */
        if (this.state.more == false){
            nextButtonStyle['display']='none'
        }

        // Query types: Display
        var QueryTypeText = <p>Results displayed belongs to this query: <b> {config.query_text[this.state.queryType]} </b> </p>;
        if (this.state.loading){
            var loadingSpinner = <LoadingSpinner />
        }
        var tags_based_on_query_type;
        if (this.state.queryType in [0,1,2,3,4]){
            // query type is based on search query frequency
            tags_based_on_query_type = ['created_at','search_query','search_tags','type','value','updated_at']
        }
        if (this.state.voices){
            var page_count_text = <p style={{marginTop: '100px'}}>Page: <b>{this.state.pageCount}</b>,  Total entities on this page: <b>{this.state.voices.length}</b>, Total value: <b>{this.state.totalValue}</b></p>
        }

        /*
            Adding a text box when query type is Most queries search terms
        */
        if (this.state.queryType == 4){
            var input_text_box = <input type="text" name="textbox"></input>
        }
        else {
                    var input_text_box='';

        }
        return (
            
         <div style={RightSideBarStyle}> 
            <div style={titleStyle}> <h3>Queries on Search Query Frequency</h3></div> 
            <div style={prevButtonStyle} onClick={this.handleClickPrev}> <RedButton text = "<<back" /> </div>
            <div style={nextButtonStyle} onClick={this.handleClickNext}> <RedButton text = "next>>" /> </div>
            <div style={dropDownStyle}>
                <select name="query_types" onChange={this.addTextBox}>
                    <option value="0">Recent Search Queries</option>
                    <option value="1">Most searched queries</option>
                    <option value="2">Most searched queries with out results</option>
                    <option value="3">Most queries with spell corrected types</option>
                    <option value="4">Most queries search terms</option>
                </select>
                {input_text_box}
                <div style={submitStyle} onClick={this.handleSubmit}>
                    <RedButton text="submit" />
                </div>
            </div>
            <div style={QueryTextStyle}>
                {QueryTypeText}
            </div>
            
            {loadingSpinner}
            <div>
                {page_count_text}
            </div>
            <Datatable 
                tags= {tags_based_on_query_type}
                data = {this.state.voices} />
            <div style={prevButtonStyle} onClick={this.handleClickPrev}> <RedButton text = "<<back" /> </div>
            <div style={nextButtonStyle} onClick={this.handleClickNext}> <RedButton text = "next>>" /> </div>
         </div>


        )
    }
});
