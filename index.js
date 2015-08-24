/*
	Copyright 2015, Google, Inc. 
 Licensed under the Apache License, Version 2.0 (the "License"); 
 you may not use this file except in compliance with the License. 
 You may obtain a copy of the License at 
  
    http://www.apache.org/licenses/LICENSE-2.0 
  
 Unless required by applicable law or agreed to in writing, software 
 distributed under the License is distributed on an "AS IS" BASIS, 
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
 See the License for the specific language governing permissions and 
 limitations under the License.
*/
require('node-jsx').install();

var express = require('express');
var React = require('react');
var path = require('path');
var https = require('https');

var app = express();

app.use(express.static(path.join(__dirname, '.')));

var og_tags;
var page_template = '<!DOCTYPE html>' +
	'<html>' 

var head_template = '<head>' +
        '<style>'+
          'body { background: #eff3fa !important;overflow-y: scroll;'+
            'font-family: sans-serif !important;'+
            'border: 0;'+
            'line-height: 1.5;'+
            'height: 100%;'+
            'font-weight:100;'+
            'font-size: 17px;'+
            'margin: 0;'+
            'padding: 0;'+
            'letter-spacing: 0.01em;'+
          '}'+
    '</style>' +
		    '<script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>' +
		    '<script src="/node_modules/react/dist/react-with-addons.js"></script>' +
			'<script src="/bundle.js"></script>' +		
			'<script src="https://apis.google.com/js/client.js?onload=init"></script>' +
			'<script type="text/javascript" src="/parse.js"></script>' +
			'<script>' +			
				'var loaded = function() {' +		
					'Parse.initialize("d8mjGklf1CYE5qpGK6TKPz3cnHAIcPdMQCYD7waZ", "J3mVxkaDa4W4zDs9pujKjwXEMblyCBS9wKfVzy0v")' +
				'}' +
			'</script>' 

 var body_template = 
		'<body onload="loaded();">' +
			'<div id="header">' +
			'</div>' +

			'<div id= "left-side-bar">' +
			'</div>' +

			'<div id = "right-side-bar">' +
			'</div>' +

		'</body>' +
	'</html>'

var page_template = head_template  + body_template;

app.get('/play/:key', function(req,res) {

		var key = req.params.key
		var output = ""

 		var proxyRequest = https.request({
 				host: 'ranking-dot-the-tasty-samosa.appspot.com',
 	 			port: 443,
 				path: '/_ah/api/samosa/v1/search/by/key?id='+ key
   			},
    		function (proxyResponse) {
     			 proxyResponse.on('data', function (chunk) {

     			 	output += chunk
      			});
     			
          proxyResponse.on('end',function(){
     				var obj	 = JSON.parse(output);

     				var URL  = 'https://app.getsamosa.com/play/'+ key;
     				var twitterURL = URL.replace('/play/', '/play/twitter/');
    
   	 				var imageURL = obj['poster_url'];
                    var transcript = obj['transcript'];

			 		  res.setHeader('Content-Type', 'text/html');
                    
     				var URL  = 'https://app.getsamosa.com/play/'+ key;
     				var og_template =  head_template + 
   										'<meta property="fb:app_id" content="580678502050494" />' + 
        								'<meta property="og:url" content=https://app.getsamosa.com/play/'+ key  +' />' +
        								'<meta property="og:type"   content="video.other" />' +
        								'<meta property="og:video:height" content="260" />' + 
        								'<meta property="og:video:width" content="420" />'+
       									'<meta property="og:video:type" content="application/x-shockwave-flash" />' +
        								'<meta property="og:title" content='+ transcript +' />' +
       								 	'<meta property="og:image" content='+ imageURL +' />' +
                                        '<meta property="og:video:secure_url" content="https://samosa.parseapp.com/Main.swf?audio_file=' + obj['mp3_url'] + '&image_file=' + imageURL + '&share_link=' + URL + '" />' +
                                        '<meta property="og:video" content="http://samosa.parseapp.com/Main.swf?audio_file=' + obj['mp3_url'] + '&image_file=' + imageURL +'&share_link=https://app..getsamosa.com/play/'+ key + '"/>'+
                                        '<meta property="twitter:site" content="@SamosaApp" />' +
        								'<meta property="twitter:image" content='+imageURL +' />' +
        								'<meta property="twitter:player" content='+twitterURL+ '/>' +
        								'<meta property="twitter:player:width" content="512" />' +
        								'<meta property="twitter:player:height" content="512" />' +
        								'<meta property="twitter:card" content="player" />' +
        								'<meta property="twitter:title" content='+ obj["transcript"] +' />' +
        								'<meta property="twitter:app:name:googleplay" content="Samosa" />' +
        								'<meta property="twitter:app:id:googleplay" content="com.getsamosa" />'+
      							        '</head>' +
                                        body_template
                                
     				res.send(og_template)

     				res.end()
     			})
    	});

  		proxyRequest.end();
        	
});

app.get('*', function(req, res) {

  res.setHeader('Content-Type', 'text/html');
  res.end(
  		page_template
    );
});

// [END hello_world]

// [START server]
/* Start the server */
var server = app.listen(process.env.PORT || '8080', '0.0.0.0', function() {
  console.log('App listening at http://%s:%s', server.address().address, server.address().port);
  console.log("Press Ctrl+C to quit.");
});
// [END server]
