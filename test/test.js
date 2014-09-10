var assert = require("assert"); // node.js core module
var projections = require('./business/projections');

describe("Test projections module", function() {
	describe("Method getGames", function() {
		it("Method Test 1", function() {
			assert.equal(projections.getToto(),false);
		});
		it("Method Test 2", function() {
			assert.equal(false,true);
		});
	});
});