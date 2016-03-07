'use strict'

var React = require('react');
var config = require('../config');
var Page = require('page');
var {Button, Modal} = require('react-bootstrap');
var Header = require('./Header');
var User = require('./../components/User');
var TimerMixin = require('react-timer-mixin');

module.exports = React.createClass({
	mixins: [TimerMixin],
	getInitialState: function() {	
		return {users_components : [], users : [], index : 0, users_cursor : null, task : null}
	},

	componentDidMount: function() {
		
		//Get list of users and populate users list 
		
		this.getUsers();	
		
		// Update for every 2 secs
		this.setInterval(
      		this.updateUsers,
      		10000
    	);
		
	},

	getUsers : function() {
		var _this = this;
		gapi.client.sauron.api.get_list_of_users().execute(
      		function(resp) {
      			var new_users = _this.state.users.concat(resp.users);
      			for(var i=0; i < new_users.length; i++) {
      				new_users[i].selected = false;
      			}
      			new_users[0].selected = true;

      			var new_user_components = [];
      			for(var i = 0; i < new_users.length; i++) {
					new_user_components[i] = <User params={new_users[i]} />;
				}
      			_this.setState({users_components: new_user_components, users : new_users, users_cursor: resp.cursor, index : 0});
        		_this.populateTask();
        });
	},

	populateTask : function(){
		var _this = this;
		// Based on this.state.index, fetch the task related to index
		gapi.client.sauron.api.get_tasks_by_user({'value' : this.state.users[this.state.index].key}).execute(
			function(resp) {
				
				var task = null; 
				if (resp.tasks != undefined) {
					task = resp.tasks[0];
				}
				_this.setState({task : task});
				_this.getUpdatesFromTask();
		})
	},

	getUpdatesFromTask : function() {
		var _this = this;
		gapi.client.sauron.api.get_updates_on_task({'value' : this.state.task.key}).execute(
			function(resp) {
				
				var updates = []; 
				if (resp.comments != undefined) {
					updates = resp.comments;
				}
				_this.setState({updates : updates});
			
		})
	},

	updateUsers : function() {
		
		var index = this.state.index + 1; 
		if (index == this.state.users.length){
			index = 0;
		}
		var users = this.state.users;
		var users_length = this.state.users.length;
		var new_user_components = [];
		console.log('Timeout updated... len = ' + users_length + " index = " + this.state.index);
		for(var i = 0; i < users_length; i++) {
			users[i]['selected'] = false;
			if (i == index) {
				users[index].selected = true;
			}
			new_user_components[i] = <User params={ users[(index+i) % (users_length) ]} />;

		}
		this.setState({users_components : new_user_components, index : index});
		this.populateTask();
	},

	render : function() {

		var styles = {
			container : {
				width: '100%',
				top: '50px',
				left: '0px',
				position : 'relative',
				backgroundColor : '#f8f8f8'
			},

			usersListDivStyle : {
				backgroundColor : '#f8f8f8'
			},

			RightDiv : {

			},

			contentDivStyle : {
				marginTop: '5%',
				marginLeft : '10%',
				boxSizing : 'content-box',
				borderRadius : '10px',
				padding : '40px',
				backgroundColor : '#fff',
				width : '60%',
				position : 'fixed',
				boxShadow : '0px 1px 10px #888888'
			},

			ulStyle : {
				fontSize : '1.3em',
				textAlign : 'center',
				listStyleType : 'None'
			},

			liStyle : {
				fontSize : '1.3em',
				fontFamily  : 'fantasy'
			},

			headerStyle : {
				fontFamily : 'serif',
				fontSize : '50px',
				textAlign : 'center',
				padding : '30px'
			},

			iconStyle : {
				margin : '3px',
				padding : '3px'
			}
		}
		
		var task_name = null;
		if(this.state.task != null) {
			task_name = this.state.task.task_name;
		}

		var updates = [];
		var comments_image_stack = [];
		if (this.state.updates != '' && this.state.updates != undefined) {
			for (var i=0; i<4; i++){
				if (this.state.updates[i] != undefined) {
					updates.push(this.state.updates[i].comment_text);
					comments_image_stack.push(<img src="http://iconsineed.com/icons/freecns-cumulus/519589-087_Speechbubbles-128.png" width="30px" height="30px" style={styles.iconStyle}/>);
				}
				else {
					updates.push('');
					comments_image_stack.push('');
				}
			}
		}
		return (
			<div style={styles.container}>
				<div className="row">
					<div className="col-sm-3 col-md-6 col-lg-2">
						<div style={styles.usersListDivStyle}>
					  		{this.state.users_components}
					  	</div>
				    </div>
				    <div className="col-sm-9 col-md-6 col-lg-10">
				    	<div style={styles.RightDiv}>
					    	<div style={styles.contentDivStyle}>
					    		<div>
					    			<React.addons.CSSTransitionGroup  transitionName="example" 
							                transitionAppear={true}
							                component='ul'
							                >
					    				<h1 style={styles.headerStyle}>  {task_name} </h1>
					    			
					    			<div>
					    				<ul style={styles.ulStyle}>
					    					<li style={styles.liStyle}>{comments_image_stack[0]} {updates[0]}  </li>
					    					<li style={styles.liStyle}>{comments_image_stack[1]} {updates[1]} </li>
					    					<li style={styles.liStyle}>{comments_image_stack[2]} {updates[2]} </li>
					    				</ul>
						    			
					    				</div>
					    			</React.addons.CSSTransitionGroup>
					    		</div>
						  	</div>

						</div>
				    </div>
				</div>
			</div>
		)
	}
});