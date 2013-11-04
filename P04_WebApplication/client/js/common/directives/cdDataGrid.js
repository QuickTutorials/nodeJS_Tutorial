/*global angular: false, console: false*/
angular.module("directives", []).
    directive("cdDatagrid", ["$compile", function ($compile) {
        "use strict";

        return {
            restrict  : "E",
            transclude: true,
            template  : '<table>\n    <tr ng-transclude>\n    </tr>\n    <tr ng-repeat="record in data">\n        <td ng-repeat="column in columns">\n            <cd-datagrid-cell text="{{column.text}}" data="{{column.dataProperty}}" row-index="{{$parent.$index}}"\n                              col-index="{{$index}}" record="record"\n                              type="{{column.type}}" tpl="{{column.tpl}}" action="{{column.action}}">\n            </cd-datagrid-cell>\n        </td>\n    </tr>\n</table>',
            scope     : {
                data: "="
            },

            controller: ["$scope", "$element", "$attrs", "$transclude", "$filter", "$timeout", function ($scope, $element, $attrs, $transclude, $filter, $timeout) {
                var self = this;
                $scope.columns = [];

                $scope.saveColIndex = function (cell, index) {
                    cell.colIndex = index;
                };

                $scope.saveRowIndex = function (cell, index) {
                    cell.rowIndex = index;
                };

                $scope.executeAction = function (action) {
                    var actionFn = $scope.$parent[action];
                    return function (rowIndex, colIndex) {
                        var record = $scope.data[rowIndex];
                        actionFn(record, rowIndex, colIndex);
                    };
                };

                $scope.$watch("data.length", function (value) {
                    console.log("Data length changed");
                    if ($scope.sortedColumn && $scope.order !== undefined) {
                        if (value > 0) {
                            $timeout(function () {
                                self.orderBy($scope.sortedColumn, $scope.order);
                            });
                        }
                    }
                });

                self.orderBy = function (header, order) {
                    console.log("order by " + header + " with value: " + order);
                    $scope.$apply(function () {
                        $scope.data = $filter('orderBy')($scope.data, header, order);
                    });
                };

                self.setOrder = function (header, order) {
                    $scope.order = order;
                    $scope.sortedColumn = header;
                };

                self.addColumn = function (text, tpl) {
                    $scope.columns.push({
                        dataProperty: text,
                        tpl         : tpl
                    });
                };

                self.addActionColumn = function (text, action, tpl) {
                    $scope.columns.push({
                        type  : "action",
                        text  : text,
                        action: action,
                        tpl   : tpl
                    });
                };
            }]
        };
    }]).
    directive("cdDatagridColumns", [function () {
        "use strict";

        return {
            restrict  : "E",
            //replace   : true,
            transclude: true,
            scope     : {},
            template  : "<div ng-transclude></div>"
            //template  : "<tr ng-transclude></tr>"      //dont working! WTF!?   issue : https://github.com/angular/angular.js/issues/1459
        };
    }]).
    directive("cdDatagridColumn", ["$compile", function ($compile) {
        "use strict";

        //column types mapped functions
        //there are two types:
        // - action
        // - defaultColumn
        var types;
        types = {
            defaultColumn: function (cdDatagridCtrl, text, tpl) {
                cdDatagridCtrl.addColumn(text, tpl);
            },
            action       : function (cdDatagridCtrl, action, text, tpl) {
                cdDatagridCtrl.addActionColumn(text, action, tpl);
            }
        };

        return {
            restrict: "E",
            require : "^cdDatagrid",
            //replace : true,
            scope   : {
                text    : "@",
                property: "=",
                type    : "=",
                action  : "&",
                order   : "@",
                tpl     : "@"
            },

            link    : function (scope, element, attrs, cdDatagridCtrl) {
                var property = attrs.property, action = attrs.action, type;

                if (attrs.order) {
                    scope.order = attrs.order === "DESC" ? true : false;
                    cdDatagridCtrl.setOrder(property, scope.order);
                } else {
                    scope.order = false;
                }
                element.bind("click", function () {
                    cdDatagridCtrl.orderBy(property, scope.order);
                    scope.order = !scope.order;
                });

                if ((type = attrs.type) !== undefined) {
                    types[type](cdDatagridCtrl, action, attrs.text, attrs.tpl, scope);
                } else {
                    //default column
                    types.defaultColumn(cdDatagridCtrl, property, attrs.tpl);
                }
            },
            template: "<span>{{text}}</span>"
            //template: "<td>{{text}}</td>"  //dont working! WTF!?   issue: https://github.com/angular/angular.js/issues/1459
        };
    }]).
    directive("cdDatagridCell", ["$compile", function ($compile) {
        "use strict";
        var types;

        types = {
            action     : {
                tpl          : '<button>{{text}}</button>',
                executeAction: true
            },
            defaultCell: {
                tpl          : "<span>{{record[data]}}</span>",
                executeAction: true
            }
        };

        return {
            restrict: "E",
            scope   : {
                tpl     : "@",
                type    : "@",
                action  : "@",
                data    : "@",
                record  : "=",
                text    : "@",
                rowIndex: "@",
                colIndex: "@"
            },
            template: '<div></div>',
            link    : function (scope, el, attrs) {
                scope.$watch(attrs, function () {
                    var type, ngEl, cdDataGrid;
                    cdDataGrid = scope.$parent;
                    if ((type = types[attrs.type]) !== undefined) {
                        ngEl = angular.element($compile(attrs.tpl.replace(/{(.*)}/, "{{record['$1']}}") || type.tpl)(scope));
                        if (type.executeAction) {
                            ngEl.bind("click", function () {
                                var actionFn = cdDataGrid.$parent.executeAction(attrs.action);
                                actionFn(attrs.rowIndex, attrs.colIndex);
                            });
                        }
                        el.append(ngEl);
                    } else {
                        ngEl = angular.element($compile(attrs.tpl.replace(/{(.*)}/, "{{record['$1']}}") || types.defaultCell.tpl)(scope));
                        el.append(ngEl);
                    }
                });
            }
        };
    }]);

