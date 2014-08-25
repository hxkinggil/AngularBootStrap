(function ()
{
    'use strict';

    angular.module( 'ui.bootstrap.grid' , ['ngSanitize'] )

        .constant( 'gridConfig' , {

        } )
        //控制器
        .controller( 'GridController' , ['$scope', '$element', '$attrs', '$q', '$log', 'gridClassFactory', function ( $scope , $elm , $attrs , $q , $log , gridClassFactory )
        {

            console.log( 'grid controller' );

            var self = this;

            //构造表格对象
            self.grid = gridClassFactory.createGrid( $scope.gridOptions );

            $scope.grid = self.grid;

            //构造列对象
            if ( $attrs.gridColumns )
            {
                $attrs.$observe( 'gridColumns' , function ( value )
                {
                    self.grid.options.columnDefs = value;
                    self.grid.buildColumns()
                        .then( function ()
                        {

                        } );
                } );
            }
            else
            {
                if ( self.grid.options.columnDefs.length > 0 )
                {
                    self.grid.buildColumns();
                }
            }

            var dataWatchCollectionDereg;
            if ( angular.isString( $scope.gridOptions.data ) )
            {
                dataWatchCollectionDereg = $scope.$parent.$watchCollection( $scope.gridOptions.data , dataWatchFunction );
            }
            else
            {
                dataWatchCollectionDereg = $scope.$parent.$watchCollection( function ()
                {
                    return $scope.gridOptions.data;
                } , dataWatchFunction );
            }

            var columnDefWatchCollectionDereg = $scope.$parent.$watchCollection( function ()
            {
                return $scope.gridOptions.columnDefs;
            } , columnDefsWatchFunction );

            function columnDefsWatchFunction( n , o )
            {
                if ( n && n !== o )
                {
                    self.grid.options.columnDefs = n;
                    self.grid.buildColumns()
                        .then( function ()
                        {

//                            self.grid.preCompileCellTemplates();
//
//                            self.refreshCanvas( true );
                        } );
                }
            }

            function dataWatchFunction( n )
            {
                // $log.debug('dataWatch fired');
                var promises = [];

                if ( n )
                {
                    if ( self.grid.columns.length === 0 )
                    {
                        $log.debug( 'loading cols in dataWatchFunction' );
                        if ( !$attrs.gridColumns && self.grid.options.columnDefs.length === 0 )
                        {
                            self.grid.buildColumnDefsFromData( n );
                        }
                        promises.push( self.grid.buildColumns()
                            .then( function ()
                            {

                            }
                        ) );
                    }
                    $q.all( promises ).then( function ()
                    {
                        self.grid.addRows( n );


//                        self.grid.modifyRows( n )
//                            .then( function ()
//                            {
//
//                                $scope.$evalAsync( function ()
//                                {
//                                    self.refreshCanvas( true );
//                                } );
//                            } );
                    } );
                }
            }

            $scope.$on( '$destroy' , function ()
            {
                dataWatchCollectionDereg();
                columnDefWatchCollectionDereg();
            } );

        }] )
        //指令
        .directive( 'grid' , function ()
        {
            return {
                restrict : 'EA' ,
                controller : 'GridController' ,
                templateUrl : '../../template/grid/grid.html' ,
//            transclude:true,
                replace : true ,
                scope : {
                    gridOptions : '=gridOptions'
                } ,
                link : function ( scope , element , attrs , GridCtrl )
                {

                    console.log( 'grid link' );
                }
            };
        } );


})();
