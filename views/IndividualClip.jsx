'use strict'

var React = require('react');
var AudioPlayer = require('../components/AudioPlayer');
var ShowClips = require('./ShowClips')
var InputField = require('../components/InputField');
var Clip = require('../components/showClip');

var showClip = React.createClass({

    getInitialState: function() {
        return({related_voices: [], iframe_width:0, iframe_height:0, preview_clip: false})
    },

    componentDidMount: function() {
      var _this = this
      var popular_by_rank = gapi.client.samosa.api.expressions.popular_by_rank().execute(
      function(resp) {
                _this.setState({related_voices: resp.voices})
            });
    },

    handleIframeSubmit: function() {

        var iframe_height = this.refs.iframe_height.getDOMNode().value;
        var iframe_width = this.refs.iframe_width.getDOMNode().value;

        if(!iframe_width){
            iframe_width = 0
        }
        if(!iframe_height) {
            iframe_height=0
        }

        this.refs.preview_url.getDOMNode().value="<iframe src='https://app-dot-the-tasty-samosa.appspot.com/embed/"+this.props.data.key+"' width='"+iframe_width+"' height='"+
                                                 iframe_height+ "' border='0' scrolling='no' frameBorder='0'></iframe>";

         this.setState({
                iframe_height: iframe_height,
                iframe_width: iframe_width,
                preview_clip: true
            })
     },

    render: function() {

        var boxStyle ={
            position: 'fixed',
            float: 'left',
            background: 'white',
            border: '1px solid #e8e8e8',
            padding:'5px', 
            width: '41%' 
        }


        var relatedVideosStyle = {
            float: 'right',
            background : 'white',
            height: 'auto',
            border: '1px solid #e8e8e8',
            padding: '10px',
            width: '47%'
        }

        var tagsStyle = {
            float: 'left'
        }

        var tagsFontStyle = {
            float:'left',
            margin: '12px',
            width: '40%'
        }

        var tags = this.props.data.tags.reduce(function(previousValue, currentValue) {
              return previousValue + ', ' + currentValue;  
        });

        var previewUrlStyle = {  
            width:'90%',
            height: '55px'
        }

        var iframeBlockStyle = {
            width: '100%',
            float: 'left',
            padding: '5px',
            display: 'none'
        }

        var embedClipStyle = {
            width: '60%',
            float: 'left',
            marginLeft: '2%',
            marginTop: '11%',
        }

        if(this.state.preview_clip){
            iframeBlockStyle['display'] = 'block'
        }

        var iframe_src = "/embed/"+this.props.data.key

        return (
        <div>
          <div style={boxStyle}>


             <Clip data={this.props.data} />

             <div style={tagsStyle}>
                <img src = "http://iconizer.net/files/IconSweets_2/orig/tags.png" /> 
             </div>
             <div style={tagsFontStyle}> {tags} </div>
                

            <div style ={embedClipStyle}>
                Embed Clip: <hr/>
             
                <input placeholder="width" ref="iframe_width" />
                <input placeholder="height" ref="iframe_height"  />
                <input value="Get Preview !" type="submit" onClick={this.handleIframeSubmit} />
             </div>

            <div style={iframeBlockStyle}>
                Preview Url: <hr/>
                <div style={previewUrlStyle}>
                    <InputField ref="preview_url" placeholder = "preview url" />
                </div>
                <br/>
                <iframe src={iframe_src} width={this.state.iframe_width} height={this.state.iframe_height} border="0" scrolling="no" frameBorder="0"></iframe>
            </div>
          </div>  
          <div style={relatedVideosStyle}>
             RELATED CLIPS <hr/>
             <ShowClips clips = {this.state.related_voices} />
          </div>    

        </div>
        )
      }
});


module.exports = React.createClass({

    getInitialState: function() {
        return {voice: null}
    },

    componentDidMount: function(){
        this.search_by_key(this.props.params.key);
    },

    componentWillReceiveProps: function(newProps, oldProps) {
        this.search_by_key(newProps.params.key);
    },

    search_by_key: function(key) {
       var _this = this;
       //Here response is a single voice object
       gapi.client.samosa.api.get_expression_by_key({'id': key}).execute(
            function(resp){
                    _this.setState({voice: resp});
                });
    },

    render: function() {

        var RightSideBarStyle = {
            position: 'absolute',
            marginLeft: '200px',
            top: '70px',
            bottom: '0px',
            display: 'block',
            padding: '9px',
            width: '83%'
        }

        if(this.state.voice) {
            var Clip = <showClip data={this.state.voice}/>
        }

        return (
            <div>
                <div style = {RightSideBarStyle}>
                     {Clip}
                </div>
            </div>
        )
    }
});