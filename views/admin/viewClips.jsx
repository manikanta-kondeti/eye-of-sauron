'use strict'

var React = require('react');
var Page = require('page');
var Datatable = require('../../components/Datatables');
var RedButton = require('../../components/RedButton');
var InputField = require('../../components/InputField');
var Clip = require('../../components/showClip');



module.exports = React.createClass({

    getInitialState: function(){
        return {voices: null, cursor: ''}
    },

    componentDidMount: function() {
       var _this = this;

       var popular_voices = gapi.client.samosa.api.expressions.popular().execute(
       function(resp) {
                console.log(resp)
                _this.setState({voices: resp.voices, cursor: resp.cursor});
        });
    },

    editClip: function(object) {
        var key = object['key'];
        Page('/admin/dashboard/edit_clip/'+key);
    },

    handleOnClick: function() {

        var search_value = $('#search').val();
        var _this = this;

        gapi.client.samosa.api.get_search_results({'tags': search_value}).execute(function(resp){             
                _this.setState({voices: resp.voices, cursor: resp.cursor});
            });
    },

    getNextClips: function() {

            var search_value = $('#search').val();

            if(search_value != "") {

                var _this = this;

                gapi.client.samosa.api.get_search_results({'tags': search_value, cursor: _this.state.cursor }).execute(
                function(resp){             
                    _this.setState({voices: resp.voices ,cursor: resp.cursor});
                });
            }
            else {

                var _this = this;

                var popular_voices = gapi.client.samosa.api.expressions.popular({'cursor': _this.state.cursor}).execute(
                function(resp) {
                    _this.setState({voices: resp.voices, cursor: resp.cursor});
                });
            }
    },

    getPrevClips: function() {

    },
    
    render: function() {

        console.log(this.state.voices);

        var RightSideBarStyle = {
            position: 'absolute',
            marginLeft: '200px',
            top: '60px',
            bottom: '0px',
            display: 'block',
            padding: '9px',
            width: '83%'
        }

        var submitButtonStyle={
            float:'left', 
            width:'100px', 
            height: '40px',
            marginTop: '6px'
        }

        var inputFieldStyle = {
            float: 'left',
            marginRight: '30px',
            width: '500px'
        }

        var dataTableStyle = {
            float: 'left',
            background: 'white',
            border: '1px solid #e8e8e8',
            padding: '5px',
            width: '100%'
        }

        var navigateButtonsStyle = {
            marginTop: '80px'
        }

        var pushButtonStyle = {
            float: 'right',
            width: '250px',
            height: '50px',
            marginTop: '10px'
        }

        return (
            
         <div style={RightSideBarStyle}> 
            
            <div>
		  
                <div style={inputFieldStyle}> <InputField id="search" placeholder="search for clip" /></div>

        	    <div style={submitButtonStyle} onClick={this.handleOnClick}> <RedButton text = "SUBMIT"/> </div>
          
            </div>  
            
           
            <div style={{marginTop: '100px'}}>

                <div style={navigateButtonsStyle}>
                    <button onClick={this.getNextClips}> Next </button>
                </div>

                <div style={dataTableStyle}>
                    <Datatable 
                        tags= {['transcript','actor_key','movie_key','listens','shares','poster_url','mp3_url']} 
                        actions={[{'name': 'Edit', 'function': this.editClip}]} 
                        data = {this.state.voices} />
                </div>

            </div>
         </div>

        )
    }
});
