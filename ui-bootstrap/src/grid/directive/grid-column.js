/**
 * Created by gc on 2014/8/19.
 */
(function () {
    'use strict';

    angular.module('ui.bootstrap.grid.column', [])

        .constant('gridColumnConfig', {

        })

        .controller('GridColumnController',['$scope', '$element', '$attrs', '$log', function ($scope, $elm, $attrs, $log) {

        }])

        .directive('gridColumn', function () {
            return {
                restrict:'EA',
                controller:'GridColumnController',
                templateUrl:'template/grid/grid-column.html',
                transclude:true,
                replace:true,
                scope: {
                    type: '@',
                    close: '&'
                },
                link: function (scope, element, attrs) {

                }
            };
        });



})();