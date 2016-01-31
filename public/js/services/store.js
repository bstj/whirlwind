'use strict';

angular.module('whirlwind.services.store', [
    'ngResource'
]).factory('store', function($resource) {
    var data = $resource("/rest/tasks/:_id", {},
        {
            projects: {params: {parent:0}, isArray:true, cache:false},
            tasks: {isArray:true, cache:false}
        });
    var currentTask = null;

    return {
        projects: function() {
            return data.projects();
        },

       getTask: function(id) {
            if (!id) {
                id = currentTaskId;
            }
            return data.get({_id:id});
        },

        save: function(task) {
            task.$save();
        },

        bulkSave: function(tasks) {
            // TODO implement single request solution
            angular.forEach(tasks, this.save);
        },

        create: function(task) {
            var newTask = new data(task);
            var ret = newTask.$save();
            return ret;
        },

        tasks: function(projectId) {
            return data.tasks({project:projectId});
        },

        setCurrent: function(task) {
            currentTask = task;
        },

        getCurrent: function() {
            return currentTask;
        },

        delete: function(task) {
            if (task.nodes !== undefined) {
                for (var i = 0; i < task.nodes.length; i++) {
                    this.delete(task.nodes[i]);
                }
            }
            task.$delete({_id: task._id});
        }

    };
});