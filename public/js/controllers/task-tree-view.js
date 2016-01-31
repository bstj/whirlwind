'use strict';

angular.module('whirlwind.task-tree-view', ['ngRoute', 'ui.tree','whirlwind.services.store', 'whirlwind.services.util'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/task-tree-view/:projectid', {
    templateUrl: 'views/task-tree-view',
    controller: 'View2Ctrl as ctrl'
  });
}])

.controller('View2Ctrl', ['util', 'store', '$routeParams', function(util, store, $routeParams) {
    var self = this;
    self.treeOptions = {
        dropped: function(event) {
            // need to fix order and parent
            var i;
            var changed = {};
            var task = event.source.nodeScope.$modelValue;
            var oldParent = event.source.nodeScope.$parentNodeScope.$modelValue;
            var newParent = event.dest.nodesScope.$parent.$modelValue;

            // first update indexes on old array
            if (oldParent !== undefined) {
                for (i = 0; i < oldParent.nodes.length; i++) {
                    if (oldParent.nodes[i].order !== i) {
                        oldParent.nodes[i].order = i;
                        changed[oldParent.nodes[i]._id.toString()] = oldParent.nodes[i];
                    }
                }
            }
            if (newParent !== undefined && newParent !== oldParent) {
                for (i = 0; i < newParent.nodes.length; i++) {
                    if (newParent.nodes[i].order !== i) {
                        newParent.nodes[i].order = i;
                        changed[newParent.nodes[i]._id.toString()] = newParent.nodes[i];
                    }
                }
            }
            task.parent = (newParent === undefined) ? 0 : newParent._id;
            changed[task._id.toString()] = task;
            store.bulkSave(changed);
        }
    };

    var initNodes = function(parent) {
        if (self.children[parent._id.toString()]) {
            parent.nodes = self.children[parent._id.toString()].sort(function(t1, t2) {
                return t1.order - t2.order;
            });
            angular.forEach(parent.nodes, initNodes);
        }
    };

    var initTasks = function(tasks) {
        self.children = {};
        angular.forEach(tasks, function(task){
          var parent = task.parent.toString();
          if(self.children[parent] === undefined) {
            self.children[parent] = [task];
          } else {
            self.children[parent].push(task);
          }
        });

        self.root = self.children["0"];
        initNodes(self.root[0]);
    };

    var query = store.tasks($routeParams.projectid);
    query.$promise.then(function(tasks) {
        initTasks(tasks);
    });

    self.delete = function(task) {
        console.log("delete " + task._id);
        store.delete(task);
    };
    self.split = function(task) {
        console.log("split " + task._id);
        var list = task.description.split(/<li>|<\/li><li>|<\/li>/);
        var subestimate = task.estimate / (list.length - 2);
        var currentChildrenN = task.nodes.length - 1;
        for (i = 1; i < list.length - 1; i++) { // ignore first and last
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



}]);