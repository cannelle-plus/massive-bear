/*jshint expr: true*/
var expect = require('chai').expect;
var BearsRoutes = require('../../../src/routes/bearsRoutes');
var Session = require('../../../src/eventListener/session');
var Rx = require('rx');
var Q = require('q');
var ReturnDataGamesRepo = require('../../../src/repositories/returnDataGamesRepo');
var TestData = require('../../testData');


describe('Given nothing, ', function() {

    it('when we create a bearsRoutes, it needs a bearRepository', function() {

        var fnCreateBearsRoutes = function() {
            return new BearsRoutes();
        };
        expect(fnCreateBearsRoutes).to.throw();

        var bearRoutes = new BearsRoutes({});

        expect(bearRoutes).to.be.ok;

    });
});

describe('Given a user is authenticated, ', function() {

    it('when it request its profile, it receive the data of its profile', function(done) {

        var testData = new TestData();

        var bearRepo = new ReturnDataGamesRepo(testData.user.yoann);

        var bearRoutes = new BearsRoutes(bearRepo);

        var source = Rx.Observable.create(function(observer) {});

        var session = new Session(testData.user.yoann, source);

        bearRoutes.profile.execute(session)()
            .then(function(data) {
                expect(JSON.stringify(data)).to.equal(JSON.stringify({
                    bear: testData.user.yoann
                }));
                done();
            });

    });
});


describe('Given a user is not authenticated, ', function() {

    it('when it request its profiles, it throws an exception ', function() {

        var testData = new TestData();

        var bearRepo = new ReturnDataGamesRepo(testData.user.yoann);
        var bearRoutes = new BearsRoutes(bearRepo);

        var executingRouteWithNoSession = function() {
            bearRoutes.profile.execute()();
        };

        expect(executingRouteWithNoSession).to.throw();

    });
});

describe('Given a user is authenticated, ', function() {

    it('when it request the profile 4 , it receive the informations of profile 4', function() {

        var testData = new TestData();
        var bearRepo = new ReturnDataGamesRepo(testData.user.julien);
        var bearRoutes = new BearsRoutes(bearRepo);
        var source = Rx.Observable.create(function(observer) {});
        var session = new Session(testData.user.yoann, source);

        bearRoutes.profile.execute(session)(4)
            .then(function(data) {
                expect(JSON.stringify(data)).to.equal(JSON.stringify(testData.user.julien));
                done();
            });

    });
});