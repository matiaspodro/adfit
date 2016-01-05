angular.module('DetalleProductoCtrl', ['ui.bootstrap']).controller('DetalleProductoController', function($scope, $http, ML, DB, productoShareData) {


	$scope.producto 	= productoShareData.productoActual;

	ML.getItem($scope.producto.id).then(function(data) {
		$scope.item = data;
		console.log(data);
	}, function(data) {
	});

	
});
