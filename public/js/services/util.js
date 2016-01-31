/**
 * Created by ben on 31/01/16.
 */
'use strict';

angular.module('whirlwind.services.util', [

]).factory('util', function() {

    // Taken from from https://github.com/SitePen/dgrid/blob/master/util/misc.js
    //
    // establish an extra stylesheet which addCssRule calls will use,
    // plus an array to track actual indices in stylesheet for removal
    var extraRules = [],
        extraSheet,
        removeMethod,
        rulesProperty,
        invalidCssChars = /([^A-Za-z0-9_\u00A0-\uFFFF-])/g;

    function removeRule(index) {
        // Function called by the remove method on objects returned by addCssRule.
        var realIndex = extraRules[index],
            i, l;
        if (realIndex === undefined) {
            return; // already removed
        }

        // remove rule indicated in internal array at index
        extraSheet[removeMethod](realIndex);

        // Clear internal array item representing rule that was just deleted.
        // NOTE: we do NOT splice, since the point of this array is specifically
        // to negotiate the splicing that occurs in the stylesheet itself!
        extraRules[index] = undefined;

        // Then update array items as necessary to downshift remaining rule indices.
        // Can start at index + 1, since array is sparse but strictly increasing.
        for (i = index + 1, l = extraRules.length; i < l; i++) {
            if (extraRules[i] > realIndex) {
                extraRules[i]--;
            }
        }
    }

    return {
        stripTags: function(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText;
        },

        addCssRule: function (selector, css) {
            // summary:
            //		Dynamically adds a style rule to the document.  Returns an object
            //		with a remove method which can be called to later remove the rule.

            if (!extraSheet) {
                // First time, create an extra stylesheet for adding rules
                extraSheet = document.createElement('style');
                document.getElementsByTagName('head')[0].appendChild(extraSheet);
                // Keep reference to actual StyleSheet object (`styleSheet` for IE < 9)
                extraSheet = extraSheet.sheet || extraSheet.styleSheet;
                // Store name of method used to remove rules (`removeRule` for IE < 9)
                removeMethod = extraSheet.deleteRule ? 'deleteRule' : 'removeRule';
                // Store name of property used to access rules (`rules` for IE < 9)
                rulesProperty = extraSheet.cssRules ? 'cssRules' : 'rules';
            }

            var index = extraRules.length;
            extraRules[index] = (extraSheet.cssRules || extraSheet.rules).length;
            extraSheet.addRule ?
                extraSheet.addRule(selector, css) :
                extraSheet.insertRule(selector + '{' + css + '}', extraRules[index]);

            return {
                get: function (prop) {
                    return extraSheet[rulesProperty][extraRules[index]].style[prop];
                },
                set: function (prop, value) {
                    if (typeof extraRules[index] !== 'undefined') {
                        extraSheet[rulesProperty][extraRules[index]].style[prop] = value;
                    }
                },
                remove: function () {
                    removeRule(index);
                }
            };
        }
    };
});