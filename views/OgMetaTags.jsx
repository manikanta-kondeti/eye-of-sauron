/** @jsx React.DOM */

'use strict'

var React = require('react');

var OGMetaTags = React.createClass({

  render: function() {

    var twitterURL = this.props.URL.replace('/play/', '/play/twitter/');
    twitterURL = twitterURL.replace(
      'http://app.getsamosa.com', 
      'https://app.getsamosa.com'
    );
    
    var imageURL = this.props.imageURL.replace("http://", "https://s3.amazonaws.com/");
    var source = null;
    if (source) {
      source = source.replace('http://', 'https://');
    }
    return (
      <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# samosa_clip: http://ogp.me/ns/fb/samosa_clip#">
        <meta property="fb:app_id" content="580678502050494" /> 
        <meta property="og:url" content={this.props.URL} />
        <meta property="og:type"   content="video.other" />
        <meta property="og:video:height" content="260" /> 
        <meta property="og:video:width" content="420" /> 
        <meta property="og:video:type" content="application/x-shockwave-flash" />
        <meta property="og:title" content="music" /> 
        <meta property="og:description" content={this.props.tags.join(' ')} />
        <meta property="og:image" content={this.props.imageURL} />
        <meta property="og:video" content={"http://samosa.parseapp.com/Main.swf?audio_file=" + this.props.mp3URL + "&image_file=" + this.props.imageURL + "&share_link=" + this.props.URL} /> 
        <meta property="og:video:secure_url" content={"https://samosa.parseapp.com/Main.swf?audio_file=" + this.props.mp3URL + "&image_file=" + this.props.imageURL + "&share_link=" + this.props.URL} /> 
        <meta property="twitter:site" content="@SamosaApp" />
        <meta property="twitter:image" content={imageURL} />
        <meta property="twitter:player" content={twitterURL} />
        <meta property="twitter:player:width" content="512" />
        <meta property="twitter:player:height" content="512" />
        <meta property="twitter:card" content="player" />
        <meta property="twitter:title" content={this.props.name} />
        <meta property="twitter:description" content={this.props.tags.join(' ')} />
        <meta property="twitter:app:name:googleplay" content="Samosa" />
        <meta property="twitter:app:id:googleplay" content="com.getsamosa" />
      </head>
    );
  }
});

module.exports = OGMetaTags;
