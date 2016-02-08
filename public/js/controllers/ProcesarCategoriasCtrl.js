angular.module('ProcesarCategoriasCtrl', []).controller('ProcesarCategoriasController', function($scope, $http, ML, DB) {

	$scope.procesarTodasLasCategoriasDesdeCero = function(){
		$scope.isActive1 = true;

	    ML.todasLasCategoriasConProductos().then(function(data) {
	    	$scope.mensajeBD = data;
			$scope.isActive1 = false;
	    }, function(data) {
	    	$scope.mensajeBDError = data;
			$scope.isActive1 = false;
	    });

	};

	$scope.fechaUlimaCategoriaEnBD = function(){
		$scope.isActive3 = true;

	    DB.getLastDateProd().then(function(data) {
	    	$scope.ultimaFecha = data;
			$scope.isActive3 = false;
	    });

	};


});
