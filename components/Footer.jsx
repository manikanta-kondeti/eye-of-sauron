'use strict'
var React = require('react');
var Radium = require('radium');
var {StyleRoot} = Radium;

var Footer = React.createClass({
	getInitialState : function() {
		return {}
	},

	render : function() {
		var styles = {
			footerDivStyle : {
				width : '400px',
				height : '100px',
				margin : '0 auto'
			},

			ulStyle : {
				display : 'inline-block'
			}
		}
		return(
			<StyleRoot>
				<footer>
					<div style={styles.footerDivStyle}>
						<ul style={styles.ulStyle}>
							<li> About us </li>
							<li> Privacy </li>
						</ul>
					</div>
				</footer>
			</StyleRoot>
		)
	}
});

class FooterWithMediaQueries extends React.Component{
	render() {
    	return (
      		<StyleRoot>
      			<Footer />
      		</StyleRoot>
    	);
  	}
}

module.exports = Radium(FooterWithMediaQueries);