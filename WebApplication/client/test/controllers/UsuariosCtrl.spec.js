/*global describe: false, it: false, beforeEach: false, expect: false, inject: false*/
describe("Testing UsuariosCtrl", function () {
    "use strict";

    var scope, UsuariosCtrl, usuario;

    usuario = {
        id  : 1,
        nombre: "mockName"
    };

    beforeEach(module("app"));

    beforeEach(inject(function ($rootScope, $controller, mockconnector) {
        scope = $rootScope.$new();
        UsuariosCtrl = $controller("UsuariosCtrl", {
            $scope           : scope,
            socketioconnector: mockconnector
        });
    }));

    it("UsuariosCtrl must not be undefined", function () {
        expect(UsuariosCtrl).not.toBeUndefined();
    });

    it("When call addUser with one user, data length must be one ", function () {
        expect(scope.data).not.toBeUndefined();
        expect(scope.data.length).toEqual(0);
        scope.addUser(usuario);
        expect(scope.data.length).toEqual(1);
    });

    it("When call removeUser with id " + usuario.id + ", data must be empty ", function () {
        scope.removeUserById(usuario.id);
        expect(scope.data.length).toEqual(0);
    });
});