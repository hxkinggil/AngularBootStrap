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

            $scope.selectRow = function(row)
            {
                $scope.$on('getSelectRow'+$scope.grid.id,function(){
                    return row;
                })
            }
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
                    scope.grid = gridCtrl.grid;

                    scope.columns = gridCtrl.grid.columns;

                    scope.rows = gridCtrl.grid.rows;

                }
            };
        })



})();