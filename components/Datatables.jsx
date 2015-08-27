/** @jsx React.DOM */
/**
	this.props.data = coloums of the table to be displayed
	this.props.tags = headings of the table and key values in the json file
	this.props.actions = They are buttons which have to be displayed with [name: , action: ] feature where name atrr referst to name on the button

**/


'use strict'

var React = require('react')
var InputField = require('./InputField');
var Img = require('./Image');
var BasicPlayer = require('./BasicPlayer');
var RedButton = require('./RedButton');


var actionButton = React.createClass({

	handleOnClick: function() { 
		this.props.action(this.props.data);
	},

	render: function() {

			return (
					<div onClick={this.handleOnClick} >
						<RedButton text = {this.props.text} />
					</div>

				)
	}
})

var tdItem = React.createClass({

	/**
	 * creates td items for the given data
	 */
	render: function() {


			var tdStyle = {
				textAlign: 'center',
				padding: '5px',
				borderBottom: '1px solid #cbcbcb'

			}

			if(this.props.data) {

				var image_formats = ['png', 'jpg'];
				var audio_formats = ['opus', 'mp3'];

				var data = String(this.props.data);

				if(image_formats.indexOf(data.split('.').pop())!= -1){
						var data =  <Img width="80" src={this.props.data} />
				}	
				else if(audio_formats.indexOf(data.split('.').pop())!= -1){
						var data =  <BasicPlayer src={this.props.data} />
				}	

				else{
						var data = this.props.data;

				}
			}

			if(this.props.action){

				var data = <actionButton data={this.props.data} text = {this.props.name}  action = {this.props.action} />

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
	componentDidUpdate: function() {
		console.log('hello');
	},

	searchResult: function() {

		if(this.props.tdData) {

		 for(var key in this.props.tdData) {	

				if(this.props.tags.indexOf(key) != -1) {

          			var attrValue = String(this.props.tdData[key]);

          			var regex = new RegExp(this.props.search_value, 'gi');

          			if(attrValue) {
        	  			if(attrValue.match(regex)){
          					return true;
          				}
          			}
         		}	
        	}
        	return false;
        }
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

				if(this.props.actions) {

					for(var i in this.props.actions) { 
						
						var action = this.props.actions[i];

						tdArray.push(<tdItem data={this.props.tdData} name={action['name']} action={action['function']} />);
					}
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

	componentDidUpdate: function() {
		console.log('datatable updated');
	},

	/**
	 * sets the search_value state to input box value and the set state is passed to trItem 
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

				return <trItem actions={_this.props.actions} search_value={_this.state.search_value} tdData={data} key={index} tags={_this.props.tags} />
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
					<InputField placeholder="search in the table" keyup={this.searchTags}/>
				</div>
				<table className="table" style={tableStyle}>
					<tr>{thItems}</tr>
					{trItems}
				</table>
			</div>
			)
	}

});