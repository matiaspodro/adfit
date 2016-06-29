angular.module('PublicidadesCtrl', ['ui.bootstrap']).controller('PublicidadesController', function($scope, $window, $http, $templateCache, ML, DB, Mailer) {

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


	$scope.procesarPublicidades = function(){
		DB.generatePublicidades({}).then(function(data) {
		});
	};


	$scope.enviarEmail = function(publicidad){

		Mailer.enviarEmail(publicidad).then(function(){
			$window.location.reload();
		});

	};

	var obtenerPublicidades = function(){
		DB.getPublicidades().then(function(data) {
			$scope.publicidades 		= array(data);
			$scope.currentPage 		= 1;
			$scope.numPerPage 		= 10;
			$scope.isActive			= false;
		});
	}

	obtenerPublicidades();




	var template = '';




});