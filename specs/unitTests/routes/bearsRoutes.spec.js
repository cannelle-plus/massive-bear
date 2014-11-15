/*jshint expr: true*/
var expect = require('chai').expect;
var BearsRoutes = require('../../../src/routes/bearsRoutes');
var Session = require('../../../src/eventListener/session');
var Rx = require('rx');
var Q = require('q');
var ReturnDataGamesRepo = require('../../../src/repositories/returnDataGamesRepo');
var BearRepo = require('../../../src/repositories/bearRepository');
var TestData = require('../../testData');

var FakeBearRepo = function() {
    this.toHavebeenCalled = false;
    this.withArgs = [];

    this.saveProfile = function() {
        this.toHavebeenCalled = true;
        this.withArgs = arguments;

        var deferred = Q.defer();
        setTimeout(function() {
            deferred.resolve();
        }, 1);
        return deferred.promise;

    };
};


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

describe('Given a bear is authenticated, ', function() {

    it('when it request its profile, it receive the data of its profile', function(done) {

        var testData = new TestData();

        var bearRepo = new ReturnDataGamesRepo(testData.bear.yoann);

        var bearRoutes = new BearsRoutes(bearRepo);

        var source = Rx.Observable.create(function(observer) {});

        var session = new Session(testData.bear.yoann, source);

        bearRoutes.profile.execute(session)()
            .then(function(data) {
                expect(JSON.stringify(data)).to.equal(JSON.stringify({
                    bear: testData.bear.yoann
                }));
                done();
            });

    });
});


describe('Given a bear is not authenticated, ', function() {

    it('when it request its profiles, it throws an exception ', function() {

        var testData = new TestData();

        var bearRepo = new ReturnDataGamesRepo(testData.bear.yoann);
        var bearRoutes = new BearsRoutes(bearRepo);

        var executingRouteWithNoSession = function() {
            bearRoutes.profile.execute()();
        };

        expect(executingRouteWithNoSession).to.throw();

    });
});

describe('Given a bear is authenticated, ', function() {

    it('when it request the profile 4 , it receive the informations of profile 4', function() {

        var testData = new TestData();
        var bearRepo = new ReturnDataGamesRepo(testData.bear.julien);
        var bearRoutes = new BearsRoutes(bearRepo);
        var source = Rx.Observable.create(function(observer) {});
        var session = new Session(testData.bear.yoann, source);

        bearRoutes.profile.execute(session)(4)
            .then(function(data) {
                expect(JSON.stringify(data)).to.equal(JSON.stringify(testData.bear.julien));
                done();
            });

    });
});

describe('Given a bear is authenticated, ', function() {

    it('when it post its profile, it save its profile with the repo', function(done) {

        var testData = new TestData();
        var bearRepo = new FakeBearRepo();

        var bearRoutes = new BearsRoutes(bearRepo);
        var source = Rx.Observable.create(function(observer) {});
        var session = new Session(testData.bear.yoann, source);

        var profileName = 'toto';
        var bearImageId = 1;

        bearRoutes.saveProfile.execute(session)(profileName, bearImageId)
            .then(function(data) {
                expect(bearRepo.toHavebeenCalled).to.be.ok;
                expect(bearRepo.withArgs[0]).to.equal(testData.bear.yoann.id);
                expect(bearRepo.withArgs[1]).to.equal(profileName);
                expect(bearRepo.withArgs[2]).to.equal(bearImageId);
                done();
            });

    });
});

describe('Given a bear is not authenticated, ', function() {
    it('when it post its profile, it save its profile with the repo', function() {

        var testData = new TestData();
        var bearRepo = new FakeBearRepo();

        var bearRoutes = new BearsRoutes(bearRepo);
        var source = Rx.Observable.create(function(observer) {});

        var profileName = 'toto';
        var bearImageId = 1;

        var executingRouteWithNoSession = function() {
            bearRoutes.saveProfile.execute()(profileName, bearImageId);
        };

        expect(executingRouteWithNoSession).to.throw();
    });
});