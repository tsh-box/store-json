var app = require("../src/main.js");
var supertest = require("supertest")(app);
var assert = require('assert');

it("Responds with 'active'", function(done) {
    supertest
        .get("/status")
        .expect(200)
        .expect("active",done);
});


describe('Add and retrieve by key', function() {
    
    var data = {test:"data", hello:"world"}; 
    var data2 = {test:"data", hello:"world", goodby:'world'}; 
    var key = Date.now();
	
    it("Handles invalid key on read /kv", function(done) {
		supertest
			.get("/asdfgfhjkl/kv/")
			.expect(500)
			.end((err,result)=>{
				//assert.deepEqual(result.body, {status:404,error:"Document not found."});
				done();
			});
	})

    it("Adds records posted to :key/kv/", function(done) {
		supertest
			.post("/"+key+"/kv/")
			.send(data)
			.expect(200)
			.end((err,result)=>{
				assert.deepEqual(result.body, data);
				done();
			});
	})

	it("retrieves latest records with " + key + "/kv/ ", function(done) {
		
		supertest
			.get("/"+key+"/kv/")
			.expect(200)
			.end(function(err,result){
				if(err) {
					assert.fail("","",err);
					done()
					return
				}
				assert.deepEqual(result.body, data);
				done();
			});
	});

    it("Updates records posted to :key/kv", function(done) {
		supertest
			.post("/"+key+"/kv")
			.send(data2)
			.expect(200)
			.end((err,result)=>{
				assert.deepEqual(result.body, data2);
				done()
			});
	});

    it("retrieves latest records with /" + key + "/kv/", function(done) {
		
		supertest
			.get("/"+key+"/kv")
			.expect(200)
			.end(function(err,result){
				if(err) {
					assert.fail("","",err);
					done()
					return
				}
				assert.deepEqual(result.body, data2);
				done();
			});
	});
});
