/**
 * Created by gc on 2014/8/19.
 */
(function () {
    'use strict';

    angular.module('ui.bootstrap.grid.header', [])

        .constant('gridHeaderConfig', {

        })

        .controller('GridHeaderController',['$scope', '$element', '$attrs', '$log', function ($scope, $elm, $attrs, $log) {

        }])

        .directive('gridHeader', function () {
            return {
                restrict:'EA',
                controller:'GridHeaderController',
                templateUrl:'template/grid/grid-header.html',
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