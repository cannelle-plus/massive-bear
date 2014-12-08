/*jshint expr: true*/
var expect = require('chai').expect;
var ReturnDataGamesRepo = require('../../helper/returnDataGamesRepo.helper');
var TestData = require('../../helper/testData.helper');
var msgDispatcher = require('../../helper/msgDispatcher.helper');

var Rx = require('rx');
var Q = require('q');

var BearsRoutes = require('../../../src/routes/bearsRoutes');
var Session = require('../../../src/eventListener/session');
var BearRepo = require('../../../src/repositories/bearRepository');
var CommandHandler = require('../../../src/commandHandler/commandHandler');

// var FakeBearRepo = function() {
//     this.toHavebeenCalled = false;
//     this.withArgs = [];

//     this.saveProfile = function() {
//         this.toHavebeenCalled = true;
//         this.withArgs = arguments;

//         var deferred = Q.defer();
//         setTimeout(function() {
//             deferred.resolve();
//         }, 1);
//         return deferred.promise;

//     };
// };

var bearDispatcher = msgDispatcher('bear');


describe('Given nothing, ', function() {

    it('when we create a bearsRoutes, it needs a bearRepository', function() {

        var fnCreateBearsRoutes = function() {
            return new BearsRoutes();
        };
        expect(fnCreateBearsRoutes).to.throw();

        var fnCreateBearsRoutesWithRepoOnly = function() {
            return new BearsRoutes({});
        };
        expect(fnCreateBearsRoutesWithRepoOnly).to.throw();

        var bearRoutes = new BearsRoutes({}, {});

        expect(bearRoutes).to.be.ok;

    });
});

describe('Given a bear is authenticated, ', function() {

    it('when it request its profile, it receive the data of its profile', function(done) {

        var testData = new TestData();

        var bearRepo = new ReturnDataGamesRepo(testData.bear.yoann);
        var commandHandler = new CommandHandler(bearDispatcher);

        var bearRoutes = new BearsRoutes(bearRepo, commandHandler);

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
        var commandHandler = new CommandHandler(bearDispatcher);
        var bearRoutes = new BearsRoutes(bearRepo, commandHandler);

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
        var commandHandler = new CommandHandler(bearDispatcher);

        var bearRoutes = new BearsRoutes(bearRepo, commandHandler);
        var source = Rx.Observable.create(function(observer) {});
        var session = new Session(testData.bear.yoann, source);

        bearRoutes.profile.execute(session)(4)
            .then(function(data) {
                expect(JSON.stringify(data)).to.equal(JSON.stringify(testData.bear.julien));
                done();
            });

    });
});

describe('Given a bear is authentified, ', function() {

    it('when it signs in, it dispatchs a message', function(done) {

        var testData = new TestData();
        var bearRepo = new ReturnDataGamesRepo(testData.bear.julien);
        var commandHandler = new CommandHandler(bearDispatcher);

        var bearRoutes = new BearsRoutes(bearRepo, commandHandler);
        var source = Rx.Observable.create(function(observer) {});
        var session = new Session(testData.bear.yoann, source);

        bearRoutes.saveProfile.execute(session)("jason", 3)
            .then(function(data) {
                try {
                    console.log(data);
                    expect(data).to.be.ok;
                    expect(data.Id).to.equal(testData.bear.yoann.bearId);
                    expect(data.MetaData.UserId).to.equal(testData.bear.yoann.bearId);
                    expect(data.MetaData.UserName).to.equal(testData.bear.yoann.bearUsername);
                    expect(data.PayLoad.Case).to.equal("SignIn");
                    expect(JSON.stringify(data.PayLoad.Fields)).to.equal(JSON.stringify(["jason", 3]));
                    done();
                } catch (e) {
                    console.log(e);
                }

            });
    });
});