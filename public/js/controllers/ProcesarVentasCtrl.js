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
	    	$scope.ultimaFecha = data.date_last_updated;
	    	$scope.ultimoID = data.id;
			$scope.isActive3 = false;
	    });

	};


});
