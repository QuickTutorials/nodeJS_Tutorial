var UsuarioDAO = require('./../dao/UsuarioDAO').UsuarioDAO,
    util = require('util'),
    Q = require('q'),
    BaseMgr = require('./BaseMgr');


function UsuarioMgr() {
    "use strict";
    UsuarioMgr.super_.call(this);

    this.add = function (data) {
        var d = Q.defer();
        UsuarioDAO.addUser(data).then(function (savedData) {
            d.resolve({"usuarios/add": savedData});
        });
        return d.promise;
    };

    this.find = function (data) {
        var d = Q.defer();
        UsuarioDAO.find().then(function (usuarios) {
            d.resolve({"usuarios/find": usuarios});
        });
        return d.promise;
    };

    this.remove = function (id) {
        var d = Q.defer();
        UsuarioDAO.removeUserById(id).then(function (id) {
            d.resolve({"usuarios/remove": id});
        });
        return d.promise;
    };


    //contains the functions allowed and if they will do a broadcasting. All the functions declared in fn property
    //will be promises
    this.messages = {
        add : { fn: this.add, doBroadCasting: true},
        find: { fn: this.find, doBroadCasting: false},
        remove : {fn: this.remove, doBroadCasting: true}
    };
};

util.inherits(UsuarioMgr, BaseMgr);

module.exports = UsuarioMgr;

