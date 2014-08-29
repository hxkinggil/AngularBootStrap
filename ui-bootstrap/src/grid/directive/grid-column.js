/**
 * Created by gc on 2014/8/19.
 */
(function ()
{
    'use strict';

    angular.module( 'ui.bootstrap.grid' )

        .constant( 'gridColumnConfig' , {

        } )

        .controller( 'GridColumnController' , ['$scope', '$element', '$attrs', '$log', function ( $scope , $elm , $attrs , $log )
        {
            console.log( 'column controller' );
            $scope.columns = new Array();
        }] )

        .directive( 'gridColumn' , function ()
        {
            return {
                restrict : 'EA' ,
                controller : 'GridColumnController' ,
                templateUrl : '../../template/grid/grid-column.html' ,
                transclude : true ,
                scope:false,
//                replace:true,
                require : '^?grid' ,
                link : function ( scope , element , attrs , gridCtrl )
                {
                    console.log( 'column link' );
                    scope.columns = gridCtrl.grid.columns;

                }
            };
        } )


})();