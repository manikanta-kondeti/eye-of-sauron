/** @jsx React.DOM */

'use strict'

var React = require('react')

var List = require('./List')

module.exports = React.createClass({

	render: function() {

		var LeftSideBarStyle = {
			position: 'fixed',
			background: 'white',
			height: '100%',
    		left: '0', 
    		top: '60px',
    		bottom: '0',
    		display: 'block',
			width: '200px',
			borderRight: '1px solid #e8e8e8'		
		}

		var data = [
			{name: 'Trending Now', url: 'popular-now', image_url:'https://www.kewlcircle.com/assets/images/trending.png'},
			{name: 'Most Recent', url: 'most-recent', image_url:'http://www.tablespoon.com/-/media/Images/Landing%20Page%20Icons/icon-recent.png'}
		]

		var downloadIcons = {
			paddingTop: '10px',
			margin: '10px',
			border: '1px solid #e8e8e8',
			padding: '20px'
		}

		return (

				<div style = {LeftSideBarStyle}>
				    <List data = {data} />	
					<div style={downloadIcons}>

					Available In <hr/><br/>

						<a href="https://play.google.com/store/apps/details?id=com.getsamosa"> 
				 		 <img width="100" src="https://www.gstatic.com/android/market_images/web/play_logo_x2.png" />
				 		</a><br/> <br/>
				 		<a href ="https://itunes.apple.com/in/app/samosa-chat/id973054666?mt=8">
				 		 <img width="100" src="http://www.yallatruck.com/wp-content/uploads/2014/08/apple-app-store-icon.jpg" />
						</a><br/><br/>
						<a href="https://www.microsoft.com/en-us/store/apps/samosa-chat/9nblggh0lcd0">	
							<img width="100" src="https://i-msdn.sec.s-msft.com/dynimg/IC795460.png" />
						</a><br/><br/>	
						<a href ="https://chrome.google.com/webstore/detail/samosa/acghjnlbnackkloofkiebcicedbfipbg?hl=en">
				 		 <img width="100" src="https://www.mailvelope.com/img/ChromeWebStore_Badge_v2_340x96.png" />
				 		</a>
					</div>
				</div>
		)
	}

});