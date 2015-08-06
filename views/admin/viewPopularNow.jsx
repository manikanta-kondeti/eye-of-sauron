'use strict'

var React = require('react');
var Datatable = require('../../components/Datatables');

module.exports = React.createClass({

    popular_now: function() {
    var _this = this
      var popular_voices = gapi.client.samosa.api.expressions.popular().execute(
      function(resp) {
                console.log(resp);
                _this.setState({voices: resp.voices, popular_now: false})
            });
    },

    getInitialState: function(){
        return {voices: null, popular_now: true}
    },

    action: function() {
        console.log('hie');
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
            <Datatable buttons={[{'action':this.action}]} tags= {['caption','language','shares','thumbnail_url','opus_url']} data = {this.state.voices} />
         </div>

        )
    }
});