'use strict'

var React = require('react');
var Datatable = require('../../components/Datatables');

module.exports = React.createClass({

    popular_now: function() {
    var _this = this
      var popular_voices = gapi.client.samosa.api.expressions.popular_by_rank().execute(
      function(resp) {
                _this.setState({voices: resp.voices, popular_now: false})
            });
    },

    getInitialState: function(){
        return {voices: null, popular_now: true}
    },

    render: function() {

        if(this.state.popular_now) {
            this.popular_now()
        }

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
            <Datatable tags= {['caption','hearts','duration','language','listens','shares','thumbnail_url']} data = {this.state.voices} />
         </div>

        )
    }
});