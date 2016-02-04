'use strict';

angular.module('whirlwind.task-tree-view', ['ngRoute', 'ui.tree','ui.bootstrap','whirlwind.services.store', 'whirlwind.services.util'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/task-tree-view/:projectid', {
    templateUrl: 'views/task-tree-view',
    controller: 'TaskTreeController as ctrl'
  });
}])

.controller('TaskTreeController', ['$scope','util', 'store', '$routeParams', '$uibModal', function($scope, util, store, $routeParams, $uibModal) {
    var self = this;
    self.treeOptions = {
        dropped: function(event) {
            // need to fix order and parent
            var i;
            var changed = {};
            var node = event.source.nodeScope.$modelValue;
            var oldParent = (event.source.nodeScope.$parentNodeScope === null) ? self.root[0] : event.source.nodeScope.$parentNodeScope.$modelValue;
            var newParent = event.dest.nodesScope.$parent.$modelValue;

            // first update indexes on old array
            if (oldParent !== undefined) {
                for (i = 0; i < oldParent.nodes.length; i++) {
                    if (oldParent.nodes[i].task.order !== i) {
                        oldParent.nodes[i].task.order = i;
                        changed[oldParent.nodes[i].task._id.toString()] = oldParent.nodes[i].task;
                    }
                }
            }
            if (newParent !== undefined && newParent !== oldParent) {
                for (i = 0; i < newParent.nodes.length; i++) {
                    if (newParent.nodes[i].task.order !== i) {
                        newParent.nodes[i].task.order = i;
                        changed[newParent.nodes[i].task._id.toString()] = newParent.nodes[i].task;
                    }
                }
            }
            node.task.parent = (newParent === undefined) ? self.root[0].task._id : newParent.task._id;
            changed[node.task._id.toString()] = node.task;
            store.bulkSave(changed);
        }
    };

    var initNodes = function(node) {
        if (self.children[node.task._id.toString()]) {
            node.nodes = self.children[node.task._id.toString()].sort(function(n1, n2) {
                return n1.task.order - n2.task.order;
            });
            angular.forEach(node.nodes, initNodes);
        }
    };

    var initTasks = function(tasks) {
        self.children = {};
        angular.forEach(tasks, function(task){
            var node = {task: task, nodes: []};
            var parent = task.parent.toString();
            if(self.children[parent] === undefined) {
                self.children[parent] = [node];
            } else {
                self.children[parent].push(node);
            }
        });

        self.root = self.children["0"];
        initNodes(self.root[0]);
    };

    var query = store.tasks($routeParams.projectid);
    query.$promise.then(function(tasks) {
        initTasks(tasks);
    });

    self.delete = function(scope) {
        var task = scope.$modelValue.task;
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'deleteConfirmationModal.html',
            controller: 'DeleteTaskModalController as dctrl'
        });
        modalInstance.result.then(function () {
            console.log("delete " + task._id);
            store.delete(task);
            scope.remove(scope);
        });
    };
    self.split = function(node) {
        var task = node.task;
        var list = task.description.split(/<li>|<\/li><li>|<\/li>/);
        var subestimate = task.estimate / (list.length - 2);
        var currentChildrenN = node.nodes.length - 1;
        for (var i = 1; i < list.length - 1; i++) { // ignore first and last
            // TODO need to check if child already exists with name
            store.create({
                name: util.stripTags(list[i]),
                parent: task._id,
                project: task.project,
                description: "",
                priority: 0,
                notes: "",
                estimate: subestimate,
                estimate_units: task.estimate_units,
                status: "not started",
                modified: "",
                order: currentChildrenN + i
            });
        }
    };
    self.addChild = function(task) {
        console.log("addChild " + task._id);
        store.create({
            name:"",
            parent: task._id,
            project: task.project,
            order: (task.nodes === undefined) ? 0 : task.nodes.length,
            description:"",
            priority:0,
            notes:"",
            estimate:0,
            estimate_units:"hours",
            status:"not started",
            modified:""
        }).then(function(newTask) {
            store.setCurrent(newTask);
            document.location = "#/task-editor-view/" + newTask._id;
        });

    };
    self.hideOthers = function(task) {
        console.log("hideOthers " + task._id);
    };
    self.expand = function(task) {
        console.log("expand " + task._id);
    };
    self.edit = function(task) {
        console.log("edit " + task._id);
        store.setCurrent(task);
        document.location = "#/task-editor-view/" + task._id;
    };
    self.isRoot = function(node) {
        return node === self.root[0];
    }

}]);

angular.module('whirlwind.task-tree-view').controller('DeleteTaskModalController', ['$uibModalInstance', function ($uibModalInstance) {
    var self = this;

    self.delete = function () {
        $uibModalInstance.close('delete');
    };

    self.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);