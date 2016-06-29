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
'ConfiguracionCtrl',
'VistaPreviaCtrl',
'MLService', 
'DBService', 
'ArbolService', 
'MailerService', 
'PublicidadService', 
'ventaShareData', 
'productoShareData', 
'relacionShareData',
'categoryDirective',
'modalDirective',
'templateDirective'
])

.constant('angularMomentConfig', {
  preprocess: 'utc',
  timezone: 'Europe/Berlin'
});