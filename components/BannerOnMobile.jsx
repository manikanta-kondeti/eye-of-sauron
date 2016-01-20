'use strict'
var React = require('react');
var Radium = require('radium');
var {StyleRoot} = Radium;
var Logo = require('../components/Image');
var ChannelSubscribeButton = require('../components/ChannelSubscribeButton')

var Banner = React.createClass({
	getInitialState : function() {
		return {}
	},

	render : function() {
		var styles = {
			banner: {
				display : 'none',
				'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {
					display : 'block',
					width: '100%',
					height: '130px',
					backgroundColor: '#262626',
					marginTop: '90px'
				}
			},

			titleStyle : {
				display : 'none',
				'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {
					display : 'block',
					fontSize : '40px',
					marginTop : '20px'
				}
			},

			logoStyle : {
				display : 'none',
				'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {
					display : 'block',
					float : 'left',
					margin: '10px',
					padding: '5px'
				}
			},

			taglineStyle : {
				display : 'none',
				'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {
					display : 'block',
					fontSize : '24px'
				}
			},

			descriptionStyle :{
				display : 'none',
				'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {
					display : 'block',
					float: 'left',
					color : 'white'
				}
			},

			installButtonStyle : {
				display : 'none',
				'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {	
					display : 'block',
					float: 'right',
					marginRight: '25px',
					padding : '30px',
					width: '150px',
					height: '75px'
				}
			},

			openAppButtonStyle : {
				display : 'none',
				'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {	
					display : 'block',
					float: 'right',
					marginRight: '25px',
					padding : '30px',
					width: '220px',
					height: '75px'
				}
			},

			buttonStyle : {
				mozBoxShadow: 'inset 0 0 0 4px #fff',
				webkitBoxShadow: 'inset 0 0 0 4px #fff',
				boxShadow: 'inset 0 0 0 4px #fff',
				backgroundColor: '#262626',
				display: 'inline-block',
				cursor: 'pointer',
				color: 'white',
				fontSize: '30px',
				fontWeight: '500',
				padding: '4px',
				textDecoration: 'none',
				border: 'white',
				width: '100%',
				height: '100%'
			}
		}

		// OpenAppUrl : Get the window.location.url and split it 
		var OpenAppUrl = null;
		if (window.location.pathname != null) {
				OpenAppUrl = "samosa:/" + window.location.pathname;
		}

		return(
			<StyleRoot>
        		<div style={styles.banner}>
        			<div style={styles.logoStyle}>
        				<Logo src="https://lh5.ggpht.com/oJpCSXfyxWeLDSM8GKN-SHyv8ZK29pF2NURecNkK1aQD_9mH0ZYscux07oNPgxog28RU=w300" width="100" height="100"/>
        			</div>
        			<div style={styles.descriptionStyle}>
        				<div style={styles.titleStyle}>
        					<span> Samosa </span>
        				</div>
        				<div style={styles.taglineStyle}>
        					<span> Find it for free on Playstore </span>
        				</div>
        			</div>
        			<div style={styles.installButtonStyle}>
        				<a href="http://getsamosa.com">
        					<button style={styles.buttonStyle}> INSTALL </button>
        				</a>
        			</div>
        			<div style={styles.openAppButtonStyle}>
        				<a href={OpenAppUrl}>
        					<button style={styles.buttonStyle}> OPEN IN APP </button>
        				</a>
        			</div>
        		</div>
        	</StyleRoot>
		)
	}
});

class BannerWithMediaQueries extends React.Component{
	render() {
    	return (
      		<StyleRoot>
      			<Banner />
      		</StyleRoot>
    	);
  	}
}

module.exports = Radium(BannerWithMediaQueries);