// Simple initializer with dependencies
// require: none
"use strict";

var SC = window.SC || {};

SC.waiter = function (aDependencies, aCallback) {
    var self = {}, i, met = {}, unexpected = {}, cb = aCallback;

    for (i = 0; i < aDependencies.length; i++) {
        met[aDependencies[i]] = false;
    }

    self.done = function (aDependency) {
        if (!met.hasOwnProperty(aDependency)) {
            unexpected[aDependency] = true;
            console.log('Unexpected dependency ' + aDependency);
        } else {
            met[aDependency] = true;
        }
        var d, all_true = true, c;
        for (d in met) {
            if (met.hasOwnProperty(d)) {
                if (!met[d]) {
                    all_true = false;
                    break;
                }
            }
        }
        if (all_true) {
            c = cb;
            cb = null;
            if (c) {
                c(aDependencies);
            } else {
                console.warn('additional callback supressed');
            }
        }
    };

    self.debug = function () {
        var d, m = [], u = [];
        for (d in met) {
            if (met.hasOwnProperty(d)) {
                if (met[d]) {
                    m.push(d);
                } else {
                    u.push(d);
                }
            }
        }
        console.log('met', m.sort());
        console.log('unmet', u.sort());
        console.log('unexpected', '"' + Object.keys(unexpected).sort().join('",\n"') + '"');
    };

    return self;
};

/*
var a = SC.init2(['apple', 'banana'], function () { console.log('all met'); });
console.log(a.pending());
a.done('banana');
console.log(a.pending());
a.done('apple');
console.log(a.pending());
*/
