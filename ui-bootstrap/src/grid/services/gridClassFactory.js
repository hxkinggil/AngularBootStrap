(function () {
    'use strict';

    angular.module('ui.bootstrap.grid').service('gridClassFactory', ['gridUtil', '$q', '$compile', '$templateCache', 'gridConstants', '$log', 'Grid', 'GridColumn', 'GridRow',
        function (gridUtil, $q, $compile, $templateCache, gridConstants, $log, Grid, GridColumn, GridRow) {

            var service = {

                createGrid : function(options) {
                    options = (typeof(options) !== 'undefined') ? options: {};
                    options.id = gridUtil.newId();
                    var grid = new Grid(options);

                    // NOTE/TODO: rowTemplate should always be defined...
                    if (grid.options.rowTemplate) {
                        var rowTemplateFnPromise = $q.defer();
                        grid.getRowTemplateFn = rowTemplateFnPromise.promise;

                        gridUtil.getTemplate(grid.options.rowTemplate)
                            .then(
                            function (template) {
                                var rowTemplateFn = $compile(template);
                                rowTemplateFnPromise.resolve(rowTemplateFn);
                            },
                            function (res) {
                                // Todo handle response error here?
                                throw new Error("Couldn't fetch/use row template '" + grid.options.rowTemplate + "'");
                            });
                    }

                    grid.registerColumnBuilder(service.defaultColumnBuilder);

                    // Reset all rows to visible initially
                    grid.registerRowsProcessor(function allRowsVisible(rows) {
                        rows.forEach(function (row) {
                            row.visible = true;
                        });

                        return rows;
                    });

                    grid.registerColumnsProcessor(function allColumnsVisible(columns) {
                        columns.forEach(function (column) {
                            column.visible = true;
                        });

                        return columns;
                    });

                    grid.registerColumnsProcessor(function(renderableColumns) {
                        renderableColumns.forEach(function (column) {
                            if (column.colDef.visible === false) {
                                column.visible = false;
                            }
                        });

                        return renderableColumns;
                    });



                    if (grid.options.enableFiltering) {
                        grid.registerRowsProcessor(grid.searchRows);
                    }

                    // Register the default row processor, it sorts rows by selected columns
                    if (grid.options.externalSort && angular.isFunction(grid.options.externalSort)) {
                        grid.registerRowsProcessor(grid.options.externalSort);
                    }
                    else {
                        grid.registerRowsProcessor(grid.sortByColumn);
                    }

                    return grid;
                }

            };

            //class definitions (moved to separate factories)

            return service;
        }]);

})();