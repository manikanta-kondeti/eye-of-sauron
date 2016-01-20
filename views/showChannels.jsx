'use strict'

var React = require('react');
var Channel = require('../components/showChannel');
var Radium = require('radium');
var {StyleRoot} = Radium;

var ShowChannels = React.createClass({

	render: function() {

		var showChannelsStyle = {
			overflow: 'hidden',
			marginTop : '20px',
			marginLeft : '135px',
			'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {
					marginLeft : '35px'
  			}
		}
		var channels = null;
		if(this.props.clips) {
			channels = this.props.clips.map(function(data, index) {
				return <Channel data={data} key={index} />
			});
		}

		return (
			<StyleRoot>
				<div style={showChannelsStyle} id="show-clips">
					{channels}
 				</div>
 			</StyleRoot>
		)
	}

});

class ShowChannelsWithMediaQuery extends React.Component {
	render() {
		return (
			<StyleRoot>
				<ShowChannels clips={this.props.clips}/>
			</StyleRoot>
		)
	}
}

module.exports = Radium(ShowChannelsWithMediaQuery);