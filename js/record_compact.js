// Make records more compact
"use strict";
// global: document, window, console
// linter: ngspicejs-lint

var SC = window.SC || {};

SC.compact = (function () {
    var self = {};

    self.pack = function (aRecord) {
        // Pack record more efficiently (39k -> 7.6k)
        var a = [], i, d;
        a.push(1); // version

        function str(x) {
            var s = x.toFixed(3);
            s = s.replace(/00$/, '').replace(/0$/, '').replace(/\.$/, '');
            return s || '0';
        }
        for (i = 0; i < aRecord.length; i++) {
            d = aRecord[i];
            //console.log(i, aRecord[i]);
            a.push(d.t.toFixed(3));
            a.push(str(d.p[0]));
            a.push(str(d.p[1]));
            a.push(str(d.p[2]));
            a.push(str(d.f[0]));
            a.push(str(d.f[1]));
            a.push(str(d.f[2]));
            a.push(str(d.u[0]));
            a.push(str(d.u[1]));
            a.push(str(d.u[2]));
        }
        console.log('sent', aRecord.length);
        return JSON.stringify(a).replace(/"/g, ''); // "
    };

    self.unpack = function (aPacked) {
        // Unpack packed record
        //console.log('unpack', aPacked);
        var p = JSON.parse(aPacked), a = [], o, ver, tpfu;
        // first number is version
        ver = p.shift();
        if (ver !== 1) {
            throw "Unknown packed version " + ver;
        }
        // rest is data
        while (p.length > 0) {
            tpfu = p.splice(0, 10);
            //console.log(tpfu);
            if (tpfu.length !== 10) {
                throw "Missing data, got " + tpfu.length;
            }
            o = {
                t: tpfu[0],
                p: tpfu.slice(1, 1 + 3), // slice is shallow, original data is created here and not used elsewhere
                f: tpfu.slice(4, 4 + 3), // slice is shallow
                u: tpfu.slice(7, 7 + 3)  // slice is shallow
            };
            // r not needed because it is interpolated anyway
            // o.r = Vector.create(o.u).cross(Vector.create(o.f)).toUnitVector().elements;
            a.push(o);
        }
        a[0].lapTime = a.slice(-1)[0].t; // slice is shallow
        return a;
    };

    self.getLapTime = function (aRecord) {
        // Return lap time of given record
        return aRecord.slice(-1)[0].t; // slice is shallow, t is value
    };

    self.clone = function (aRecord) {
        // Make compact copy of given record
        return self.unpack(self.pack(aRecord));
    };

    return self;
}());

