var PApp = {
    appId: 'hecRBvHLn26dXkkLfUGxPIWUrbv7uJBJ8JVwwPs3',
    jsKey: 'QJzUYV2rrwffyIkbyamrfr7jDUwcZmPnEUVGEAEp'

}

var QBApp = {
    appId: 23236,
    authKey: 'KSJwvpMhCq7guaS',
    authSecret: '3LwRgFTdrBhwutG'
};

var QBUser = {
    id: 6534809,
    name: 'Message Deliverer',
    login: 'message_deliverer',
    password: '123123123',
};

Parse.initialize(PApp.appId, PApp.jsKey);
QB.init(QBApp.appId, QBApp.authKey, QBApp.authSecret, true);
