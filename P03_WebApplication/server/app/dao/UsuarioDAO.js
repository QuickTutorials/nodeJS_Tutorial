var MongoConnector = require('./../data/MongoConnector').MongoConnector,
    Q = require('q'),
    mongo = require('mongodb'),
    BSON = mongo.BSONPure;

exports.UsuarioDAO = function () {
    "use strict";

    var find, addUser, doAddUser, doFind, removeUserById, doRemoveUserById;

    doAddUser = function (client, data) {
        var d = Q.defer();
        client.collection('usuarios').insert(data, {multi: true}, function (error) {
            if (error) {
                d.reject(error);
            } else {
                client.close();
                d.resolve(data);
            }
        });

        return d.promise;
    };

    addUser = function (data) {
        var d = Q.defer();

        MongoConnector.getConnection()
            .then(function (client) {
                //importante devolver la función que contiene la promesa
                return doAddUser(client, data);
            })
            .then(function (savedData) {
                d.resolve(savedData);
            });

        return d.promise;
    };

    doRemoveUserById = function (client, id) {
        var d, objectId;

        d = Q.defer();
        objectId = new BSON.ObjectID(id);
        client.collection('usuarios').remove({"_id": objectId}, function (error) {
            if (error) {
                d.reject(error);
            } else {
                client.close();
                d.resolve(id);
            }
        });

        return d.promise;
    };

    removeUserById = function (id) {
        var d = Q.defer();

        MongoConnector.getConnection()
            .then(function (client) {
                //importante devolver la función que contiene la promesa
                return doRemoveUserById(client, id);
            })
            .then(function (savedData) {
                d.resolve(savedData);
            });

        return d.promise;
    };

    doFind = function (client) {
        var d = Q.defer(), usuarios, stream;
        usuarios = [];

        stream = client.collection('usuarios').find(
            //TODO add filter parameters
            //{ },
            //{ nombre: 1, apellido: 1, nif: 1, _id: 0 }
        ).stream();

        stream.on('data', function (item) {
            usuarios.push(item);
        });
        stream.on('end', function () {
            client.close();
            d.resolve(usuarios);
        });

        return d.promise;
    };

    find = function () {
        var d = Q.defer();
        MongoConnector.getConnection()
            .then(doFind)
            .then(function (usuarios) {
                d.resolve(usuarios);
            });
        return d.promise;
    };

    return {
        addUser       : addUser,
        find          : find,
        removeUserById: removeUserById
    };
}();