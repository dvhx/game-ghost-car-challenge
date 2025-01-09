// Player's info
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.player = (function () {
    var self = {};

    self.load = function () {
        var o = SC.storage.readObject('SC.player', {});
        self.name = o.name || 'You';
        self.country = o.country || 'World';
        self.car = o.car || 'Hikari 1';
        self.wins = o.wins || 0;
        self.moderator = o.moderator || false;
    };
    self.load();

    self.save = function () {
        SC.storage.writeObject('SC.player', self);
    };

    return self;
}());
