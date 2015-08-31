/** 
 * @jsx React.DOM 
 **/

'use strict'

var React = require('react');


module.exports = React.createClass({

    getInitialState: function() {
        return ({});
    },

   render: function() {

      var container = {
        width: '100%',
        height: '100%',
        top: '0px',
        left: '0px'
      }

      var leftSideWrapper = {
        float: 'left',
        width: '45%',
        height: '300px',
        marginTop: '20px',
        paddingLeft: '3%'
      }

      var content = {
        paddingLeft: '3%',
        height: 'auto'
      }

      var rightSideWrapper = {
        float: 'left',
        width: '45%',
        height: '450px',
        marginTop: '20px',
        paddingLeft: '3%'
      }
  
      var previewWrapper = {
        border: '1px solid #eee',
        background: 'white',
        height: '100%',
        width: '100%'
      }

      var formControl = {

      }

      var label = {
      }

      var title = {
        color: '#9CB2C0',
        fontSize: '30px',
        fontFamily: 'Helvetica Neue'
      }

      var searchBox = {
        width: '100%',
        height: '20px',
        marginTop: '10px',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #eee'
      }

    return (
      
        <div style={container}>
           <div style={content}>
              <p style={title}> Embed Samosa in your website</p>
              <p> Add Samosa to your website using the tool below. Select your configuration options and paste the code in the HTML of your page </p>
           </div>
      
          <div style={leftSideWrapper}>
            <p style={title}> Configuration</p>
            <p style={formControl}>
              <span style={label}>Width</span>
              <input style={searchBox} placeholder= "width" />
            </p>
            <p style={formControl}>
              <span style={label}>Height</span>
              <input style={searchBox} placeholder= "height" /> 
            </p>
            <p style={formControl}>
              <span style={label}>Language</span>
              <input style={searchBox} placeholder= "language" />
            </p>
            <p style={formControl}>
              <span style={label}>Code</span><br/>
              <textarea rows="10" cols="92" placeholder = "code"></textarea>
            </p>
          </div>
      
          <div style={rightSideWrapper}>
            <p style={title}> Preview</p>
            <div style={previewWrapper}>
                <iframe src='http://localhost:8080/popular-now-iframe' width='100%' height='520' border='0' scrolling='no' frameBorder='0'></iframe>
            </div>
          </div>
      </div>  

    );
  
  }
});

