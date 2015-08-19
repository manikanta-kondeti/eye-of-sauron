'use strict'

var React = require('react');
var AudioPlayer = require('../components/AudioPlayer');
var ShowClips = require('./ShowClips');
var OgMetaTags = require('./OgMetaTags');
var InputField = require('../components/InputField');


var showClip = React.createClass({

    getInitialState: function() {
        return({related_voices: [], iframe_width:0, iframe_height:0, preview_url: false})
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

        this.refs.preview_url.getDOMNode().value="<iframe src='https://dashboard-dev-dot-the-tasty-samosa.appspot.com/embed/"+this.props.voice.key+"' width='"+iframe_width+"' height='"+
                                                 iframe_height+ "' border='0' scrolling='no' frameBorder='0'></iframe>";

        this.setState({
                iframe_height: iframe_height,
                iframe_width: iframe_width,
                preview_url: true
            })
    },

    render: function() {

        var poster_url = this.props.voice.poster_url;

        var imgStyle = {
            position: 'relative',
            backgroundImage: 'url('+ poster_url +')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            height: '355px',
            overflow: 'hidden'
        }

        var socialIconsStyle = {
            marginTop: '9px',
            width: '370px',
            borderBottom: '1px solid #e8e8e8',
            height: '30px'
        }

        var iconStyle = {
            marginRight: '4px',
            float: 'left',
            width: '15px'
        }

        var iconFontStyle = {
            lineHeight: '12px',
            float: 'left',
            fontSize: '13px',
            marginTop: '2px'
        }

        var heartsStyle = {
            float: 'left',
            textAlign: 'center',
            margin: '5px'
        }

        var sharesStyle = {
            float: 'left',
            textAlign: 'center',
            margin: '5px'
        }

        var boxStyle ={
            float: 'left',
            background: 'white',
            border: '1px solid #e8e8e8',
            padding:'5px',  
        }

        var captionStyle = {
            paddingTop: '10px',
            paddingBottom: '10px',
            width: '370px',
            fontSize: '21px',
        }

        var relatedVideosStyle = {
            float: 'right',
            width: "500px",
            background : 'white',
            height: '100%',
            border: '1px solid #e8e8e8',
            padding: '10px'

        }

        var tagsStyle = {
            float: 'left'
        }

        var tagsFontStyle = {
            float:'left',
            margin: '12px',
            width:'300px'
        }

        var tags = this.props.voice.tags.reduce(function(previousValue, currentValue) {
              return previousValue + ', ' + currentValue;  
        });

        var previewUrlStyle = {
            display: 'none',   
            width:'350px'
        }

        if(this.state.preview_url){
            previewUrlStyle['display'] = 'block'
        }

        var iframe_src = "/embed/"+this.props.voice.key

        return (
        <div>
          <div style={boxStyle}>

            <div style={imgStyle}>
                        <AudioPlayer
                            opusURL={this.props.voice.opus_url}
                            mp3URL={this.props.voice.mp3_url}
                            frameWidth={370}
                            frameHeight={355}
                            controlSize={10} />
            </div>
             <div style={captionStyle}>
                {this.props.voice.transcript}                       
                <div style={socialIconsStyle}> 
                        <div style={heartsStyle}>
                        <img style={iconStyle} src="/static/images/heart.png" />
                        <span style={iconFontStyle}> {this.props.voice.hearts} </span>
                    </div>
                    <div style={sharesStyle}>
                        <img style={iconStyle}  src="https://d3pl14o4ufnhvd.cloudfront.net/v2/uploads/67b846c5-9b77-4a95-a2dd-d693142ec62c/248efd9e468170fdaec1a1025760c23f0fe3adaa_original.png" />
                        <span style={iconFontStyle}> {this.props.voice.shares} </span>
                    </div>
                 </div>
             </div>

             <div style={tagsStyle}>
                <img src = "http://iconizer.net/files/IconSweets_2/orig/tags.png" /> 
             </div>
             <div style={tagsFontStyle}> {tags} </div>
            
             Embed Clip: <hr/>
             
             <input placeholder="width" ref="iframe_width" />
             <input placeholder="height" ref="iframe_height"  />
             <button onClick={this.handleIframeSubmit}>Preview</button><br/>
             <br/>
             Preview Url: <hr/>

             <div style={previewUrlStyle}>
               <InputField ref="preview_url" placeholder = "preview url" />
             </div>

             <br/>

            <iframe src={iframe_src} width={this.state.iframe_width} height={this.state.iframe_height} border="0" scrolling="no" frameBorder="0"></iframe>
       

          </div>

          <div style={relatedVideosStyle}>
            RELEATED VIDEOS <hr/>
                <ShowClips clips = {this.state.related_voices} />
          </div>    

        </div>
        )
      }
});


module.exports = React.createClass({

    getInitialState: function() {
        return {voice: null, search_result:true, related_voices: []}
    },

    componentDidMount: function(){
        this.search_by_key();
    },

    componentDidUpdate: function() {
      
    },


    search_by_key: function() {
       var _this = this;
       console.log(this.props.params.key);

       //Here response is a single voice object
       gapi.client.samosa.api.get_expression_by_key({'id': this.props.params.key}).execute(
            function(resp){
                    console.log(resp);
                    _this.setState({voice: resp});
                });

    },

    render: function() {

        var RightSideBarStyle = {
            position: 'absolute',
            marginLeft: '20%',
            top: '60px',
            bottom: '0px',
            display: 'block',
            padding: '9px',
            width: '78%'
        }

        if(this.state.voice){
            var Clip = <showClip voice={this.state.voice}/>
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