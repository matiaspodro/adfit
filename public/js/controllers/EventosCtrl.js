angular.module('EventosCtrl', ['ui.bootstrap']).controller('EventosController', function($scope, $http, ML, DB, eventoShareData) {

	$scope.filteredEventos 		= [];
	$scope.eventos 				= [];
	$scope.maxSize 				= 5;
	$scope.isActive				= true;
  
	$scope.numPages = function () {
    	return Math.ceil($scope.eventos.length / $scope.numPerPage);
  	};
  
  	$scope.$watch('currentPage + numPerPage', function() {
    	var begin 	= (($scope.currentPage - 1) * $scope.numPerPage)
    	, end 		= begin + $scope.numPerPage;
    
    	$scope.filteredEventos = $scope.eventos.slice(begin, end);
  	});
      
  	var array = function(object){
	  	return $.map(object, function(value, index) {
		    return [value];
		});
  	}

	DB.getEventos().then(function(data) {
		$scope.eventos 		= array(data);
		$scope.currentPage 		= 1;
		$scope.numPerPage 		= 10;
		$scope.isActive			= false;
	});


	// $scope.verDetalle = function(evento){
	// 	eventoShareData.eventoActual = evento;			
	// };

});