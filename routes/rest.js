/**
 * Created by ben on 23/01/16.
 */
var _ = require('lodash');
var express = require('express');
var Engine = require('tingodb')();
var assert = require("assert");

var router = express.Router();

module.exports = router;

var db = new Engine.Db('../db', {});

var  integerFields = ['parent', '_id', 'project'];
setIntegers = function(o) {
    return _.forEach(o, function(value, key){
        if (integerFields.indexOf(key) > -1) {
            o[key] = Number(value);
        }
    });
};
parseRequest = function(req) {
    var resource = req.path.split(/\//);
    if (req.method === 'GET' || req.method === 'DELETE') {
        return {
            collection: db.collection(resource[1]),
            _id: resource[2],
            query: setIntegers(req.query)
        };
    } else {
        return {
            collection: db.collection(resource[1]),
            document: req.body
        };
    }
};

sendError = function(res, err, query) {
    console.log("ERROR:" + err);
    res.status(500).send("ERROR:");
};

update = function(req, res) {
    var query = parseRequest(req);
    delete query.document.nodes; // dont want to store children TODO remove this once client code fixed
    if (query.document._id) {
        query.collection.save(query.document, function(err, result) {
            if (err === null) {
                res.send(result[0]);
            } else {
                sendError(res, err, query.document);
            }
        });
    } else {
        query.collection.insert(query.document, function(err, result) {
            if (err === null) {
                result[0]._id = result[0]._id.id;
                res.send(result[0]);
            } else {
                sendError(res, err, query.document);
            }
        });
    }
};

router.get('*', function(req, res) {
    var query = parseRequest(req);
    if (query._id) {
        query.collection.findOne({_id: query._id}, function(err, result) {
            if (err === null) {
                res.send(result);
            } else {
                sendError(res, err, query);
            }
        });
    } else {
        query.collection.find(query.query).toArray(function(err, result) {
            if (err === null) {
                res.send(result);
            } else {
                sendError(res, err, query);
            }
        });
    }
});

router.put('*', update);
router.post('*', update);
//function(req, res){
//    console.log("post received");
//    update(req, res);
//});
router.delete('*', function(req, res) {
    var query = parseRequest(req);
    if (query._id) {
        query.collection.remove({_id: query._id}, function(err, result) {
            if (err === null) {
                res.send(result);
            } else {
                sendError(res, err, query);
            }
        });
    } else {
        sendError(res, "No id in delete request", query);
    }
});


