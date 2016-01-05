angular.module('DetalleVentaCtrl', ['ui.bootstrap']).controller('DetalleVentaController', function($scope, $http, ML, DB, ventaShareData) {


	$scope.venta 		= ventaShareData.ventaActual;
	$scope.order_items	= $scope.venta.order_items[0];
	$scope.vendedor		= $scope.venta.buyer;
	$scope.envio		= $scope.venta.shipping;
	$scope.pagos		= $scope.venta.payments[0];
	$scope.feedback		= $scope.venta.feedback;

	ML.getItem($scope.order_items.item.id).then(function(data) {
		$scope.item = data;
		console.log(data);
	}, function(data) {
	});

	
});
