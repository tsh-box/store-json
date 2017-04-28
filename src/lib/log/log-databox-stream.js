
module.exports = function (options) {

    var logUrl = process.env.DATABOX_LOGSTORE_ENDPOINT;

    var stream = require('stream');
    var util = require('util');
    var databoxRequest = require('../databox-request/databox-request-promise.js');
    var Writable = stream.Writable;
    
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

       //post to logStore
       databoxRequest({uri:logUrl, method:'POST', json:true, body: data},cb)
       .catch((error)=>{
           console.log("[logging to logstore ERROR]",error);
       });

    };

    return new LogStream(options);
};