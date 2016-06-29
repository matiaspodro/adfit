angular.module('VentasCtrl', ['ui.bootstrap']).controller('VentasController', function($sce,$scope, $http, ML, DB, ventaShareData) {

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
			$scope.filteredVentas = [];
			var ventasAux = array(data);
			var first = true;
			angular.forEach(ventasAux, function(venta) {
				ML.getItem(venta.order_items[0].item.id).then(function(item) {
					ML.getItemDescription(venta.order_items[0].item.id).then(function(item_desc) {
						$http.get('https://api.mercadolibre.com/categories/'+venta.order_items[0].item.category_id)
						.success(function(cat) {
							venta.thumbnail = item.secure_thumbnail;
							venta.pictures = item.pictures;
							venta.category = cat.name;
							venta.categories = cat.path_from_root;
							venta.description = item_desc.text;					
							$scope.filteredVentas.push(venta);
							if (first){
								first = false;
								$scope.verDetalle(venta);
								$scope.isActive = false;
							}
						});
					});
				});
			});
		});
	};

	$scope.getHtml = function(html){
        return $sce.trustAsHtml(html);
    };


	$scope.detalle = {venta:''};

	$scope.verDetalle = function(venta){
		$scope.detalle.venta 		= venta;
		$scope.detalle.order_items	= $scope.detalle.venta.order_items[0];
		$scope.detalle.vendedor		= $scope.detalle.venta.buyer;
		//$scope.detalle.fechaAlta	= ($scope.detalle.venta.date_created) ? moment($scope.detalle.venta.date_created).utc().format('DD-MM-YYYY') : '';
		
		$scope.detalle.fechaAlta	= ($scope.detalle.venta.date_created) ? $scope.detalle.venta.date_created : '';
		$scope.detalle.envio		= ($scope.detalle.venta.shipping) ? $scope.detalle.venta.shipping : '';
		$scope.detalle.pagos		= ($scope.detalle.venta.payments) ? $scope.detalle.venta.payments[0] : '';
		$scope.detalle.feedback		= ($scope.detalle.venta.feedback) ? $scope.detalle.venta.feedback : '';
	};

	calcularCantVentas();

});
