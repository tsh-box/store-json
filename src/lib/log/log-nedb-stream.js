
module.exports = function (options, database) {

    var stream = require('stream');
    var util = require('util');
    var Writable = stream.Writable;
    
    var db = database;

    if (!options) {
        options = {};
    }

    // the LogStream constructor.
    function LogStream(options) {
        Writable.call(this, options);
    }

    util.inherits(LogStream, Writable);

    LogStream.prototype._write = function (chunk, enc, cb) {

        data = JSON.parse(chunk.toString());

        db.insert(data, function (err, doc) {
            if (err) {
                console.log("[Error]:: /log/", err, doc);
            }
            return cb();
        });
    };


    return new LogStream(options);
};