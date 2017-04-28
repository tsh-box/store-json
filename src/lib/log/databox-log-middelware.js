
/*
* DATABOX API Logging
* Logs all requests and responses to the API in bunyan format to the log store
*/

module.exports = function() {
    

    var uuid = require('node-uuid');
    var bunyan = require('bunyan');
    var bunyanMiddleware = require('bunyan-middleware');
    var logStream = require('./log-databox-stream.js')({});
    var logger = bunyan.createLogger({
        name: 'databoxLogger',
        streams: [
            {
                stream: logStream
            }
        ],
        serializers: {
            res:  responseSerializer
        }
    });

    //log the interesting parts of the response including the body
    function responseSerializer(res) {
        if (!res) {
            return (false);
        }

        var body = res.body;        
        
        return ({
            statusCode: res.statusCode,
            headers: res._headers,
            trailer: res._trailer || false,
            body: body
        });
    }

    return bunyanMiddleware(
            { 
                headerName: 'X-Request-Id', 
                propertyName: 'reqId', 
                logName: 'req_id',
                verbose:false,
                obscureHeaders: [], 
                logger: logger,
                additionalRequestFinishData: function(req, res) {
                        return {};
                    }
             }
    );

};