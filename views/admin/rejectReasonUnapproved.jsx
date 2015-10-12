/** @jsx React.DOM */

/*
    Reject Reason
    1. Similar or Same content is already present on the app
    2. Content did not pass the quality measures of Samosa 
    3. Content has photo of an individual(s) and might violate privacy
    4. Content of the image does not meet community standards
    5. This content would violate copyright of individuals/organizations
    6. The reviewers didn’t find this content fit to be shared on a public platform
*/

'use strict'

var React = require
('react')
var RedButton = require('./../../components/RedButton');

module.exports = React.createClass({
    
    blur: function() {
        this.props.close_modal();
    },

    handleSubmit: function(e) {
        var reject_reason = $('select[name=reject_reasons]').val();
        this.props.reject(reject_reason);
        this.props.close_modal();
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
            left: '50%',
            top: '50%',
            marginTop: '-200px',
     	    backgroundColor: '#fff',
            border: '1px solid #000',
     	    padding: '15px',
            zIndex: '5000'
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
            selectLanguageStyle['display'] = 'none';
        }
        else{
            loginMessageStyle['display'] = 'none';
        }

        return (
            <div>
                <div onClick={this.blur} style={overlayStyle}></div>
                    <div style={modalStyle}>
                        <div style ={loginMessageStyle}>
                            <hr> Please Select Reason For Rejection </hr>
                        </div>
                    
                        <div>
                            <select name="reject_reasons">
                                <option value="Similar or Same content is already present on the app">Already Present</option>
                                <option value="Content did not pass the quality measures of Samosa">Quality Low</option>
                                <option value="Content has photo of an individual(s) and might violate privacy">Photos-Self/Others</option>
                                <option value="Content of the image does not meet community standards">NSFW Spam</option>
                                <option value="This content would violate copyright of individuals/organizations"> Copyright violation </option>
                                <option value="The reviewers didn’t find this content fit to be shared on a public platform">Other</option>
                            </select>
                        <div onClick={this.handleSubmit}>
                            <RedButton text="submit" />
                        </div>
                    </div>
                </div>
            </div>
        )}

});