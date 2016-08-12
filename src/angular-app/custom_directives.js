angular.module('custom-directives', [])
    .directive("navTabs", function() {
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
})
    .directive("spendings", function() {
    return {
        restrict: "E",
        templateUrl: "spendings.html"
    };
    })
    .directive("balance", function() {
    return {
        restrict: "E",
        templateUrl: "balance.html"
    };
})
    .directive("calendar", function() {
        return {
            restrict: "E",
            templateUrl: "calendar.html"
        };
});
