/** @jsx React.DOM */
'use strict'
var React = require('react');
var Page = require('page');
var RedButton = require('../../components/RedButton');
var InputField = require('../../components/InputField');
var config = require('../../config');

module.exports = React.createClass({
	getInitialState: function(){
		return null;
	},

	handleSubmitActor: function(){
			var languages_with_comma = $('#languages_actor').val();
            var languages = languages_with_comma.split(',')
			console.log("Actor "+languages);
			var r = confirm("Do you want to confirm? If yes please check the status in response.");
        	if (r == true) {
				$.ajax({
                	 type:    "POST",
                 	dataType: "json",
                 	url:     config.ajax_url + "/dashboard_post_add_new_actor",
                 	data:    {
                            "display_name": $('#display_name_actor').val(),
                            "primary_language": $('#primary_language_actor').val(),
                            "gender": $('#gender_actor').val(),
                            "movie_unique_id": $('#movie_unique_id_actor').val(),
                            "actor_unique_id": $('#actor_unique_id_actor').val(),
                            "languages": languages
                        },
                	success: function(response) {
	                   	     alert(response['status']);

                		},	
                // vvv---- This is the new bit
                	error: function(jqXHR, textStatus, errorThrown) {
                    	alert(errorThrown);
                	}
            	}); 
			}
	},

	handleSubmitMovie: function(){	
		    var languages_with_comma = $('#languages_movie').val();
			var languages = languages_with_comma.split(',')
            console.log("Movies "+languages);
			var r = confirm("Do you want to confirm? If yes please check the status in response.");
        	if (r == true) {
				$.ajax({
	                 type:    "POST",
	                 dataType: "json",
	                 url:      config.ajax_url + "/dashboard_post_add_new_movie",
	                 data:    {
                                "movie_unique_id": $('#movie_unique_id_movie').val(),
	                            "display_name": $('#display_name_movie').val(),
	                            "full_name":    $('#full_name_movie').val(),
	                            "year":      $('#year_movie').val(),
	                            "languages": languages
	                        },
	                success: function(response) {
	                        alert(response['status']);

	                },
	                // vvv---- This is the new bit
	                error: function(jqXHR, textStatus, errorThrown) {
	                    alert(errorThrown);
	                }
	            }); 
	        }

	},

	render: function(){
		
        var RightSideBarStyle = {
            position: 'absolute',
            marginLeft: '240px',
            top: '60px',
            bottom: '0px',
            display: 'block',
            padding: '9px',
            width: '83%'      
        }

        var inputFieldStyle = {
            width: '600px',
            height: '36px',
            margin : '10px'
        }

        var submitStyle= {
            width: '100px',
            height: '30px',
            margin: '15px'
        }


		return(
			<div style = {RightSideBarStyle}>
				Add a New Actor Entity <hr/>
					<div style={inputFieldStyle}>
                         <InputField id="actor_unique_id_actor" placeholder="Actor Unique ID  Eg: pawan_kalyan, mahesh_babu, salman_khan" />
                    </div>
                    <div style={inputFieldStyle}>
                        <InputField id="display_name_actor" placeholder="Display Name" />
                    </div> 
                    <div style={inputFieldStyle}>
                         <InputField id="gender_actor" placeholder="Gender male/female" />
                    </div>
                    <div style={inputFieldStyle}>
                         <InputField id="primary_language_actor" placeholder="Primary Language" />
                    </div>
                    <div style={inputFieldStyle}>
                         <InputField id="languages_actor" placeholder="Coma separated languages eg: telugu,hindi,tamil,bengali" />
                    </div>
                    <div style={inputFieldStyle}>
                         <InputField id="movie_unique_id_actor" placeholder="Movie Unique ID: atleast one movie of the actor, this should be in Datastore" />
                    </div>
                    <div onClick={this.handleSubmitActor} style={submitStyle}>
                        <RedButton  text = "CreateActor" />
                    </div>


                Add a New Movie Entity <hr/>

                	<div style={inputFieldStyle}>
                         <InputField id="movie_unique_id_movie" placeholder="Movie Unique ID   Eg:  jalsa_2008, temper_2015, dookudu_2011" />
                    </div>
                    <div style={inputFieldStyle}>
                         <InputField id="year_movie" placeholder="year" />
                    </div>
					<div style={inputFieldStyle} >
                        <InputField id="full_name_movie" placeholder="Full Name" />
                    </div>
                    <div style={inputFieldStyle}>
                        <InputField id="display_name_movie" placeholder="Display Name" />
                    </div> 
                    <div style={inputFieldStyle}>
                         <InputField id="languages_movie" placeholder="Coma separated languages eg: telugu,hindi,tamil,bengali" />
                    </div>

                    <div onClick={this.handleSubmitMovie} style={submitStyle}>
                        <RedButton  text = "CreateMovie" />
                    </div>                        
			</div>
		)
	}
})