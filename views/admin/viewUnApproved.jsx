'use strict'

var React = require('react');
var Datatable = require('../../components/Datatables');
var Page = require('page');

module.exports = React.createClass({

    getInitialState: function(){
        return {voices: null, cursor: null}
    },

    componentDidMount: function() {
        console.log('componentDidMount');
        var _this = this;
        $.get('https://the-tasty-samosa.appspot.com/dashboard_get_unapproved', function(response) {
            _this.setState({voices: response.voices, cursor: response.cursor});
        });
    },

    /**
     * Aprrove function takes clicked voice object as input
    */
    approve: function(object) {

        var _this = this;

        var key = object['key'];

        console.log(key);
        console.log(object);
        $.ajax({
             type:    "POST",
             url:     "https://the-tasty-samosa.appspot.com/dashboard_post_unapproved",
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

    reject: function(object) {
        var _this = this;
        var key = object['key'];
        console.log(key);
        console.log(object);   
        $.ajax({
             type:    "POST",
             url:     "https://the-tasty-samosa.appspot.com/dashboard_post_unapproved",
             data:    {"expression_key": key,"approval_status": 2 },
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
        console.log(key);
        console.log(object);   

        Page('/admin/dashboard/edit_unapproved_clip/'+key);

    },

    handleClickNext: function() {
        var _this =  this;
        $.get('https://the-tasty-samosa.appspot.com/dashboard_get_unapproved',{cursor: this.state.cursor} ,function(response) { 
            _this.setState({voices: response.voices, cursor: response.cursor});
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

        return (
            
         <div style={RightSideBarStyle}> 
            <button onClick={this.handleClickNext}>NEXT</button>
            <Datatable 
                tags= {['transcript','hearts','duration','language','listens','shares','poster_url','mp3_url']} 
                actions={[{'name': 'approve', 'function': this.approve, 'tag': 'key'}, {'name': 'Reject', 'function': this.reject, 'tag':'key'}, {'name': 'Edit', 'function': this.edit, 'tag':'key'}]} 
                data = {this.state.voices} />
         </div>

        )
    }
});
