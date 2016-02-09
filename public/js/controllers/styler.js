/**
 * Created by ben on 06/02/16.
 */
"use strict";
angular.module('whirlwind.styler', ['whirlwind.services.util', 'color.picker'])

.controller('StyleController', ['util', '$scope', function(util, $scope) {
    var self = this;
    var defaultStyles = {
        // statuses
        "in progress": {size: 14, color: "black", show: true, selector: '.ww-status-in-progress'},
        blocked: {size: 14, color: "black", show: true, selector: '.ww-status-blocked'},
        "not started": {size: 14, color: "black", show: true, selector: '.ww-status-not-started'},
        complete: {size: 14, color: "black", show: true, selector: '.ww-status-complete'},
        ignore: {size: 14, color: "black", show: true, selector: '.ww-status-ignore'},

        // fields
        status: {size: 14, color: "black", show: false, selector: '.ww-status'},
        estimate: {size: 14, color: "black", show: false, selector: '.ww-priority'},
        priority: {size: 14, color: "black", show: false, selector: '.ww-description'},
        description: {size: 14, color: "black", show: false, selector: '.ww-notes'},
        notes: {size: 14, color: "black", show: false, selector: '.ww-modified'},
        modified: {size: 14, color: "black", show: false, selector: '.ww-estimate'}
    };

    if (! localStorage["styles"]) {
        localStorage["styles"] = JSON.stringify(defaultStyles);
    }

    self.styles = {};
    self.rules = {};

    self.saveStyles = function() {
        localStorage["styles"] = JSON.stringify(self.styles);
    };
    self.loadStyles = function() {
        self.styles = JSON.parse(localStorage["styles"]);
    };
    self.onChange = function(style) {
        self.rules[style].set("color", self.styles[style].color);
        self.rules[style].set("font-size", self.styles[style].size + "px");
        self.rules[style].set("display", (self.styles[style].show)?"block":"none");
        self.saveStyles();
    };

    self.loadStyles();
    for(var style in self.styles) {
        self.rules[style] = util.addCssRule(self.styles[style].selector, "");
        self.onChange(style);
    }

}]);