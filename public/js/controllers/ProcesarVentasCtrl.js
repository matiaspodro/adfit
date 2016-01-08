angular.module('ProcesarVentasCtrl', []).controller('ProcesarVentasController', function($scope, $http, ML, DB) {

	$scope.procesarTodasLasVentas = function(){
		$scope.isActive1 = true;

	    ML.todasLasVentas().then(function(data) {
	    	$scope.mensajeBD = data;
			$scope.isActive1 = false;
	    }, function(data) {
	    	$scope.mensajeBDError = data;
			$scope.isActive1 = false;
	    });

	};

	$scope.fechaUlimaVentaEnBD = function(){
		$scope.isActive3 = true;

	    DB.getLast().then(function(data) {
	    	$scope.ultimaFecha = data.date_created;
	    	$scope.ultimoID = data.id;
			$scope.isActive3 = false;
	    });

	};

	$scope.cantidadDeVentas = function(){
		$scope.isActive4 = true;

	    DB.getCantVentas().then(function(data) {
	    	$scope.cant = data.cant;
			$scope.isActive4 = false;
	    });

	};

});
