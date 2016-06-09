angular.module('sampleApp', ['ngRoute', 'appRoutes', 'angularMoment', 
'LoginCtrl', 
'MainCtrl', 
'VentasCtrl', 
'DetalleVentaCtrl', 
'DetalleProductoCtrl', 
'CategoriasCtrl', 
'CategoriaCtrl', 
'ProductosCtrl', 
'ProcesarVentasCtrl', 
'ProcesarProductosCtrl', 
'ProcesarCategoriasCtrl', 
'RelacionesCtrl',  
'EventosCtrl', 
'PublicidadesCtrl', 
'MLService', 
'DBService', 
'ArbolService', 
'ventaShareData', 
'productoShareData', 
'relacionShareData',
'categoryDirective',
'modalDirective'
])

.constant('angularMomentConfig', {
  preprocess: 'utc',
  timezone: 'Europe/Berlin'
});