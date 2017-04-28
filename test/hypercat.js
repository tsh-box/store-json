var app = require("../src/main.js");
var supertest = require("supertest")(app);
var assert = require('assert');
var cat = require('../src/lib/hypercat/base-cat.json'); 

describe('Read and write Hypercat catalogue items', function() {
	var testItemA = {
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
	};

	var testItemB = {
		"item-metadata": [{
				// NOTE: Required
				"rel": "urn:X-hypercat:rels:hasDescription:en",
				"val": "Test item"
			}, {
				// NOTE: Required
				"rel": "urn:X-hypercat:rels:isContentType",
				"val": "text/csv"
			}, {
				"rel": "urn:X-databox:rels:hasVendor",
				"val": "Databox Inc."
			}, {
				"rel": "urn:X-databox:rels:hasType",
				"val": "Test"
			}, {
				"rel": "urn:X-databox:rels:hasDatasourceid",
				"val": "someRandomString"
			}, {
				"rel": "urn:X-databox:rels:hasStoreType",
				"val": "databox-store-blob"
			}
		],
		"href": "https://databox-store-blob:8080"
	};

	it('GET /cat', (done) => {
		supertest
			.get('/cat')
			.expect('Content-Type', /json/)
			.expect(200, cat, done);
	});

	it('POST /cat create', (done) => {
		supertest
			.post('/cat')
			.set('Content-Type', 'application/json')
			.send(testItemA)
			.expect('Location', testItemA.href)
			.expect(201, done);
	});

	it('POST /cat overwrite', (done) => {
		supertest
			.post('/cat')
			.set('Content-Type', 'application/json')
			.send(testItemB)
			.expect('Location', testItemB.href)
			.expect(200, done);
	});

	it('GET /cat updated', (done) => {
		cat.items.push(testItemB);
		supertest
			.get('/cat')
			.expect('Content-Type', /json/)
			// TODO: Test to see if it actually removes old stuff (it does, but test)
			.expect(200, cat, done);
	});

	// Generate tests for missing rels
	testItemB['item-metadata'].forEach((pair, i) => {
		var rel = pair.rel.split(':')[3];

		it('POST /cat create missing ' + rel, (done) => {
			var item = JSON.parse(JSON.stringify(testItemB));
			item['item-metadata'].splice(i, 1);
			supertest
				.post('/cat')
				.set('Content-Type', 'application/json')
				.send(item)
				.expect(400, done);
		});
	});
});
