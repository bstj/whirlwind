'use strict';

// Declare app level module which depends on controllers, and services
angular.module('whirlwind', [
  'ngRoute',
  'whirlwind.projects-view',
  'whirlwind.task-tree-view',
  'whirlwind.task-editor-view'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/task-editor-view'});
}]);
