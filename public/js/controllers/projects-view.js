'use strict';

angular.module('whirlwind.projects-view', ['ngRoute', 'ngAnimate', 'whirlwind.services.store'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/projects-view', {
    templateUrl: '/views/projects-view',
    controller: 'ViewCtrl as ctrl'
  });
}])

.controller('ViewCtrl', ['store', function(store) {
    var self = this;
    self.projects = store.projects();
    self.edit = function (project) {
        store.setCurrent(project);
        document.location = "#/task-editor-view/" + project._id;
    };
    self.tasks = function (project) {
        document.location = "#/task-tree-view/" + project._id;
    };

    self.newProject = function() {
        store.create({
            name:"",
            parent: 0,
            description:"",
            priority:0,
            notes:"",
            estimate:0,
            estimate_units:"hours",
            status:"not started",
            modified:""
        }).then(function(project){
            project.project = project._id;
            store.setCurrent(project);
            document.location = "#/task-editor-view/" + project._id;
        });
    }
}]);