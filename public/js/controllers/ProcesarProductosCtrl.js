angular.module('ProcesarProductosCtrl', []).controller('ProcesarProductosController', function($scope, $http, ML, DB) {

	$scope.procesarTodasLasProductosDesdeCero = function(){
		$scope.isActive1 = true;

	    ML.todosLosProductos().then(function(data) {
	    	$scope.mensajeBD = data;
			$scope.isActive1 = false;
	    }, function(data) {
	    	$scope.mensajeBDError = data;
			$scope.isActive1 = false;
	    });

	};

	$scope.fechaUlimaProductoEnBD = function(){
		$scope.isActive3 = true;

	    DB.getLastDateProd().then(function(data) {
	    	$scope.ultimaFecha = data;
			$scope.isActive3 = false;
	    });

	};


});
