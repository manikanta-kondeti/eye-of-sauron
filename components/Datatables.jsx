/** @jsx React.DOM */
/**
	this.props.data = coloums of the table to be displayed
	this.props.tags = headings of the table and key values in the json file
**/
'use strict'

var React = require('react')
var InputField = require('./InputField');
var Img = require('./Image');
var BasicPlayer = require('./BasicPlayer');
var RedButton = require('./RedButton');

var tdItem = React.createClass({

	/**
	 * creates td items for the given data
	 */
	render: function() {

			var tdStyle = {
				textAlign: 'center',
				padding: '5px'
			}

			if(this.props.data) {

				var image_formats = ['png', 'jpg'];
				var audio_formats = ['opus', 'mp3'];
;


				if(image_formats.indexOf(this.props.data.split('.').pop())!= -1){
						var data =  <Img width="80" src={this.props.data} />
				}	
				else if(audio_formats.indexOf(this.props.data.split('.').pop())!= -1){
						var data =  <BasicPlayer src={this.props.data} />
				}	
				
				else{
					var data = this.props.data;
				}
			}

			return (
					<td style={tdStyle}>
						{data}
					</td>
				)
	}

 })



var trItem = React.createClass({

	/**
	 * check whether search box value is present in atleast on td element of tr.  
	 * @return {[boolean]}
	 */
	searchResult: function() {

		 for(var key in this.props.tdData) {	

				if(this.props.tags.indexOf(key) != -1) {

          			var attrValue = this.props.tdData[key];

          			var regex = new RegExp(this.props.search_value, 'gi');

          			if(attrValue.match(regex)){
          				return true;
          			}
         		}	
        	}
        	return false;
	},

	/**
	 * checks for tags and returns creates tr values of the given tags 
	 * @return {[none]}
	 */
	render: function() {

		var tdArray = [];

		if (this.props.tdData) {

			if (this.searchResult() || this.props.search_value == '') {

				for (var tag in this.props.tags) {

					var tag_value = this.props.tags[tag];

					var attrValue = (this.props.tdData[tag_value] != null) ?  this.props.tdData[tag_value] : null;
			
					tdArray.push( <tdItem data = {attrValue}/> );
				}		
			}

		}

		return(
				<tr>
					{tdArray}
				</tr>
			)
	}

});


module.exports = React.createClass({	

	getInitialState: function() {
		return {search_value: '', sort_tag: '',sort_ascending: 'false'}
	},

	/**
	 * sets the search_value state to input box value
	 * @param  {[input box search value]}
	 * @return {[none]}
	 */
	searchTags: function(value) {

		this.setState({search_value: value});
	},

	thOnClick: function(tag_value) {

		this.setState({sort_tag: tag_value, sort_ascending: !this.state.sort_ascending});

	},

	/**
	 * renders view of datatable along with search box
	 * @return {[none]}
	 */
	render: function() {


		var tableStyle = {
			border: '1px solid #cbcbcb',
			fontSize: '15px',
			background: 'white'
		}

		var inputStyle = {
				width:'400px'
		}

		if(this.props.buttons) {

			var voices = this.props.data;
			console.log(voices);
			
		}

		if(this.props.data) {

			var _this = this

			/**
			 * sorting the json on click of th tag
			 */
			if(this.state.sort_tag){

				this.props.data.sort(function(clip1,clip2){
					return (_this.state.sort_ascending) ? clip1[_this.state.sort_tag] - clip2[_this.state.sort_tag] : clip2[_this.state.sort_tag] - clip1[_this.state.sort_tag]
				})
			}

			var trItems = this.props.data.map(function(data, index) {
				
				return <trItem search_value={_this.state.search_value} tdData={data} key={index} tags={_this.props.tags} />
			});
		}

		/**
		 * create heading elements in the table
		 */
		if(this.props.tags) {
			var _this = this;

			var thStyle = {
				backgroundColor: '#e0e0e0',
				color: '#000',
				textAlign: 'center',
				padding: '8px',
				cursor: 'pointer'
			}

			var thItems = this.props.tags.map(function(data, index) {
						
				return <th onClick={_this.thOnClick.bind(_this,data)} style={thStyle}>{data}</th>
			});
		}



		return (

			<div>
				<div style={inputStyle}>
					<InputField placeholder="search for tags" keyup={this.searchTags}/>
				</div>
				<table className="table" style={tableStyle}>
					<tr>{thItems}</tr>
					{trItems}
				</table>
			</div>
			)
	}

});