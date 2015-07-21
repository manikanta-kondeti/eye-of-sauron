/** @jsx React.DOM */

'use strict'

var React = require('react')


var ListItem = React.createClass({


    getDefaultProps: function() {
        return { isSelected: false};
    },

	getInitialState: function() {
		return  {hover_flag: false, isSelected: false}
	},

	hoverEvent: function() {
		this.setState({hover_flag: !this.state.hover_flag})
	},


	render: function() {

		var liStyle = {
			width: '100%',
			background: '#cc181e',
			height: '40px',
			textAlign: 'center',
			lineHeight: '40px',
			listStyleType: 'none',
			color: 'white',
			textTransform: 'uppercase',
			fontSize: '17px',
			marginBottom: '13px',
			cursor: 'pointer'
		}

        if (this.props.isSelected || this.state.hover_flag) {
            liStyle['background'] = '#ff7f7f';
        }

		return (
			<li onClick={this.props.click} onMouseEnter={this.hoverEvent} onMouseLeave={this.hoverEvent} style={liStyle} key={this.props.name}>{this.props.name}</li>
		)
	}

})


module.exports = React.createClass({

	getInitialState: function() {
		return{click_flag: null}

	},

	clickEvent: function(index) {
		this.setState({click_flag: index})
	},

	render: function() {

	    var ulStyle = {
	    	padding: '0px',
	    	margin: '20px'
	    }

		var link = {
			textDecoration: 'none',
			color: 'white',
			cursor: 'pointer'		
		}

		var _this = this
		var list = this.props.data.map(function(data, index) {

			var click_state = _this.state.click_flag === index

			return <ListItem click={_this.clickEvent.bind(_this, index)} isSelected={click_state} name={data.name} key={index}/>
		})

		return (
			
			<ul style={ulStyle}>
				{list}
			</ul>

		)
	}

});