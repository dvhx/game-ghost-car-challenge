// Universal multi-channel sound manager
// require: none
"use strict";
// globals: document, setTimeout, window

var SC = window.SC || {};

SC.sound = (function () {
    // Universal multi-channel sound manager
    var self = {};
    self.sound = {};
    self.index = {};
    self.enabled = SC.storage.readBoolean('SC.sound.enabled', true);
    self.flat = false; // if true you can play sounds without full path: play('pop') instead of play('../foo/sound/pop')

    self.debug = function () {
        // show which sounds are playing
        var s, i, a = [], snd;
        for (s in self.sound) {
            if (self.sound.hasOwnProperty(s)) {
                for (i = 0; i < self.sound[s].length; i++) {
                    snd = self.sound[s][i];
                    a.push('self.sound[' + s + '][' + i + '] paused=' + snd.paused + ' volume=' + snd.volume);
                }
            }
        }
        console.log(a.join('\n') + '\nindex:\n' + JSON.stringify(self.index, undefined, 2));
    };

    self.add = function (aName, aChannels, aLoop) {
        // Add multiple channels for one sound
        var i, s, n = aName;
        if (self.flat) {
            n = aName.split('/').slice(-1)[0]; // slice is shallow
        }
        aChannels = aChannels || 1;
        self.sound[n] = [];
        self.index[n] = 0;
        for (i = 0; i < aChannels; i++) {
            s = document.createElement('audio');
            s.src = self.flat ? aName + '.ogg' : 'sound/' + aName + '.ogg';
            s.loop = aLoop ? true : false;
            self.sound[n].push(s);
        }
        return self.sound[n];
    };

    self.play = function (aName) {
        // play sound in next available channel
        if (!self.enabled) {
            return;
        }
        var s = self.sound[aName][self.index[aName]];
        s.play();
        self.index[aName] = (self.index[aName] + 1) % self.sound[aName].length;
        return s;
    };

    self.stop = function (aName) {
        // Stop playing all sounds in that channel
        var i;
        for (i = 0; i < self.sound[aName].length; i++) {
            if (!self.sound[aName][i].paused) {
                self.sound[aName][i].pause();
            }
        }
    };

    self.addGroup = function (aBase, aVariants, aChannels, aLoop) {
        // Add similar sounds as single group, random one will be played each time
        var i;
        self.groups = SC.sound.groups || {};
        self.groups[aBase] = aVariants;
        for (i = 1; i <= aVariants; i++) {
            self.add(aBase + i, aChannels, aLoop);
        }
    };

    self.playGroup = function (aBase) {
        // Play random sound from group
        if (!self.enabled) {
            return;
        }
        var g = self.groups[aBase],
            r = Math.ceil(Math.random() * g);
        self.play(aBase + r);
    };

    self.volume = function (aVolume) {
        // Set global volume 0-1
        var n, i;
        for (n in self.sound) {
            if (self.sound.hasOwnProperty(n)) {
                for (i = 0; i < self.sound[n].length; i++) {
                    self.sound[n][i].volume = aVolume;
                }
            }
        }
    };

    self.fadeOut = function (aName, aSeconds, aCallback) {
        // Fade out and stop channel
        var i, a = self.sound[aName], orig = [], steps = 10;
        for (i = 0; i < a.length; i++) {
            orig[i] = a[i].volume;
        }
        function lower() {
            var v, j;
            steps--;
            for (j = 0; j < a.length; j++) {
                v = a[j].volume - orig[j] / 10;
                if (v < 0) {
                    v = 0;
                }
                a[j].volume = v;
                if (steps <= 0) {
                    a[j].pause();
                    a[j].currentTime = 0;
                    a[j].volume = orig[j];
                }
            }
            if (steps >= 0) {
                setTimeout(lower, aSeconds * 1000 / 10);
            } else {
                if (aCallback) {
                    aCallback(aName);
                }
            }
        }
        lower();
        return orig;
    };

    return self;
}());

