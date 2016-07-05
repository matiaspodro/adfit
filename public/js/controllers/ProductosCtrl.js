angular.module('ProductosCtrl', ['ui.bootstrap']).controller('ProductosController', function($scope, $http, ML, DB, productoShareData) {

	$scope.filteredProductos 	= [];
	$scope.productos 			= [];
	$scope.maxSize 				= 5;
	$scope.isActive				= true;
  
	$scope.numPages = function () {
    	return Math.ceil($scope.productos.length / $scope.numPerPage);
  	};
  
  	$scope.$watch('currentPage + numPerPage', function() {
    	var begin = (($scope.currentPage - 1) * $scope.numPerPage)
    	, end = begin + $scope.numPerPage;
    
    	//$scope.filteredProductos = $scope.productos.slice(begin, end);

    	var prods = $scope.productos.slice(begin, end);
		var i = 0;

		angular.forEach(prods, function(prod) {
			ML.getItem(prod.id).then(function(item) {
				prod.thumbnail = item.secure_thumbnail;
				prod.title = item.title;
				i++;
				if (prods.length == i){
					$scope.filteredProductos = prods;
				}

			});
		});

  	});
      
  	var array = function(object){
	  	return $.map(object, function(value, index) {
		    return [value];
		});
  	}

	DB.getProductos().then(function(data) {

		$scope.productos 		= array(data);
		$scope.currentPage 		= 1;
		$scope.numPerPage 		= 10;
		$scope.isActive			= false;


	});


	$scope.verDetalle = function(producto){
		productoShareData.productoActual = producto;			
	};

});