/** @jsx React.DOM */

'use strict'

var React = require('react')
var RedButton = require('../components/RedButton');

module.exports = React.createClass({

    componentDidMount: function() {
        window.addEventListener('keyup', this.handleKeyUp);
    },

    /**
     * [changeLanguage change the language preference of the user]
     * @return {[none]} 
     */
    changeLanguage: function() {
        
        var checkboxes = document.getElementsByClassName('checkbox');
       

        var languages = []
        for(var i=0; i<checkboxes.length; i++){

           if(checkboxes[i].checked){
                var checkedValue = checkboxes[i].value;
                languages.push(checkedValue);
            }
        }

        gapi.client.samosa.api.modify_user_language_preference({
            'auth_key': sessionStorage.getItem('samosa_key'),
            'languages': languages
        }).execute(function(e) {
            if(e.value){
                window.location.href = "/popular-now"
            } 
        })
    },

	blur: function() {
		this.props.close_modal();
	},

    handleKeyUp: function(e) {
        if(e.keyCode == 27) {
            this.props.close_modal();
        }
    },

	render: function() {
		  
		var overlayStyle = {
    		visibility: 'visible',
     		position: 'absolute',
  		    left: '0px',
    		top: '0px',
     		width: '100%',
     		height: '100%',
 		    zIndex: '300',
 		    background: 'rgba(0, 0, 0, 0.8)'
 		}

		var modalStyle = {
            position: 'absolute',
			width: '600px',
            height: '300px',
    		left: '24%',
            top: '20%',
     		backgroundColor: '#fff',
    		border: '1px solid #000',
     		padding: '15px',
            zIndex: '500'
		}

        var loginMessageStyle = {
            display : 'block',
            textAlign: 'center'
        }

        var selectLanguageStyle = {
            display : 'block'
        }

        var submitStyle = {
            width: '100px',
            height: '30px'
        }

        if(!sessionStorage.getItem('samosa_key')) {
             selectLanguageStyle['display'] = 'none'
        }
        else{
             loginMessageStyle['display'] = 'none' ;
        }

		return (
            <div>
              <div onClick={this.blur} style={overlayStyle}></div>
                <div style={modalStyle}>
                    <div style ={loginMessageStyle}>
                        Please Login To Access This Feature
                    </div>
                    <div style = {selectLanguageStyle} >
                         SELECT LANGUAGES <hr/>
                     
                        <input type="checkbox" className="checkbox" value="hindi"/>Hindi<br/>
                        <input type="checkbox" className="checkbox" value="tamil"/>Tamil<br/>
           	    		<input type="checkbox" className="checkbox" value="telugu"/>Telugu<br/>
                        <input type="checkbox" className="checkbox" value="kannada"/>Kannada<br/>
                        <input type="checkbox" className="checkbox" value="malayalam"/>Malayalam<br/>
                        <br/>
                        <div style={submitStyle} onClick={this.changeLanguage}>
                            <RedButton text="SUBMIT" />
                        </div>
                   </div>
  			   </div>
            </div>  
			
		)
	}

});