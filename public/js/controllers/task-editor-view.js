'use strict';

angular.module('whirlwind.task-editor-view', ['ngRoute', 'ngAnimate', 'textAngular','whirlwind.services.store'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/task-editor-view/:taskid', {
    templateUrl: 'views/task-editor-view',
    controller: 'View1Ctrl as ctrl'
  });
}])

.controller('View1Ctrl', ['store', '$routeParams', function(store, $routeParams) {
      var self = this;
      self.getTask = function() {
          self.task = store.getCurrent();
      };
      self.save = function() {
          store.save(self.task);
          window.history.back();

      };
      self.statusOptions = [
          {label:"Not Started", id:"not started"},
          {label:"In Progress", id:"in progress"},
          {label:"Blocked", id:"blocked"},
          {label:"Awaiting resource", id:"awaiting resource"},
          {label:"Complete", id:"complete"},
          {label:"Ignore", id:"ignore"}
      ];
      self.unitOptions = [
            "hours","days","weeks","months","percent"
      ];
 }]);