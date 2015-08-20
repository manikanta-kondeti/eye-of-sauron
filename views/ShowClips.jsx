'use strict'

var React = require('react');
var Clip = require('../components/showClip');


module.exports = React.createClass({

	render: function() {

		var showClipsStyle = {
			overflow: 'hidden'
		}

		if(this.props.clips) {

			var clips = this.props.clips.map(function(data, index) {
			
				return <Clip data={data} key={index} />
			});
		}

		return (

				<div style={showClipsStyle} id="show-clips">
					{clips}
 				</div>
		)
	}

});