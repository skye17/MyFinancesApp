/**
 * Created by skye17 on 08.08.16.
 */
var app = angular.module('custom-directives', []);

app.directive("navTabs", function() {
    return {
        restrict: "E",

        templateUrl: "tabs.html",
        controller: function() {
            this.tab = 0;

            this.isSet = function(checkTab) {
                return this.tab === checkTab;
            };

            this.setTab = function(activeTab) {
                this.tab = activeTab;
            };
        },
        controllerAs: "tab"
    };
});

app.directive("spendings", function() {
    return {
        restrict: "E",
        templateUrl: "spendings.html"
    };
});

app.directive("balance", function() {
    return {
        restrict: "E",
        templateUrl: "balance.html"
    };
});

app.directive("calendar", function() {
    return {
        restrict: "E",
        templateUrl: "calendar.html"
    };
});
