/** @jsx React.DOM */

'use strict'

var React = require('react');
var ShowClips = require('./ShowClips');
var InputField = require('../components/InputField');

module.exports = React.createClass({

    getInitialState: function() {

        return({ voices: [], search_cursor: '', search: false, popular_cursor: ''})
    },

    componentDidMount: function() {

        $("body").css("background-color", "white");

        var _this = this;
        window.setInterval(function() { 

                    if(!_this.state.search) {
                        _this.popular_now();
                    }
                    else {
                        console.log('search')
                        _this.search_by_tags();
                    }

                    var iScroll = $(window).scrollTop();
                    iScroll = iScroll + 234;

                    if(Sound.paused)
                    {
                        $("html, body").animate({ scrollTop: iScroll }, 1000);
                    }
        }, 5000);

        this.popular_now();


    },

    search_by_tags: function(searched) {

        var queryText = $('#samosa_search').val();

        if(queryText) {
          var _this = this;

          var cursor = ""

          searched? cursor = "" : cursor = this.state.search_cursor   

          gapi.client.samosa.api.get_search_results({'tags': queryText, 'cursor': cursor}).execute(
            function(resp) {
                var voices = resp.voices

                var only_voices = voices.filter(function(voice) {
                    return voice['type'] == 0;
                });

                if(!_this.state.search || searched) {
                    var new_voices = only_voices;    
                }
                
                else {
                     var new_voices = _this.state.voices.concat(only_voices);       
                }

                _this.setState({voices: new_voices, search_cursor: resp.cursor, search: true})
            });
        }

        else{
            return 'No Videos Found with this tag :( !'
        }
    },

    popular_now: function() {
        var _this = this;
        var popularr_voices = gapi.client.samosa.api.expressions.popular({'cursor': this.state.popular_cursor}).execute(
        function(resp) {
                var new_voices = _this.state.voices.concat(resp.voices);
                _this.setState({voices: new_voices, popular_cursor: resp.cursor, search: false});
            });
    },

    getDocHeight: function() {
        var D = document;
        return Math.max(
            Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
            Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
            Math.max(D.body.clientHeight, D.documentElement.clientHeight)
        );  
    },

    keyup: function(e){
        if(e.keyCode == 13) {
            this.search_by_tags(true);
        }
    },

    render: function() {

        var footerWrapper = {
            bottom: '0px',
            position: 'fixed',
            width: '92%',
            left: '4%',
            height: '12%',
            background: 'black',
            opacity: '0.7'
        }

        var footer = {
            width: '52%',
            height: '100%',
            margin: '0px auto',
            cursor: 'pointer',
         }

         var container = {
            width: '92%',
            margin: '54px auto',
            boxShadow: '-1px 0px 9px 1px rgba(0,0,0,0.24)',
            height: 'auto'
         }

         var seachBoxStyle = {
            zIndex: '100',
            top: '0px',
            background: '#eee',
            width: '98%',
            padding: '1%',
            position: 'fixed'
         }

         var wrapper  = {

         }

        var searchBox =  {
                width: '100%',
                height: '95%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #eee',
                boxSizing : 'border-box'
        }

        return( 
            <div style={wrapper} >
                <div style = {seachBoxStyle}>
                        <input style={searchBox} onKeyUp = {this.keyup} id="samosa_search" placeholder="Search for Clips" />
                </div>

                <div style={container}>
                     <div style={{ marginTop: '50px', margin: '0px auto'}} id="samosa_clips">
                        <ShowClips clips = {this.state.voices} />
                    </div>
                </div>
                <div style={footerWrapper}>
                    <div style={footer}>
                         <img width="100%"  height="100%" src = "static/images/powered_by_samosa.png"/>
                    </div>
                </div>
            </div>
        )
    }

});