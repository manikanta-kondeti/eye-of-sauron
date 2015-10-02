'use strict';

var ajaxUrl  = function ajax_url() {

	var regex = new RegExp('localhost', 'gi');

	var url = window.location.origin;

	var default_url = "https://the-tasty-samosa.appspot.com";

    if(url.match(regex)) {
    	 return default_url
   	}
   	else {
   		return url;
   	}
}

module.exports = {

	ajax_url: ajaxUrl()

}