angular.module('categoryDirective', []).directive('category', ['$compile', function($compile) {
  return {
    restrict: 'E',
    transclude: false,
    scope: {
      padre: '=padre',
      padreVisible: '=padreVisible',
      callbackModal: '=callbackModal'
    },
    templateUrl: 'js/directives/views/categoria.html',
    link: function (scope) {
      scope.visible = true;
      scope.visible2 = true;

    },
            compile: function (el) {
                var contents = el.contents().remove();
                var compiled;
                return function(scope,el){
                    if(!compiled)
                        compiled = $compile(contents);
                    
                    compiled(scope,function(clone){
                        el.append(clone);
                    });
                };
            }
  };
}]);