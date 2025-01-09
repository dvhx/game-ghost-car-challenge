// Lap counter
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.lapCounter = (function () {
    var self = {};
    self.tests = [];
    self.all = [];
    self.callback = null;
    self.first = true;
    self.lapTime = 0;
    self.lapStart = 0;
    self.lapBest = 999;
    self.lapFrame = 0;

    function xlt(v) {
        // add test for X lower than value
        self.tests.push(function (pos) {
            return pos.x < v;
        });
    }

    function ylt(v) {
        // add test for Y lower than value
        self.tests.push(function (pos) {
            return pos.y < v;
        });
    }

    function zlt(v) {
        // add test for Z lower than value
        self.tests.push(function (pos) {
            return pos.z < v;
        });
    }

    function xgt(v) {
        // add test for X greater than value
        self.tests.push(function (pos) {
            return pos.x > v;
        });
    }

    function ygt(v) {
        // add test for Y greater than value
        self.tests.push(function (pos) {
            return pos.y > v;
        });
    }

    function zgt(v) {
        // add test for Z greater than value
        self.tests.push(function (pos) {
            return pos.z > v;
        });
    }

    self.addRules = function (aRules) {
        // Add rules to test lap progression, e.g. "x > 10,y < 20,z > 33"
        self.tests = [];
        var i, lines = aRules.split(','), cov;
        for (i = 0; i < lines.length; i++) {
            cov = lines[i].split(' ');
            if (cov.length !== 3) {
                throw "Invalid rule " + lines[i];
            }
            switch (cov[0] + cov[1]) {
            case "x<":
                xgt(-parseFloat(cov[2]));
                break;
            case "y<":
                ylt(parseFloat(cov[2]));
                break;
            case "z<":
                zlt(parseFloat(cov[2]));
                break;
            case "x>":
                xlt(-parseFloat(cov[2]));
                break;
            case "y>":
                ygt(parseFloat(cov[2]));
                break;
            case "z>":
                zgt(parseFloat(cov[2]));
                break;
            default:
                throw "Unknown rule " + lines[i];
            }
        }
        self.all = self.tests.slice(); // slice is shallow, tests are added as new objects
        self.first = true;
    };

    self.checkpointPassed = function () {
        // One checkpoint passed
        var delta;
        // First checkpoint means start of lap
        if (self.first) {
            console.log('lap started');
            SC.canvas.lags = [];
            self.lapStart = SC.canvas.time;
            self.first = false;
            self.lapFrame = 0;
            SC.record.start();
            //Sylvester.cost = 0;
        }
        // next test
        self.tests.shift();
        if (self.tests.length <= 0) {
            // No more tests means end of lap
            self.lapTime = SC.canvas.time - self.lapStart;
            delta = self.lapTime - SC.lapCounter.lapBest;
            if (delta > 0) {
                SC.lip.message((delta >= 0 ? '+' : '') + delta.toFixed(3) + 's');
            }
            if (self.lapTime < self.lapBest) {
                self.lapBest = self.lapTime;
            }
            self.tests = self.all.slice(); // slice is shallow
            self.first = true;
            if (SC.tracks[SC.currentTrack].finishTeleport) {
                SC.carPhysics.teleport(SC.tracks[SC.currentTrack].finishTeleport, SC.tracks[SC.currentTrack].finishTeleportForward, SC.tracks[SC.currentTrack].finishTeleportUp, SC.tracks[SC.currentTrack].finishTeleportSpeed);
            }
            if (SC.canvas.lags.length > 0) {
                console.warn('lags', SC.canvas.lags.sort().join(', '));
                //alert(SC.canvas.lags.sort().join(', '));
            }
            if (self.callback) {
                self.callback();
            }
            SC.canvas.lags = [];
            // stop recording
            SC.record.stop();
        }
        return true;
    };

    self.update = function (aX, aY, aZ) {
        // Check if next checkpoint passed
        var f = self.tests[0],
            o = {x: aX, y: aY, z: aZ};
        if (f(o)) {
            return self.checkpointPassed();
        }
        // restart after fall out of map
        if (aY < SC.minY) {
            SC.startTrack(SC.currentTrack, SC.lastPackedData, true, SC.currentCarName);
        }
    };

    return self;
}());
