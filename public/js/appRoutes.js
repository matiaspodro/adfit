angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/inicio2', {
			templateUrl: 'views/home.html',
			controller: 'LoginController'
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

		.when('/procesarCategorias', {
			templateUrl: 'views/procesarCategorias.html',
			controller: 'ProcesarCategoriasController'
		})

		.when('/relaciones', {
			templateUrl: 'views/relaciones.html',
			controller: 'RelacionesController'
		})

		.when('/eventos', {
			templateUrl: 'views/eventos.html',
			controller: 'EventosController'
		})

		.when('/publicidades', {
			templateUrl: 'views/publicidades.html',
			controller: 'PublicidadesController'
		})

		.when('/configuracion', {
			templateUrl: 'views/configuracion.html',
			controller: 'ConfiguracionController'
		})


		.when('/vistaPrevia/:id', {
			templateUrl: 'views/vistaPrevia.html',
			controller: 'VistaPreviaController'
		})

		;


	$locationProvider.html5Mode(true);

}]);