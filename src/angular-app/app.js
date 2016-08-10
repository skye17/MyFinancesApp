/**
 * Created by skye17 on 08.08.16.
 */

function Category(name, subCategories){
    this.name = name;
    this.subCategories = subCategories || [];
}

function init($scope) {
    var sourceTypes = ["Дебетовая карта", "Кредитная карта", "Наличные", "Cчет"];
    if (localStorage.sources) {
        $scope.sources = JSON.parse(localStorage.sources);

    } else {
        $scope.sources = [
            {id:0, number:5400400040004000, balance:0, type:sourceTypes[0], data:{}},
            {id:1, number:5000000000000000, balance:0, type:sourceTypes[0], data:{}},
            {id:2, number:1234123412340000, balance:0, type:sourceTypes[1]},
            {id:3, balance:0, type:sourceTypes[2]},
            {id:4, number:12345678901234, balance:0, type:sourceTypes[3]}
        ];
    };

    if (localStorage.categories) {
        $scope.categories = JSON.parse(localStorage.categories);
    } else {
        $scope.categories = [
            new Category("Еда",
                [new Category("Cупермаркеты"), new Category("Фаст-фуд"), new Category("Кафе, рестораны")]),
            new Category("Развлечения/отдых",
                [new Category("Культура/искусство"), new Category("Активный отдых"),new Category("Музыка, книги, dvd,..")]),
            new Category("Личная гигиена",
                [new Category("Парикмахерские/салоны красоты"), new Category("SPA"), new Category("Химчистка/Прачечная")]),
            new Category("Медицина/Здоровье",
                [new Category("Медицина"), new Category("Аптеки"), new Category("Тренажерный зал")]),
            new Category("Одежда/обувь"),
            new Category("Транспорт",
                [new Category("Топливо"), new Category("Парковка"), new Category("Страхование") ]),
            new Category("Жилищные расходы",
                [new Category("Ипотека"), new Category("Аренда")]),
            new Category("Счета/платежи",
                [new Category("Коммунальные платежи"), new Category("Интернет, связь")]),
            new Category("Подарки и благотворительность"),
            new Category("Налоги"),
            new Category("Путешествия/перемещения",
                [new Category("Общественный транспорт"), new Category("Отпуск")]),
            new Category("Другое")
        ];
    };

    if (localStorage.spendings) {
        $scope.spendings = JSON.parse(localStorage.spendings);
    } else {
        $scope.spendings = [{name:"Ужин с друзьями", category:$scope.categories[0], source:$scope.sources[1],cost:1000, date:Date.now()}];
    };


}


(function() {
    var app = angular.module('app', ['custom-directives']);

    app.controller('SpendingsController', function ($scope) {
        var sourceTypes = ["Дебетовая карта", "Кредитная карта", "Наличные", "Cчет"];
        init($scope);

        $scope.spending = {};
        $scope.newSpending = false;
        $scope.selectedSourceFilter = {};
        $scope.sourceFilters = [{name:'Все источники'}, {name:'Все дебетовые карты', type:sourceTypes[0]},
            {name:'Все кредитные карты', type:sourceTypes[1]}, {name:'Наличные', type:sourceTypes[2]},
            {name:'Все счета', type:sourceTypes[3]}
        ];


        $scope.getFilteredSpendingsBySources = function(){
            if (!$scope.selectedSourceFilter.type) {
                return $scope.spendings;
            }
            return $scope.spendings.filter(spending => spending.source.type === $scope.selectedSourceFilter.type);

        };

        $scope.selectedSpendings = $scope.getFilteredSpendingsBySources();

        $scope.spendingsByCategory = getSpendingsByCategories($scope.categories, $scope.selectedSpendings);



        function getSpendingsByCategories(categories, spendings) {
            var spendingsByCategory =  categories.map(function(category) {
                return {category:category, spendings: spendings.filter(spending => spending.category.name === category.name)};
            });

            spendingsByCategory.forEach(spending => spending.sumCost = calculateSumOfSpendings(spending.spendings));
            return spendingsByCategory;
        };


        $scope.buildPieChart = function () {
            var ctx = document.getElementById("myChart").getContext("2d");
            var categoryCosts = $scope.spendingsByCategory.filter(spending => spending.spendings.length != 0).map(function(spending) {
                return {label:spending.category.name,
                    value:spending.sumCost};
            });
            var labels = categoryCosts.map(c => c.label);
            var values = categoryCosts.map(c => c.value);
            var colors = ["#0000FF", "#7CFC00", "#B22222", "#DAA520", "#4B0082", "#FA8072", "#D2691E",
                "#FF7F50", "#008B8B","#87CEFA", "#CD853F", "#FF6347"];
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

            var myData = {
                labels: labels,
                datasets: [{
                    data:values,
                    backgroundColor: colors.shuffle().slice(0, labels.length),
                    hoverBorderWidth: new Array(labels.length).fill(5)
                }]
            };

            var myDoughnutChart = new Chart(ctx, {
                type: 'doughnut',
                data: myData,
                animation:{
                    animateScale:true
                },
                options: {
                    legend: {
                        display:false
                    },
                }
            });
        };
        $scope.buildPieChart();



        /*
        $scope.addCategory = function(name, subCategories) {
            $scope.categories.push(new Category(name, subCategories));
        };

        $scope.addSubCategory = function(category, subCategory) {
            category.subCategories.push(subCategory);
        };


        $scope.getSubCategories = function (category) {
            if (category) {
                return category.subCategories;
            }
            else return [];
        };
        */

        $scope.showSpendingForm = function () {
            $scope.newSpending = true;
        };

        $scope.toggleSelectedSpendingCategory = function (category) {
            if ($scope.selectedSpendingCategory === category) {
                $scope.selectedSpendingCategory = null;
            } else  {
                $scope.selectedSpendingCategory = category;
            }

        };



        $scope.sumSpendings = function() {
            return calculateSumOfSpendings($scope.selectedSpendings);
        };



        $scope.addSpending = function() {
            $scope.spendings.push($scope.spending);
            var categorySpendings = $scope.spendingsByCategory.filter(spendings => spendings.category.name === $scope.spending.category.name)[0];
            categorySpendings.spendings.push($scope.spending);
            categorySpendings.sumCost += $scope.spending.cost
            $scope.spending = {};
            $scope.newSpending = false;
        };


        $scope.$watch('spendings', update, true);
        $scope.$watch('selectedSourceFilter', updateSpendings, true);

        function update() {
            dumpData();
            $scope.buildPieChart();
        };

        function updateSpendings() {
            $scope.selectedSpendings = $scope.getFilteredSpendingsBySources();
            $scope.spendingsByCategory = getSpendingsByCategories($scope.categories, $scope.selectedSpendings);
            $scope.buildPieChart();

        };


        function dumpData(){
            localStorage.spendings = JSON.stringify($scope.spendings);
            localStorage.categories = JSON.stringify($scope.categories);
            localStorage.sources = JSON.stringify($scope.sources);
        };

        function calculateSumOfSpendings(spendings) {
            return spendings.map(s => s['cost']).reduce(function(a, b){return a+b;}, 0);
        }
    });
})();
