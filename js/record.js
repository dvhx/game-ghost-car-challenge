// Record player's positions and orientation
"use strict";
// globals: document, window, setInterval

var SC = window.SC || {};

SC.record = (function () {
    var self = {};
    self.data = [];
    self.enabled = false;
    self.max = 2000;

    self.add = function () {
        // Add one frame
        if (self.data.length >= self.max) {
            return;
        }
        self.data.push({
            t: SC.canvas.time - SC.lapCounter.lapStart,
            p: SC.carPhysics.position.elements,
            f: SC.carPhysics.forward.elements,
            u: SC.carPhysics.up.elements
        });
    };

    self.start = function () {
        // Start recording
        self.data = [];
        self.enabled = true;
        self.add();
    };

    self.stop = function () {
        // Stop recording
        self.add();
        self.enabled = false;
        self.last = self.data;
        self.data = [];
        // did we beat the opponent?
        console.log('cur', SC.lapCounter.lapTime);
        console.log('bst', SC.rec1time);
        //console.log('d', self.data);
        //console.log('s', self);
        if (SC.lapCounter.lapTime <= SC.rec1time) {
            SC.rec1 = self.last;
            SC.rec1camHeight = SC.cars[SC.player.car].camHeight;
            SC.rec1time = SC.lapCounter.lapTime;
            SC.onWin(SC.lapCounter.lapTime, self.last);
        }
    };

    self.inter = function (aRecord, aTime) {
        // Interpolate one frame at exact time
        var i, a, b, k;
        if (aTime === 0) {
            aTime = 0.0000001;
        }
        for (i = 0; i < aRecord.length; i++) {
            if (aRecord[i].t >= aTime) {
                a = aRecord[i - 1];
                b = aRecord[i];
                k = (aTime - a.t) / (b.t - a.t);
                return {
                    i: i,
                    at: a.t,
                    bt: b.t,
                    k: k,
                    ap: a.p,
                    bp: b.p,
                    p: [
                        a.p[0] + k * (b.p[0] - a.p[0]),
                        a.p[1] + k * (b.p[1] - a.p[1]),
                        a.p[2] + k * (b.p[2] - a.p[2])
                    ],
                    f: [
                        a.f[0] + k * (b.f[0] - a.f[0]),
                        a.f[1] + k * (b.f[1] - a.f[1]),
                        a.f[2] + k * (b.f[2] - a.f[2])
                    ],
                    /*
                    r: [
                        a.r[0] + k * (b.r[0] - a.r[0]),
                        a.r[1] + k * (b.r[1] - a.r[1]),
                        a.r[2] + k * (b.r[2] - a.r[2])
                    ],
                    */
                    u: [
                        a.u[0] + k * (b.u[0] - a.u[0]),
                        a.u[1] + k * (b.u[1] - a.u[1]),
                        a.u[2] + k * (b.u[2] - a.u[2])
                    ]
                };
            }
        }
        return aRecord[0];
    };

    return self;
}());

