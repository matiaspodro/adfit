angular.module('PublicidadesCtrl', ['ui.bootstrap']).controller('PublicidadesController', function($scope, $http, ML, DB) {

	$scope.filteredPublicidades 		= [];
	$scope.publicidades 					= [];
	$scope.maxSize 					= 5;
	$scope.isActive					= true;
  
	$scope.numPages = function () {
    	return Math.ceil($scope.publicidades.length / $scope.numPerPage);
  	};
  
  	$scope.$watch('currentPage + numPerPage', function() {
    	var begin 	= (($scope.currentPage - 1) * $scope.numPerPage)
    	, end 		= begin + $scope.numPerPage;
    
    	$scope.filteredPublicidades = $scope.publicidades.slice(begin, end);
  	});
      
  	var array = function(object){
	  	return $.map(object, function(value, index) {
		    return [value];
		});
  	}

	DB.getPublicidades().then(function(data) {
		$scope.publicidades 		= array(data);
		$scope.currentPage 		= 1;
		$scope.numPerPage 		= 10;
		$scope.isActive			= false;
	});

	$scope.procesarPublicidades = function(){

		DB.generatePublicidades({}).then(function(data) {

		});
	};

});