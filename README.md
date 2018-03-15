[![Build Status](https://travis-ci.org/tsh2/store-json.svg?branch=master)](https://travis-ci.org/tsh2/store-json)

# store-json

N.B. This is a temporary solution to enable handling of lager data sets. This will be replaced by https://github.com/sevenEng/databox-storage once it is ready. 

N.B This store will not work on ARM due to the lack of an ARM mongo package for .

Databox Store for JSON data blobs handles time series and key value data. Based on mongoDB.

The data store exposes an HTTP-based API on port 8080 and a WebSocket based API
for live data. All requests must have arbiter tokens passed as per section 7.1
of the
[Hypercat 3.0 specs](https://shop.bsigroup.com/upload/276605/PAS212-corr.pdf).


## Read API

### Time series data

Each value in the time series is a JSON-encoded object with fields:

- `data` - the raw value
- `timestamp` - the time associated with the value, integer milliseconds since UNIX epoch, used for time-based queries.
- `datasource_id` - the datasource ID (this is required internally, but also visible to clients)

All methods return data in this form (or an array of such values), and the POST method optionally uses this form.

    URL: /<datasourceid>/ts/latest
    Method: GET
    Parameters: <datasourceid> the datasourceid to get data for.
    Notes: will return the latest value object based on the datasourceid 
    in a (possibly empty) array

    URL: /<datasourceid>/ts/since
    Method: GET
    URL Parameters: <datasourceid> the datasourceid to get data for.
    Body Parameters: <startTimestamp> the timestamp in ms to return records after (inclusive).
    Notes: will return an array of all value objects since the provided timestamp 
    (inclusive) for the provided datasourceid. 
    Body must be JSON-encoded.

    URL: /<datasourceid>/ts/range
    Method: GET
    URL Parameters: <datasourceid> the datasourceid to get data for
    Body Parameters: <startTimestamp> and <endTimestamp> in ms for the range (inclusive of start and end).
    Notes: will return an array of all value objects between the provided start 
    and end timestamps (inclusive) for the provided datasourceid. 
    Body must be JSON-encoded.

    URL: /<datasourceid>/ts/query
    method: GET
    Body Parameters: <query> a string containing a mongoDB json query 
    Body Parameters: <limit> an integer max number of documents to return 
    Body Parameters: <sort> a string containing a mongoDB json sort object
    Notes: returns an array of value object. 
    Body must be JSON-encoded.
    
### Key value pairs

    URL: /<key>/kv/
    Method: GET
    Parameters: replace <key> with document key
    Notes: will return the json-encoded data stored with that key (no wrapper object). 
    Returns an empty array 404 {status:404,error:"Document not found."} if no data is stored

### Websockets

Connect to a websocket client to `/ws`. Then subscribe for data using:

    For time serries:

    URL: /sub/<datasourceid>/ts
    Method: GET
    Parameters: replace <datasourceid> with datasourceid
    Notes: Will broadcast over the websocket the data stored by datasourceid 
    when data is added. Each value is a JSON object as described above.

    For key value:

    URL: /sub/<key>/kv
    Method: GET
    Parameters: replace <key> with document key
    Notes:  Will broadcast over the websocket the data stored with that key 
    when it is add or updated. Each value is a JSON object with `datasource_id` and `data`

## Write API

### Managing the data source catalog
    URL: /cat
    Method: POST
    Parameters: Raw JSON body containing a Hypercat item (as per PAS212 (https://shop.bsigroup.com/upload/276605/PAS212-corr.pdf) Table 2).
    For example:
    {
        "item-metadata": [{
                // NOTE: Required
                "rel": "urn:X-hypercat:rels:hasDescription:en",
                "val": "Test item"
            }, {
                // NOTE: Required
                "rel": "urn:X-hypercat:rels:isContentType",
                "val": "text/plain"
            }, {
                "rel": "urn:X-databox:rels:hasVendor",
                "val": "Databox Inc."
            }, {
                "rel": "urn:X-databox:rels:hasType",
                "val": "Test"
            }, {
                "rel": "urn:X-databox:rels:hasDatasourceid",
                "val": "MyLongId"
            }, {
                "rel": "urn:X-databox:rels:isActuator",
                "val": false
            }, {
                "rel": "urn:X-databox:rels:hasStoreType",
                "val": "databox-store-blob"
            }
        ],
        "href": "https://databox-store-blob:8080"
    }

### Time series data
    URL: /<datasourceid>/ts/
    Method: POST
    Parameters: Raw JSON body containing elements as follows 
    {data: <json blob to store>} (else the whole body is taken as the data value)
    Notes: If there is a (integer) timestamp field in data or body 
    it is used otherwise a timestamp is added on insertion 

### Key value pairs

    URL: /<key>/kv/
    Method: POST
    Parameters: Raw JSON body containing the <data to be stored in JSON format>
    Notes: will insert if the <key> is not in the database and update the document if it is.


### Websockets

Not available for writing

## Arbiter Facing

### The data source catalog

    URL: /cat
    Method: GET
    Parameters: none
    Notes: will return the latest data source catalog in Hypercat format.

## Status

This is beta. Expect bugs but the API should be reasonably stable.

#Building running

    npm install && npm start

## Developing

Start the container manger in developer mode:

    DATABOX_DEV=1 npm start

Clone the repo and make your changes. To build a new Databox image and push it
to you local registry:

    npm run build && npm run deploy

Then restart the container manger to use you updated version.

## Testing

To test the new data store in a container with its own mongoDB instance use: 

    npm run build && npm run testincont
