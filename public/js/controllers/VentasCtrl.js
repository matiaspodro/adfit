angular.module('VentasCtrl', ['ui.bootstrap']).controller('VentasController', function($scope, $http, ML, DB, ventaShareData) {

	$scope.filteredVentas 	= [];
	$scope.ventas 			= [];
	$scope.maxSize 			= 5;
	$scope.isActive			= true;
  
	$scope.numPages = function () {
    	return Math.ceil($scope.ventas.length / $scope.numPerPage);
  	};
  
  	$scope.$watch('currentPage + numPerPage', function() {
    	var begin = (($scope.currentPage - 1) * $scope.numPerPage)
    	, end = begin + $scope.numPerPage;
    
    	$scope.filteredVentas = $scope.ventas.slice(begin, end);
  	});
      
  	var array = function(object){
	  	return $.map(object, function(value, index) {
		    return [value];
		});
  	}

	DB.getVentas().then(function(data) {
		$scope.ventas 		= array(data);
		$scope.currentPage 	= 1;
		$scope.numPerPage 	= 10;
		$scope.isActive		= false;
	});


	$scope.verDetalle = function(venta){
		ventaShareData.ventaActual = venta;			
	};

});
