var app = angular.module('partyApp',[]);

app.controller('searchController', function($scope, $http) {

	$scope.request = '';
	$scope.response = '';
	

	$scope.$watch('request', function() {
		fetch();
	});

	function fetch () {
		
		if($scope.request !== null && $scope.request.length !== 0){
			$scope.encodedSearch = encodeURIComponent($scope.request);
			$http.get('search?q=' + $scope.encodedSearch + '&type=artist')
			.then(function(response){
				$scope.response = response.data; 
				console.log(response.data);
			});
		}
	}
});