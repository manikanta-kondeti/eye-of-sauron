'use strict'

var React = require('react');
var Page = require('page');
var ReactTypeahead = require('react-typeahead');
var RedButton = require('../../components/RedButton');

module.exports = React.createClass({

    getInitialState: function () {
        return({ search_results: []})
    },

    handleKeyUp: function(e) {

        var _this = this;

        gapi.client.samosa.api.get_autocomplete_search({value: e.target.value}).execute(function(resp) {

            var values = resp['values'];

            _this.setState({search_results: values});
        });
    },

    handleSubmit: function() {
        console.log('hi');
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

        return (

                <div style={RightSideBarStyle}>
            
                    Add RelationShip <hr/>

                    Tags &nbsp; 
                     <ReactTypeahead.Tokenizer 
                            name="tags"
                            placeholder = "search"
                            onKeyUp = {this.handleKeyUp}
                            options={this.state.search_results}
                     />
                    
                    <div style={{width:'100px', marginTop:'30px', height: '30px'}} onClick={this.handleSubmit}>
                        <RedButton text="submit" />
                    </div>
                </div>

            )
    }

});