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

var QueryTypesText = {
    0 : "Recent Search Queries",
    1 : "Most searched queries",
    2 : "Most searched queries with out results",
    3 : "Most queries with spell corrected types",
    4 : "Most queries search terms",
    5 : "User Query no results(created_at, desc)"
}

module.exports = {

	ajax_url: ajaxUrl(),
  query_text: QueryTypesText
}
