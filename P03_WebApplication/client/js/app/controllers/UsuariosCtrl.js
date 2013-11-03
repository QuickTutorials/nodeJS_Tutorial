/*global console: false, angular: false*/
var UsuariosCtrl = angular.module("app")
    .controller("UsuariosCtrl", ["$scope", "socketioconnector", "$filter", function ($scope, connector, $filter) {
        "use strict";

        $scope.usuario = {};
        $scope.data = [];

        $scope.load = function () {
            console.log("Buscamos usuarios...");
            connector.sendMessage("usuarios/find", {});
        };

        $scope.reset = function () {
            $scope.usuario = angular.copy($scope.usuario);
        };

        $scope.save = function (usuario) {
            $scope.usuario = angular.copy(usuario);
            connector.sendMessage("usuarios/add", usuario);
        };

        $scope.remove = function (record, rowIndex, colIndex) {
            console.log("delete record " + JSON.stringify(record) + " in rowIndex: " + rowIndex + ". The index of the column with the action is " + colIndex);
            connector.sendMessage("usuarios/remove", record._id);
        };

        $scope.loadData = function (usuarios) {
            $scope.data = usuarios;
            $scope.$apply();
        };

        $scope.addUser = function (usuario) {
            $scope.$apply(function () {
                $scope.data.push(usuario);
            });
        };

        $scope.removeUserById = function (id) {
            angular.forEach(
                $filter("filter")(
                    $scope.data,
                    {"_id": id}
                ),
                function (usuario) {
                    $scope.$apply(function () {
                        $scope.data.splice($scope.data.indexOf(usuario), 1);
                    });
                }
            );
        };

        connector.on("connectionopen", function () {

            $scope.load();

            connector.on("usuarios/find", function (usuarios) {
                console.log("Recibimos usuarios...");
                $scope.loadData(usuarios);
            });

            connector.on("usuarios/add", function (usuario) {
                $scope.addUser(usuario);
            });

            connector.on("usuarios/remove", function (id) {
                $scope.removeUserById(id);
            });
        });
    }]);