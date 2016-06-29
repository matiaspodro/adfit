angular.module('RelacionesCtrl', ['ui.bootstrap']).controller('RelacionesController', function($scope, $http, ML, DB, relacionShareData) {

	$scope.filteredRelaciones 		= [];
	$scope.relaciones 					= [];
	$scope.maxSize 					= 5;
	$scope.isActive					= true;
  
	$scope.numPages = function () {
    	return Math.ceil($scope.relaciones.length / $scope.numPerPage);
  	};
  
  	$scope.$watch('currentPage + numPerPage', function() {
    	var begin 	= (($scope.currentPage - 1) * $scope.numPerPage)
    	, end 		= begin + $scope.numPerPage;
    
    	$scope.filteredRelaciones = $scope.relaciones.slice(begin, end);
  	});
      
  	var array = function(object){
	  	return $.map(object, function(value, index) {
		    return [value];
		});
  	}

	DB.getRelaciones().then(function(data) {
		$scope.relaciones 		= array(data);
		$scope.currentPage 		= 1;
		$scope.numPerPage 		= 10;
		$scope.isActive			= false;
	});
});