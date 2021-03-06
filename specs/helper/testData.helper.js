var Bear = require('../../src/model/bear');


var y = new Bear( 1, 7, 'yoann', 1);
var j = new Bear( 2, 8,'julien', 1);
var t = new Bear( 3, 9, 'tom', 1);

var testData = function() {
    this.games = [{
        id: '4a82199e-7c30-4a95-b194-6d40127fbb89',
        version: 1,
        name: "test",
        ownerId: 1,
        ownerUserName: "julien",
        startDate: "10/01/2014 10:00",
        location: "playSoccer",
        players: "julien,yoann",
        nbPlayers: 2,
        maxPlayers: 8
    }, {
        id: 'd70efb73-8c6c-4106-97dd-7503bbf7f5fd',
        version: 1,
        name: "Joga Bonito",
        ownerId: 1,
        ownerUserName: "julien",
        startDate: "10/01/2014 19:00",
        location: "playSoccer",
        players: "julien,yoann",
        nbPlayers: 7,
        maxPlayers: 8
    }];

    this.bear = {
        yoann :y,
        julien : j,
        tom : t
        
    };  
    this.responseFromTheDispatcher = { 
        responseFromTheDispatcher: "OK" 
    };

    //events coming fomYolo
    this.yoloEvents = {
        gameJoined : {
            evtType: "gameJoined",
            payLoad: {
                "id": 'd70efb73-8c6c-4106-97dd-7503bbf7f5fd',
                "version": 2,
                "username": "tom",
                "nbPlayers": 3
            }
        },
        gameScheduled : {
            evtType: "gameScheduled",
            payLoad: {
                "id" : 'd70efb73-8c6c-4106-97dd-7503bbf7f5bb', 
                name : 'gameName', 
                ownerId : 24,
                ownerUserName : 'tom',
                startDate : '01/12/2015 10:00',
                location: 'Toulouse', 
                players : ['tom'],
                nbPlayers : 1,
                maxPlayers : 10
            }
        },
        gameAbandonned : {
            evtType: "gameAbandonned",
            payLoad: {
                "id": 'd70efb73-8c6c-4106-97dd-7503bbf7f5bb',
                "version": 3,
                "username": 'yoann',
                "nbPlayers": 1
            }
        },
        hasSignedIn : {
            evtType: "hasSignedIn",
            payLoad: {
                "bearUsername" : 'yoann', 
                'avatarId' : 2
            }
        }
        
        
    };
    
};

module.exports = testData;