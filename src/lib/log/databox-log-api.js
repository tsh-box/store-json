
module.exports = function (expressApp,database) {

    var request = require('request'); 

    var router = require('express').Router();
    
    var db = database;
    

    var app = expressApp;
    
     //search logs hy hostname
     router.get('/hostname/:hostname', function(req, res, next) {
        var hostname = req.params.hostname;
        console.log("looking for logs for hostname:: " + hostname);
        db.find({'hostname': /hostname/}, function (err, documents) {
          if (err) {
            console.log("[Error]:: /log/hostname/" + hostname);
            res.status(500).send({status:500,error:err});
          }

          if(documents.length === 0) {
            res.status(404).send({status:404,error:"No documents not found."});
          } else {
            res.send(documents);
          }
        });
    });

    //search read ts logs by datasourceid 
    router.get('/read', function(req, res, next) {
        
        
        db.find({'req.url': /read/}, function (err, documents) {
          if (err) {
            console.log("[Error]:: /log/read/" + datasourceid);
            res.status(500).send({status:500,error:err});
          }

          if(documents.length === 0) {
            res.status(404).send({status:404,error:"No documents not found."});
          } else {
            res.send(documents);
          }
        });
    });

    //search read ts logs by datasourceid 
    router.get('/read/ts', function(req, res, next) {
        
        
        db.find({'req.url': /read\/ts/}, function (err, documents) {
          if (err) {
            console.log("[Error]:: /log/read/ts/");
            res.status(500).send({status:500,error:err});
          }

          if(documents.length === 0) {
            res.status(404).send({status:404,error:"No documents not found."});
          } else {
            res.send(documents);
          }
        });
    });

    //search read ts logs by datasourceid 
    router.get('/read/key', function(req, res, next) {
        
        
        db.find({'req.url': /read\/key/}, function (err, documents) {
          if (err) {
            console.log("[Error]:: /log/read/key");
            res.status(500).send({status:500,error:err});
          }

          if(documents.length === 0) {
            res.status(404).send({status:404,error:"No documents not found."});
          } else {
            res.send(documents);
          }
        });
    });

    //search read ts logs by datasourceid 
    router.get('/read/ts/:datasourceid', function(req, res, next) {
        
        var datasourceid = req.params.datasourceid
        var endpoint = '/read/ts/' + req.params.datasourceid;
        
        console.log("looking for logs for datasourceid:: " + datasourceid);
        db.find({'req.url': endpoint}, function (err, documents) {
          if (err) {
            console.log("[Error]:: /log/read/" + datasourceid);
            res.status(500).send({status:500,error:err});
          }

          if(documents.length === 0) {
            res.status(404).send({status:404,error:"No documents not found."});
          } else {
            res.send(documents);
          }
        });
    });

    //search read kv logs by key 
    router.get('/read/key/:key', function(req, res, next) {
        
        var key = req.params.key
        var endpoint = '/read/key/' + req.params.key;
        
        console.log("looking for logs for key:: " + key);
        db.find({'req.url': endpoint}, function (err, documents) {
          if (err) {
            console.log("[Error]:: /log/read/key/" + key);
            res.status(500).send({status:500,error:err});
          }

          if(documents.length === 0) {
            res.status(404).send({status:404,error:"No documents not found."});
          } else {
            res.send(documents);
          }
        });
    });

    //search write logs by datasourceid 
    router.get('/write/ts/:datasourceid', function(req, res, next) {

        var datasourceid = req.params.datasourceid
        var endpoint = '/write/ts/' + datasourceid;
        console.log("looking for write ts logs for datasourceid:: " + datasourceid);
        db.find({'req.url': endpoint}, function (err, documents) {
          if (err) {
            console.log("[Error]:: /log/write/" + datasourceid);
            res.status(500).send({status:500,error:err});
          }

          if(documents.length === 0) {
            res.status(404).send({status:404,error:"No documents not found."});
          } else {
            res.send(documents);
          }
        });
    });

    router.get('/write/key/:key', function(req, res, next) {

        var key = req.params.key;
        var endpoint = '/write/key/' + key;
        console.log("looking for write kev value logs for datasourceid:: " + datasourceid);
        db.find({'req.url': endpoint}, function (err, documents) {
          if (err) {
            console.log("[Error]:: /log/write/" + datasourceid);
            res.status(500).send({status:500,error:err});
          }

          if(documents.length === 0) {
            res.status(404).send({status:404,error:"No documents not found."});
          } else {
            res.send(documents);
          }
        });
    });

    //write logs by datasourceid 
    router.get('/write', function(req, res, next) {

        console.log("looking for write logs");
        db.find({'req.url': /write/ }, function (err, documents) {
          if (err) {
            console.log("[Error]:: /log/write/");
            res.status(500).send({status:500,error:err});
          }

          if(documents.length === 0) {
            res.status(404).send({status:404,error:"No documents not found."});
          } else {
            res.send(documents);
          }
        });
    });

    //write logs by datasourceid 
    router.get('/write/ts', function(req, res, next) {

        console.log("looking for ts write logs");
        db.find({'req.url': /write\/ts/ }, function (err, documents) {
          if (err) {
            console.log("[Error]:: /log/write/");
            res.status(500).send({status:500,error:err});
          }

          if(documents.length === 0) {
            res.status(404).send({status:404,error:"No documents not found."});
          } else {
            res.send(documents);
          }
        });
    });

    //write logs by datasourceid 
    router.get('/write/key', function(req, res, next) {

        console.log("looking for key val write logs");
        db.find({'req.url': /write\/key/ }, function (err, documents) {
          if (err) {
            console.log("[Error]:: /log/write/");
            res.status(500).send({status:500,error:err});
          }

          if(documents.length === 0) {
            res.status(404).send({status:404,error:"No documents not found."});
          } else {
            res.send(documents);
          }
        });
    });
    
    return router;

};