/*jshint expr: true*/
var expect = require('chai').expect;
var BearsRoutes = require('../../../src/routes/bearsRoutes');
var Session = require('../../../src/listenner/session');
var Rx = require('rx');
var sinon = require('sinon');
var Q = require('q');


var fakeBearRepo = function(data) {
    this.getBear = function() {
        var deferred = Q.defer();
        setTimeout(function() {
            deferred.resolve(data);
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

describe('Given a user is authenticated, ', function() {

    it('when it request its profile, it receive the data of its profile', function(done) {

        var user = {
            id: 7,
            username: 'yoann'
        };

        var bearRepo = new fakeBearRepo(user);

        var bearRoutes = new BearsRoutes(bearRepo);

        var source = Rx.Observable.create(function(observer) {});

        var session = new Session(user, source);

        bearRoutes.profile.execute(session)()
            .then(function(data) {

                var expected = {
                    bear: {
                        id: 7,
                        username: 'yoann'
                    }
                };

                expect(JSON.stringify(data)).to.equal(JSON.stringify(expected));
                done();
            });

    });
});


describe('Given a user is not authenticated, ', function() {

    it('when it request its profiles, it throws an exception ', function() {

        var user = {
            id: 7,
            username: 'yoann'
        };

        var bearRepo = new fakeBearRepo(user);
        var bearRoutes = new BearsRoutes(bearRepo);

        var executingRouteWithNoSession = function() {
            bearRoutes.profile.execute()();
        };

        expect(executingRouteWithNoSession).to.throw();

    });
});

describe('Given a user is authenticated, ', function() {

    it('when it request the profile 4 , it receive the informations of profile 4', function() {
        var yoann = {
            id: 7,
            username: 'yoann'
        };

        var julien = {
            id: 4,
            username: 'julien'
        };

        var bearRepo = new fakeBearRepo(julien);

        var bearRoutes = new BearsRoutes(bearRepo);

        var source = Rx.Observable.create(function(observer) {});

        var session = new Session(yoann, source);

        bearRoutes.profile.execute(session)(4)
            .then(function(data) {
                expect(JSON.stringify(data)).to.equal(JSON.stringify(julien));
                done();
            });

    });
});