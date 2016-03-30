var app = angular.module('partyApp',[]);

app.controller('searchController', function() {

	this.req = '';
	this.res = '';

	this.search = function(query) {
        this.query = query;

    }
});