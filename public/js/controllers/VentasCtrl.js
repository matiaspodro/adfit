angular.module('VentasCtrl', ['ui.bootstrap']).controller('VentasController', function($scope, $http, ML, DB, ventaShareData) {

	$scope.filteredVentas 	= [];
	$scope.isActive			= true;
	$scope.numPerPage 		= 10;
	$scope.currentPage 		= 1;

	$scope.cantVentas 		= 0;

	var calcularCantVentas = function () {
		DB.getCantVentas().then(function(data) {
			$scope.cantVentas = data.cant;
		});
  	};
  
	$scope.numPages = function () {
    	return Math.ceil($scope.cantVentas / $scope.numPerPage);
  	};
  
  	$scope.$watch('currentPage', function() {
    	var begin = (($scope.currentPage - 1) * $scope.numPerPage)
    	, end = begin + $scope.numPerPage;
    	
    	traerPagina(begin, $scope.numPerPage);
    	
  	});
      
  	var array = function(object){
	  	return $.map(object, function(value, index) {
		    return [value];
		});
  	}

	var traerPagina = function(begin, cant){
		DB.getVentasPaginada(begin, cant).then(function(data) {			
			$scope.isActive			= false;
			$scope.filteredVentas 	= array(data);

		});
	};

	$scope.verDetalle = function(venta){
		ventaShareData.ventaActual = venta;			
	};

	calcularCantVentas();

});
