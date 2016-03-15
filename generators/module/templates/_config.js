'use strict';

// Setting up route
angular.module('<%= moduleName %>').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    // Module state routing
    $stateProvider
      .state('<%= moduleName %>', {
        url: '<%= moduleRoute %>',
        templateUrl: '/app/scripts/modules/<%= moduleName %>/templates/<%= moduleName %>.template.html'
      });
  }
]);
