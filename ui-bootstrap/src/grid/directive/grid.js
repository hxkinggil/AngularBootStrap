(function () {
    'use strict';

    angular.module('ui.bootstrap.grid', [])

    .constant('gridConfig', {

    })

    .controller('GridController',['$scope', '$element', '$attrs', '$log', function ($scope, $elm, $attrs, $log) {

    }])

    .directive('grid', function () {
        return {
            restrict:'EA',
            controller:'GridController',
            templateUrl:'template/grid/grid.html',
            transclude:true,
            replace:true,
            scope: {
                gridOptions: '='
            },
            link: function (scope, element, attrs) {

            }
        };
    });



})();
