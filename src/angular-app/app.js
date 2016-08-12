
function initLocalStorage() {
    if (!localStorage.sources) {
        var sourceTypes = ['Дебетовая карта', 'Кредитная карта', 'Наличные', 'Cчет'];
        var sources = [
            {id:0, number:5400400040004000, balance:1000, type:sourceTypes[0], data:{}},
            {id:1, number:5000000000000000, balance:2000, type:sourceTypes[0], data:{}},
            {id:2, number:1234123412340000, balance:500, type:sourceTypes[1], data:{}},
            {id:3, balance:700, type:sourceTypes[2]},
            {id:4, number:12345678901234, balance:10000, type:sourceTypes[3]}
        ];

        var categories = [
            {name:'Еда'}, {name:'Развлечения/отдых'}, {name:'Личная гигиена'}, {name: 'Медицина/Здоровье'},
            {name:'Одежда/обувь'}, {name: 'Транспорт'}, {name:'Жилищные расходы'},{name:'Счета/платежи'},
            {name:'Подарки и благотворительность'},{name:'Налоги'},{name: 'Путешествия/перемещения'},{name:'Другое'}
        ];

        var spendings = [
            {
                name:'Ужин с друзьями',
                category:categories[0],
                cost:1000,
                source:sources[0],
                date:new Date()
            },
            {
                name:'Аквапарк',
                category: categories[1],
                cost:900,
                source:sources[3],
                date:new Date(2016, 7, 4)
            },
            {
                name:'Абонемент в тренажерный зал',
                category: categories[3],
                cost:3000,
                source:sources[1],
                date:new Date(2016, 7, 9)
            },
            {
                name:'Коммунальные платежи',
                category: categories[7],
                cost:3000,
                source:sources[1],
                date:new Date(2016, 7, 1)
            }

        ];
        localStorage.sources = JSON.stringify(sources);
        localStorage.categories = JSON.stringify(categories);
        localStorage.spendings = JSON.stringify(spendings);
    }
}

angular.module('app', ['custom-directives'])
    .constant('sourceTypes', {
        types: ["Дебетовая карта", "Кредитная карта", "Наличные", "Cчет"]
    })
    .service('utilities', function () {
        var self = this;
        this.colors = ["#0000FF", "#7CFC00", "#B22222", "#DAA520", "#4B0082", "#FA8072", "#D2691E",
            "#FF7F50", "#008B8B","#87CEFA", "#CD853F", "#FF6347"];

        this.calculateSumByField = function (array, field) {
            return array.map(s => s[field]).reduce(function(a, b){return a+b;}, 0);
        };

        Array.prototype.shuffle = function() {
            var i = this.length, j, temp;
            if ( i == 0 ) return this;
            while ( --i ) {
                j = Math.floor( Math.random() * ( i + 1 ) );
                temp = this[i];
                this[i] = this[j];
                this[j] = temp;
            }
            return this;
        };

        Array.prototype.fill = function(val){
            for (var i = 0; i < this.length; i++){
                this[i] = val;
            }
            return this;
        };

        this.toggleField = function(scope, field) {
            scope[field] = !scope[field];
        };

        this.setField = function(scope, field, newVal) {
            if (scope[field] === newVal) {
                scope[field] = null;
            } else  {
                scope[field] = newVal;
            }
        };

        this.buildChart = function(ctx, labels, values) {
            var myData = {
                labels: labels,
                datasets: [{
                    data:values,
                    backgroundColor: self.colors.shuffle().slice(0, labels.length),
                    hoverBorderWidth: new Array(labels.length).fill(5)
                }]
            };

            return new Chart(ctx, {
                type: 'doughnut',
                data: myData,
                options: {
                    legend: {
                        display:false
                    }
                }
            });
        };

    })
    .run(['$rootScope', 'sourceTypes', function($rootScope, sourceTypes){
        initLocalStorage();
        $rootScope.sources = JSON.parse(localStorage.sources);
        $rootScope.sourceFilters = [{name:'Все источники'}, {name:'Все дебетовые карты', type:sourceTypes.types[0]},
            {name:'Все кредитные карты', type:sourceTypes.types[1]}, {name:'Наличные', type:sourceTypes.types[2]},
            {name:'Все счета', type:sourceTypes.types[3]}
        ];
    }])
    .controller('SpendingsController', ['$scope', 'utilities', function ($scope, utilities){
        var sumField = 'cost';
        $scope.categories = JSON.parse(localStorage.categories);
        $scope.spendings = JSON.parse(localStorage.spendings);
        $scope.spendings.forEach(spending => spending.date = new Date(spending.date));

        $scope.spendingsByCategory = getInitialSpendingsByCategories($scope.categories, $scope.spendings);
        $scope.selectedSourceFilter = $scope.sourceFilters[0];

        var currentDate = new Date();
        $scope.selectedStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        $scope.selectedEndDate = currentDate;
        $scope.spending = {name:'Что-нибудь', date:currentDate, category:$scope.categories[0], source:$scope.sources[0]};
        $scope.selectedSpendings = filterSpendings($scope.spendings, filterSpendingByDate);

        $scope.manipulateChart = function() {
            var canvasContainer = document.getElementsByClassName('spendings-graph-container')[0];
            canvasContainer.innerHTML = '<canvas id="spendingsChart"></canvas>';
            $scope.spendingsChart();
        };

        $scope.spendingsChart = function() {
            var canvas = document.getElementById('spendingsChart');
            var ctx = canvas.getContext("2d");
            var categoryCosts = $scope.filteredByCategory
                    .map(function(spending) {
                        return {label:spending.category.name,
                        value:spending.sumCost};
                    });
            utilities.buildChart(ctx, categoryCosts.map(c => c.label), categoryCosts.map(c => c.value));
        };


        $scope.addSpending = function() {
            $scope.spendings.push($scope.spending);
            var filteredSpendings = $scope.spendingsByCategory.filter(spendings =>
                spendings.category.name === $scope.spending.category.name);
            if (filteredSpendings.length) {
                var categorySpendings = filteredSpendings[0];
                categorySpendings.spendings.push($scope.spending);
                categorySpendings.sumCost += $scope.spending[sumField];
                if (filterSpendingBySource($scope.spending) && filterSpendingByDate($scope.spending)) {
                    $scope.selectedSpendings.push($scope.spending);
                }
            }
            $scope.spending = {};
            $scope.newSpending = false;
        };

        $scope.toggleSpendingForm = () => utilities.toggleField($scope, 'newSpending');
        $scope.toggleSelectedCategory = (category) => utilities.setField($scope, 'selectedCategory', category);

        $scope.$watchCollection('spendings', dumpData);
        $scope.$watchCollection('selectedSpendings', updateView);
        $scope.$watchGroup(['selectedSourceFilter', 'selectedStartDate', 'selectedEndDate'], updateSpendings, true);


        function updateView(){
            $scope.filteredByCategory = filterSpendingsByCategories($scope.selectedSpendings);
            $scope.sumSpendings = utilities.calculateSumByField($scope.selectedSpendings, sumField);
            $scope.manipulateChart();
        }

        function updateSpendings() {
            $scope.selectedSpendings = filterSpendings(filterAllSpendingsBySource($scope.spendings),filterSpendingByDate);
        }

        function filterSpendingsByCategories(selectedSpendings) {
            var newSpendings = $scope.spendingsByCategory.map(item =>
                (function(item){ return {category:item.category, spendings:item.spendings.filter(value => selectedSpendings.includes(value))}})(item));
            newSpendings = newSpendings.filter(item => item.spendings.length != 0);
            newSpendings.forEach(item => item.sumCost = utilities.calculateSumByField(item.spendings, sumField));
            return newSpendings;
        }

        function getInitialSpendingsByCategories(categories, spendings) {
            var spendingsByCategory =  categories.map(function(category) {
                return {category:category, spendings: spendings.filter(spending => spending.category.name === category.name)};
            });
            spendingsByCategory.forEach(item => item.sumCost = utilities.calculateSumByField(item.spendings, sumField));
            return spendingsByCategory;
        }

        function filterSpendings() {
            return arguments[0].filter(spending => arguments[1](spending));
        }

        function filterSpendingBySource(spending){
            var selectedFilter = $scope.selectedSourceFilter;
            if (!selectedFilter.type) {
                return true;
            }
            return spending.source.type === selectedFilter.type;
        }
        function filterSpendingByDate(spending) {
            var startDate = $scope.selectedStartDate;
            var endDate = $scope.selectedEndDate;
            return (spending.date >= startDate) && (spending.date <= endDate);
        }

        function filterAllSpendingsBySource(spendings) {
            if (!$scope.selectedSourceFilter.type){
                return spendings;
            }
            return spendings.filter(spending => spending.source.type === $scope.selectedSourceFilter.type);
        }
        function dumpData(){
            localStorage.sources = JSON.stringify($scope.sources);
            localStorage.spendings = JSON.stringify($scope.spendings);
        }
    }])
    .controller('BalanceController', ['$scope', 'utilities', 'sourceTypes', function ($scope, utilities, sourceTypes){
        var sumField = 'balance';
        $scope.transfer = {};
        $scope.newTransfer = false;
        $scope.sumBalance = utilities.calculateSumByField($scope.sources, sumField);

        $scope.sourcesByType = getInitialSourcesByType($scope.sources);

        $scope.manipulateChart = function() {
            var canvasContainer = document.getElementsByClassName('sources-graph-container')[0];
            canvasContainer.innerHTML = '<canvas id="sourcesChart"></canvas>';
            $scope.sourcesChart();
        };

        $scope.sourcesChart = function() {
            var canvas = document.getElementById('sourcesChart');
            var ctx = canvas.getContext("2d");
            var sourcesBalance = $scope.sourcesByType.filter(sourceType => sourceType.sources.length != 0).map(function(sourceType) {
                return {label:sourceType.type,
                    value:sourceType.sumBalance};
            });
            utilities.buildChart(ctx, sourcesBalance.map(c => c.label), sourcesBalance.map(c => c.value));
        };

        $scope.toggleTransferForm = () => utilities.toggleField($scope, 'newTransfer');
        $scope.toggleSelectedType = (type) => utilities.setField($scope, 'selectedType', type);


        $scope.makeTransfer = function() {
            var transferSource = $scope.sources.filter(src => src.id === $scope.transfer.source.id)[0];
            var transferDestination = $scope.sources.filter(src => src.id === $scope.transfer.destination.id)[0];
            if ($scope.transfer.amount <= transferSource.balance) {
                transferSource.balance -= $scope.transfer.amount;
                transferDestination.balance += $scope.transfer.amount;
            }
            $scope.transfer = {};
            $scope.newTransfer = false;
        };



        $scope.$watch('sources', updateView, true);

        function updateView(){
            recalculateSum();
            $scope.manipulateChart();
            dumpSources();
        }

        function recalculateSum(){
            $scope.sourcesByType.forEach(sourceType =>
                sourceType.sumBalance = utilities.calculateSumByField(sourceType.sources, sumField));
        }

        function dumpSources() {
            localStorage.sources = JSON.stringify($scope.sources);
        }

        function getInitialSourcesByType(sources){
            var sourcesByType = sourceTypes.types.map(function (type) {
                return {
                    type: type,
                    sources: sources.filter(source => source.type === type)
                }
            });

            sourcesByType.forEach(sourceType =>
                sourceType.sumBalance = utilities.calculateSumByField(sourceType.sources, sumField));
            return sourcesByType;
        }
    }]);

