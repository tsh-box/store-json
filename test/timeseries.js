var app = require("../src/main.js");
var supertest = require("supertest")(app);
var assert = require('assert');


describe('Add and retrieve latest TS values', function() {
	it("Adds records posted to :datasourceid/ts", function(done) {
		var data = {
	    	"data": 42,
		}; 
		supertest
			.post("/"+11+"/ts")
			.send(data)
			.expect(200)
			.end(function(err,result){
				assert.deepEqual(result.body.data, 42);
				done();
			});
	});

	it("Retrieves latest records with :datasourceid/ts/latest", function(done) {
		supertest
			.get("/"+11+'/ts/latest')
			.expect(200)
			.end(function(err,result){
				if(err) {
					assert.fail("","",err);
					done();
					return
				}
				assert.deepEqual(result.body[0].data, 42);
				done();
			});
	});
});
