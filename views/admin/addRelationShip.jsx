'use strict'

var React = require('react');
var Page = require('page');
var Autocomplete = require('react-autocomplete');
var RedButton = require('../../components/RedButton');

module.exports = React.createClass({

    getInitialState: function () {
        return ({ tags: [], movies: [], actors: [] })
    },

    handleKeyUpTags: function(value) {

        var _this = this;

        gapi.client.samosa.api.get_autocomplete_search({value: value}).execute(function(resp) {

            var values = resp['values'];

            var value_dict = values.map(function(value){
                return {'name': value}
            })


            _this.setState({tags: value_dict});
        });
    },

    handleKeyUpMovies: function(value) {

        var _this = this;

        gapi.client.samosa.api.get_autocomplete_movie({value: value}).execute(function(resp) {

            var values = resp['values'];

            var value_dict = values.map(function(value){
                return {'name': value}
            })

            _this.setState({movies: value_dict});
        });

    },

    handleKeyUpActors: function(value) {

        var _this = this;

        gapi.client.samosa.api.get_autocomplete_actor({value: value}).execute(function(resp) {

            var values = resp['values'];

            var value_dict = values.map(function(value){
                return {'name': value}
            })

            _this.setState({actors: value_dict});
        });
    },

    handleSubmit: function() {
        
        var tag = [$($(this.refs.tag.getDOMNode()).children()[0]).val()];
 
        var actor = $($(this.refs.actor.getDOMNode()).children()[0]).val();

        var movie = $($(this.refs.movie.getDOMNode()).children()[0]).val();

        console.log(tag);

        console.log(actor);

        console.log(movie);

        $.get('https://web-og-tags-dot-the-tasty-samosa.appspot.com/dashboard_insert_relation', {'tags':tag,'actor':actor,'movie':movie}, function(response){

                 alert('tag has been added');    

         })
        
    },

    render: function() {

        console.log(this.state.actors);

        var RightSideBarStyle = {
            position: 'absolute',
            marginLeft: '200px',
            top: '60px',
            bottom: '0px',
            display: 'block',
            padding: '9px',
            width: '83%'      
        }


        return (

                <div style={RightSideBarStyle}>
            
                    Add RelationShip <hr/>

                    <div style={{float: 'left'}}>
                     Tags &nbsp; 
                     
                          <Autocomplete
                                    ref="tag"
                                    getItemValue={(item) => item.name}
                                    items={this.state.tags}
                                    onChange={(event, value) => {
                                        this.handleKeyUpTags(value);
                                    }}
                                    renderItem={(item, isHighlighted) => (
                                        <div>{item.name}</div>
                                    )}
                                />
                   
                     </div>
        
                    <div style={{float:'left'}}>
                        Movies &nbsp; 

                          <Autocomplete
                                    ref="movie"
                                    getItemValue={(item) => item.name}
                                    items={this.state.movies}
                                    onChange={(event, value) => {
                                        this.handleKeyUpMovies(value);
                                    }}
                                    renderItem={(item, isHighlighted) => (
                                        <div>{item.name}</div>
                                    )}
                                />
                     
      
                    </div>

                      <div style={{float:'left'}}>
                                Actors &nbsp;
                               <Autocomplete
                                    ref="actor"
                                    getItemValue={(item) => item.name}
                                    items={this.state.actors}
                                    onChange={(event, value) => {
                                        this.handleKeyUpActors(value);
                                    }}
                                    renderItem={(item, isHighlighted) => (
                                        <div>{item.name}</div>
                                    )}
                                />
                      </div>

                    <div style={{width:'100px', marginTop:'50px', height: '30px'}} onClick={this.handleSubmit}>
                        <RedButton text="submit" />
                    </div>
                </div>

            )
    }

});