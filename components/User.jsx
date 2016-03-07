var React = require('react');
var Bootstrap = require('react-bootstrap');
var {Button} = Bootstrap;

module.exports = React.createClass({
	getInitialState : function(){
		return{}
	},

	render : function(){
		var styles = {
			imageStyle : {
				width : '100px',
				height : '100px',
				borderRadius : '20px',
			},

			divStyle : {
				margin : '5px',
				padding: '5px',
				width : 'auto'
			},

			nameStyle : {
				fontSize : '15px',
				width : '100px',
				fontFamily : 'serif',
				textAlign : 'center',
				
			}
		}
		
		if (this.props.params.selected == true) {
			
			styles.divStyle['padding'] = '20px',
			styles.imageStyle['borderRadius'] = '150px',
			styles.imageStyle['width'] = '300px',
			styles.imageStyle['height'] = '300px',
			
			/*
			styles.imageStyle['transition'] = 'all 0.6s',
			styles.imageStyle['transform'] = 'scale(3)';
			styles.imageStyle['borderRadius'] = '150px',
			styles.imageStyle['marginTop'] = ''
			
			-webkit-transition: opacity 3s ease-in-out;
		    -moz-transition: opacity 3s ease-in-out;
		    -ms-transition: opacity 3s ease-in-out;
		    -o-transition: opacity 3s ease-in-out;
		     opacity: 1;
			*/
			styles.imageStyle['WebkitTransition'] = 'opacity 3s ease-in-out',
			styles.imageStyle['MozTransition'] = 'opacity 3s ease-in-out',
			styles.imageStyle['MsTransition'] = 'opacity 3s ease-in-out',
			styles.imageStyle['OTransition'] = 'opacity 3s ease-in-out',
			styles.imageStyle['opacity'] = '1',
			styles.imageStyle['boxShadow'] = '0px 1px 10px #888888',

			styles.nameStyle['fontSize'] = '25px',
			styles.nameStyle['fontWeight'] = '400',
			styles.nameStyle['width'] = '300px',
			styles.nameStyle['textAlign'] = 'center',
			styles.nameStyle['textShadow'] = '0.1px 0.1px 0.1px #888888'
		}
		return (
			<div style={styles.divStyle}>
					<img style={styles.imageStyle} src={this.props.params.poster_url}> </img>
					<div style={styles.nameStyle}>{this.props.params.username}</div>
					<hr/>
			</div>

		)
	}
})