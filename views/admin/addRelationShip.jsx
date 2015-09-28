'use strict'

var React = require('react');
var Page = require('page');
var Autocomplete = require('react-autocomplete');
var RedButton = require('../../components/RedButton');
var Datatable = require('../../components/Datatables');


module.exports = React.createClass({

    /**
     * getInitialState gets initial state of the component
     * @return {states}
     */
    getInitialState: function () {
        return ({clips:[],  tags: [], movies: [], actors: [], cursor:[], accepted_clips: [], more: false })
    },

    /**
     * [handleKeyUpTags fetchs tags suggestion to implement auto-complete]
     * @param  {[string]} value [the value of the input field onChange]
     * @return {[null]}       [sets state]
     */
    handleKeyUpTags: function(value) {
        var _this = this;
        gapi.client.samosa.api.get_autocomplete_search({value: value}).execute(function(resp) {

            var values = resp['values'];
 
            var value_dict = values.map(function(value) {
                return {'name': value}
            })


            _this.setState({tags: value_dict});
        });
    },

    /**
     * [handleKeyUpMovies fetchs movies suggestions to implement auto-complete]
     * @param  {[string]} value [the value of the input field onChange]
     * @return {[null]}       [sets state]
     */
    handleKeyUpMovies: function(value) {
        var _this = this;
        gapi.client.samosa.api.get_movie_suggestions({value: value}).execute(function(resp) {

            var values = resp['values'];

            var value_dict = values.map(function(value){
                return {'name': value}
            })

            _this.setState({movies: value_dict});
        });
    },

    /**
     * [handleKeyUpActors fetchs actors suggestions to implement auto-complete]
     * @param  {[string]} value [the value of the input field onChange]
     * @return {[null]}       [sets state]
     */
    handleKeyUpActors: function(value) {

        var _this = this;

        gapi.client.samosa.api.get_actor_suggestions({value: value}).execute(function(resp) {

            var values = resp['values'];

            var value_dict = values.map(function(value){
                return {'name': value}
            })

            _this.setState({actors: value_dict});
        });
    },

    /**
     * [handleSubmit onClick submit, send the post request for insertion of the relation in datastore]
     * @return {[null]} 
     */
    handleSubmit: function() {

        var tag1 = $($(this.refs.tag1.getDOMNode()).children()[0]).val();
        var tag2 = $($(this.refs.tag2.getDOMNode()).children()[0]).val();
        var tag3 = $($(this.refs.tag3.getDOMNode()).children()[0]).val();
        
        var tag = tag1+ ' '+ tag2+ ' ' +tag3;
        var _this = this;

        _this.state.clips = []
        _this.state.accepted_clips = []
        gapi.client.samosa.api.get_search_results({'tags': tag}).execute(
            function(resp){             
                _this.setState({clips: resp.voices, cursor: resp.cursor, more: resp.more})
            });
    },

    /**
     * [reject removes the unwanted clips from the datatables]
     * @param  {[obj]} object [array of voices]
     * @return {[null]}  
     */
    reject: function(object) {

        var accepted_clips = this.state.clips;

        var new_accepted_clips = [];

        for(var i=0; i< accepted_clips.length; i++) {

            if(accepted_clips[i]['key'] != object['key']) {
                new_accepted_clips.push(accepted_clips[i]);
            }
            else{
                console.log('rejected');
            }
        }
        this.setState({clips: new_accepted_clips });
        
    }, 

    /**
     * [handleNext get next clips and load them in the datatable by changing component's state]
     * @return {[null]}
     */
    handleNext: function() {

        var _this = this;

        var tag1 = $($(this.refs.tag1.getDOMNode()).children()[0]).val();
        var tag2 = $($(this.refs.tag2.getDOMNode()).children()[0]).val();
        var tag3 = $($(this.refs.tag3.getDOMNode()).children()[0]).val();

        var tag = tag1+ ' '+ tag2+ ' ' +tag3

       
        gapi.client.samosa.api.get_search_results({'tags': tag, 'cursor': this.state.cursor}).execute(
            function(resp) {             
                    var accepted_clips = _this.state.clips.concat(_this.state.accepted_clips);
                    _this.setState({clips: resp.voices, cursor: resp.cursor, accepted_clips: accepted_clips, more: resp.more });
                    
            });
    },

    /** [handleNewActor: Need to pass a few params and add this in movie entity]
    *   @return {[status][description]} 
    */
    handleNewActorMovie: function(){
        console.log("handleNewActor");
        Page('/admin/dashboard/add_new_actor_movie/')
    },

    /**
     * [handleCreateRelation create relation by sending movie, actor and expressions]
     * @return {[type]} [description]
     */
    handleCreateRelation: function() {

        var final_expressions = this.state.clips.concat(this.state.accepted_clips);
        var actor = $($(this.refs.actor.getDOMNode()).children()[0]).val();
        var movie = $($(this.refs.movie.getDOMNode()).children()[0]).val();

        var expression_keys = final_expressions.map(function(data, index) {
                return data['key'];
        });

        var r = confirm("The following clips are going to be associated with actor "+ actor +" from the movie "+ movie +"....Total number of keys:  "+ expression_keys.length);
        if (r == true) {
            //GET
            /*
            $.get('https://mani-dev-dot-the-tasty-samosa.appspot.com/dashboard_post_actor_movie_relation',{
        var r = confirm("The following clips are going to be associated with actor "+ actor +" from the movie "+ movie +". Total number of clips "+this.state.clips.concat(this.state.accepted_clips).length);
        if (r == true) {
            $.post('https://mani-dev-dot-the-tasty-samosa.appspot.com/dashboard_post_actor_movie_relation',{
>>>>>>> React version changed+dashboard text added+everything is working
                                  'expression_keys':expression_keys,
                                  'actor':actor,
                                  'movie':movie
                  }, function(response){
                          alert(response['status']);    
            })
            */
            //POST
            
            $.ajax({
                 type:    "POST",
                 dataType: "json",
                 url:     "https://the-tasty-samosa.appspot.com/dashboard_post_actor_movie_relation",
                 data:    {
                            "expression_keys": expression_keys,
                            "actor": actor,
                            "movie" : movie 
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
 

    render: function() {

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
            height: '30px',
            marginTop: '10px'
        }

        var item = {
            padding: '2px 6px',
            cursor: 'default'
        }

        var highlightedItem = {
            color: 'white',
            background: 'hsl(200, 50%, 50%)',
            padding: '2px 6px',
            cursor: 'default'
        }

        var menu = {
            border: 'solid 1px #ccc'
        }

        var topElementsStyle = {
            float: 'left',
            margin: '5px',
        }

        var datatableStyle = {
            marginTop: '80px',
            width: '100%',
            zIndex: -1
        }

        var nextStyle = {
            display: 'none'
        }

        if(this.state.more) {
            nextStyle['display'] = 'block'
        }

        return (

                <div style={RightSideBarStyle}>
            
                    Add RelationShip <hr/>

                    <div style={topElementsStyle}>
                     Tags :                           
                          <Autocomplete
                                    ref="tag1"
                                    getItemValue={(item) => item.name}
                                    items={this.state.tags}
                                    onChange={(event, value) => {
                                        this.handleKeyUpTags(value);
                                    }}
                                    renderItem={(item, isHighlighted) => (
                                        <div
                                            style={isHighlighted ? highlightedItem : item}
                                        >{item.name}</div>
                                    )}
                                />

                             <Autocomplete
                                    ref="tag2"
                                    getItemValue={(item) => item.name}
                                    items={this.state.tags}
                                    onChange={(event, value) => {
                                        this.handleKeyUpTags(value);
                                    }}
                                    renderItem={(item, isHighlighted) => (
                                        <div
                                            style={isHighlighted ? highlightedItem : item}
                                        >{item.name}</div>
                                    )}
                                />

                             <Autocomplete
                                    ref="tag3"
                                    getItemValue={(item) => item.name}
                                    items={this.state.tags}
                                    onChange={(event, value) => {
                                        this.handleKeyUpTags(value);
                                    }}
                                    renderItem={(item, isHighlighted) => (
                                        <div
                                            style={isHighlighted ? highlightedItem : item}
                                        >{item.name}</div>
                                    )}
                                />
                   
                     </div>
        
                    <div style={topElementsStyle}>

                        Movies :

                          <Autocomplete
                                    ref="movie"
                                    getItemValue={(item) => item.name}
                                    items={this.state.movies}
                                    onChange={(event, value) => {
                                        this.handleKeyUpMovies(value);
                                    }}
                                    renderItem={(item, isHighlighted) => (
                                        <div
                                        style={isHighlighted ? highlightedItem : item}
                                        >{item.name}</div>
                                    )}
                                />
                    </div>

                      <div style={topElementsStyle}>
                                Actors :
                               <Autocomplete
                                    ref="actor"
                                    getItemValue={(item) => item.name}
                                    items={this.state.actors}
                                    onChange={(event, value) => {
                                        this.handleKeyUpActors(value);
                                    }}
                                    renderItem={(item, isHighlighted) => (
                                        <div
                                        style={isHighlighted ? highlightedItem : item}
                                        >{item.name}</div>
                                    )}
                                />
                      </div>

                    <div style={topElementsStyle} onClick={this.handleSubmit}>
                        <RedButton text="GetSearchResults" />
                    </div>
                
                    <div style={datatableStyle}>
                        <div>
                        <p>Total number of accepted clips: <b> {this.state.clips.concat(this.state.accepted_clips).length}</b> </p>
                            <div style={submitButtonStyle} onClick={this.handleNewActorMovie}>
                              <RedButton text="NewActorMovie" />
                            </div>
                        </div>
                        <button style={nextStyle} onClick={this.handleNext}>Next</button> 

                        <Datatable 
                        tags= {['mp3_url','transcript','actor_key','movie_key','poster_url','key']} 

                        actions={[{'name': 'Reject', 'function': this.reject}]} 
                        data = {this.state.clips} />
                
                        <div style={{width:'100px', marginTop:'50px', height: '30px'}} onClick={this.handleCreateRelation}>
                            <RedButton text="create relation" />
                        </div>

                    </div>

                </div>

            )
    }

});
