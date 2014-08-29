/**
 * Created by gc on 2014/8/19.
 */
(function () {
    'use strict';
    angular.module('ui.bootstrap.grid')

        .constant('gridRowConfig', {

        })

        .controller('GridRowController',['$scope', '$element', '$attrs', '$log','gridConstants','$compile', function ($scope, $elm, $attrs, $log,gridConstants,$compile) {
            console.log( 'gridRow controller' );
            /**
             * 选择行
             * @param selectedRow
             */
            $scope.selectRow = function(selectedRow)
            {

                $scope.rows.forEach(function(row,index){

                    if(selectedRow.uid != row.uid){
                        row.style = {};
                    }else{
                        row.style = {'background-color':gridConstants.ROW_SELECT_COLOR};
                        $scope.grid.selectedRowEntity = row.entity;
                    }

               })

            }

//            $scope.query = function(){
//
//                alert('aa');
//            }

        }])

        .directive('gridRow', function (gridConstants) {
            return {
                restrict:'EA',
                controller:'GridRowController',
                templateUrl:'../../template/grid/grid-row.html',
                transclude:true,
                replace:true,
                scope:false,
                require: '^?grid',
                compile: function (elm,attr) {

                    var a =
                        '<tr ng-repeat=" row in rows " ng-click="selectRow(row)" ng-click="selectRow(row)" ng-style="row.style">'+
                        '<td ng-repeat=" col in columns " ng-show="col.visible" >';
//                                            '<div ng-show="col.colDef.render"  ng-bind-html="col.columnRender()" ng-click="col.colDef.renderClick(row.entity)"></div>'+
//                                            '<div ng-show="!col.colDef.render"  ng-bind="$eval( row.getQualifiedColField( col ))"></div>'+
                    var b =         '</td>'+
                        '</tr>';

                    var c = '';
                    gridConstants.grid.columns.forEach(function(col,index){

                        if(col.colDef.render)
                        {
                            c += '<div ng-if="$index == '+index+' ">'+col.columnRender()+'</div>';
                        }else{

                            c += '<div ng-if="$index == '+index+' " ng-bind="$eval( row.getQualifiedColField( col ))"></div>';
                        }


                    })

                    $(elm ).html(a + c + b );

                    return {
                        post: function (scope, element, attrs,gridCtrl) {

                            console.log( 'gridRow link' );

                            scope.grid = gridCtrl.grid;

                            scope.columns = gridCtrl.grid.columns;

                            scope.rows = gridCtrl.grid.rows;


                        }
                    };
                }
            };
        })



})();