'use strict'

var React = require('react')
var ShowClips = require('./ShowClips')

module.exports = React.createClass({

   componentWillReceiveProps: function() {
        this.setState({search_result: true})
   },

   search_by_key: function() {

    var clip = { 
        'audio_name': "VJj8Mxe75O-lera-le",
        'caption': "lera-le",
        'created_at': "2015-06-03T16:36:28.126034",
        'duration': "9",
        'hearts': "992",
        'language': "telugu",
        'listens': "91979",
        'mp3_url': "http://storage.googleapis.com/samosa_app_files/audio/mp3/VJj8Mxe75O-lera-le.mp3",
        'opus_url': "http://storage.googleapis.com/samosa_app_files/audio/opus/VJj8Mxe75O-lera-le.opus",
        'poster_url': "http://storage.googleapis.com/samosa_app_files/poster/VJj8Mxe75O-lera-le.jpg",
        'shares': "4959",
        'tags': ['comedy','action']
    }

        this.setState({voices: clip, search_result: false});
    },
    
    getInitialState: function() {
        return {voices: null, search_result:true}
    },

    render: function() {

        if(this.state.search_result) {
            console.log('hi');
            {this.search_by_key()}
        }
        else {
            console.log(this.state.voices)
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

                <div style = {RightSideBarStyle}>
                    <ShowClips clips = {this.state.voices} />
                </div>
        )
    }
});