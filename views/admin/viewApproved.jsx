'use strict'

var React = require('react');
var Datatable = require('../../components/Datatables');

module.exports = React.createClass({

    getInitialState: function(){
        return {voices: null, popular_now: true}
    },

    componentDidMount: function() {
        var _this = this;
        $.get('/test.json', function(response){
            _this.setState({voices: response.voices});
        });
    },

    approve: function(key) {

        var state_voices = this.state.voices;

        var new_state_voices = []

        for(var i=0; i< state_voices.length; i++) {
            if(state_voices[i]['key'] != key){
                new_state_voices.push(state_voices[i]);
            }
        }

        this.setState({voices: new_state_voices});
    },

    reject: function() {

    },

    handleOnClick: function() {

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
            <button name="next" onClick={this.handleOnClick}> Next </button>
            <br/>
            <Datatable 
                tags= {['transcript','hearts','duration','language','listens','shares','poster_url','mp3_url']} 
                actions={[{'name': 'approve', 'function': this.approve, 'tag': 'key'}, {'name': 'Reject', 'function': this.reject, 'tag':'key'}]} 
                data = {this.state.voices} />
         </div>

        )
    }
});