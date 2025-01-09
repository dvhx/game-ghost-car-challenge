// Notifications on top
"use strict";
// globals: document, window, setTimeout

var SC = window.SC || {};

SC.lip = (function () {
    var self = {};

    self.message = function (aMessage, aClass) {
        // Show short message in lip
        self.msg.textContent = aMessage;
        self.msg.dataText = aMessage;
        self.div.classList.remove('hide');
        self.div.classList.remove('error');
        self.div.classList.add(aClass || 'message');
        setTimeout(function () {
            if (self.msg.dataText === aMessage) {
                self.div.classList.add('hide');
            }
        }, 3000 + 100 * aMessage.length);
    };

    self.error = function (aMessage) {
        // Show short error message in lip
        self.message(aMessage, 'error');
    };

    window.addEventListener('DOMContentLoaded', function () {
        self.div = document.getElementById('lip');
        self.msg = document.getElementById('lip_message');
        self.msg.onclick = function () {
            self.div.classList.add('hide');
        };
    });

    return self;
}());
