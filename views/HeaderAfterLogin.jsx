var React = require('react');
var Bootstrap = require('react-bootstrap');
var {ButtonToolbar, ButtonGroup, Button} = Bootstrap;

module.exports = React.createClass({
	getInitialState : function(){
		return{}
	},

	render : function(){
		var styles = {
			titleStyle : {
				textAlign : 'center',
				color : 'cadetblue'
			},

			headerStyle : {
				backgroundColor : '#fff',
				borderColor : '#e7e7e7',
			    position:'fixed',
			    top:'0',
			    width: '100%',
			    zIndex:'100',
			    height : '50px'
			},

			ButtonToolbarStyle : {
				float : 'right',
				marginTop : '1%'
			}
		}
		return (
			<div>
				<div style={styles.headerStyle}>
					<div style={styles.ButtonToolbarStyle}>
						<ButtonToolbar>
					      <ButtonGroup bsSize="small">
					        <Button>New task</Button>
					        <Button>Update task</Button>
					        <Button>Delete Task</Button>
					      </ButtonGroup>
				    	</ButtonToolbar>
					</div>
					<h3 style={styles.titleStyle}>SAURON</h3>
					
				</div>

			</div>

		)
	}
})