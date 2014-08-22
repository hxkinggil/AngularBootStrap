/**
 * Created by gc on 2014/8/19.
 */
(function () {
    'use strict';

    angular.module('ui.bootstrap.grid')

        .constant('gridRowConfig', {

        })

        .controller('GridRowController',['$scope', '$element', '$attrs', '$log', function ($scope, $elm, $attrs, $log) {
            console.log( 'gridRow controller' );
        }])

        .directive('gridRow', function () {
            return {
                restrict:'EA',
                controller:'GridRowController',
                templateUrl:'../../template/grid/grid-row.html',
                transclude:true,
                replace:true,
                require: '^?grid',
                scope: {
                },
                link: function (scope, element, attrs,gridCtrl) {

                    console.log( 'gridRow link' );

                    scope.columns = gridCtrl.grid.columns;

                    scope.rows = gridCtrl.grid.rows;

                }
            };
        });



})();