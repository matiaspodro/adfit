angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/inicio', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})

		.when('/ventas', {
			templateUrl: 'views/ventas.html',
			controller: 'VentasController'	
		})

		.when('/detalleVenta', {
			templateUrl: 'views/detalleVenta.html',
			controller: 'DetalleVentaController'	
		})

		.when('/detalleProducto', {
			templateUrl: 'views/detalleProducto.html',
			controller: 'DetalleProductoController'	
		})

		.when('/categorias', {
			templateUrl: 'views/categorias.html',
			controller: 'CategoriasController'
		})

		.when('/productos', {
			templateUrl: 'views/productos.html',
			controller: 'ProductosController'
		})

		.when('/procesarVentas', {
			templateUrl: 'views/procesarVentas.html',
			controller: 'ProcesarVentasController'
		})

		.when('/procesarProductos', {
			templateUrl: 'views/procesarProductos.html',
			controller: 'ProcesarProductosController'
		})

		.when('/eventos', {
			templateUrl: 'views/eventos.html',
			controller: 'EventosController'
		});

	$locationProvider.html5Mode(true);

}]);