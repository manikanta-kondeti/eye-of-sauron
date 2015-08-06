'use strict'

var React = require('react');
var Datatable = require('../../components/Datatables');

module.exports = React.createClass({

	getInitialState: function() {
		return {voices: null, search_result:true, queryText:null}
	},


    componentWillReceiveProps: function() {
   		this.setState({search_result: true})
    },

   search_by_tags: function() {

  		if(this.state.queryText) {
  		  var _this = this
  		  gapi.client.samosa.api.get_search_results({'tags': this.state.queryText}).execute(
            function(resp){             	

            	_this.setState({voices: resp.voices, search_result: false})
            });
  		}

  		else{
  			return 'No Videos Found with this tag :( !'
  		}
	},
    
    keyup: function(e) {
    	if(e.keyCode === 13) {
    		this.setState({queryText: e.target.value})
    	}
    },

    add_buttons: function() {

    	console.log('hi');

    },
 
	render: function() {

		if(this.state.search_result) {
			{this.search_by_tags()}
		}

		var RightSideBarStyle = {
			position: 'absolute',
			marginLeft: '200px',
			top: '60px',
			bottom: '0px',
			display: 'block',
			padding: '9px',
			width: 'auto'
		}

		var button = '<button> Click me ! </button>' ;

		return (

				<div style = {RightSideBarStyle}>
					<input onKeyUp={this.keyup} placeholder="search by tags"/>
					<Datatable 
						tags= {['caption','hearts','duration','language','listens','shares']} 
						data={this.state.voices} 
						buttons
					/>
				</div>
				
		)
	}
});