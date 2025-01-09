// Various functions and constants
"use strict";
// globals: window, document

var SC = window.SC || {};

SC.purge = function () {
    // Erase all changes and restart
    SC.storage.eraseAll();
    document.location.reload();
};

SC.randomItem = function () {
    // Return random item from arguments
    return arguments[Math.floor(arguments.length * Math.random())];
};

SC.lead = function (aValue) {
    // Lead zeros to number
    return (aValue >= 0) && (aValue < 10) ? '0' + aValue.toString() : aValue.toString();
};

SC.humanTime = function (aSeconds) {
    // Return human readable time, e.g. 00:23.4s
    var m = Math.floor(aSeconds / 60),
        s = aSeconds - m * 60;
    return SC.lead(m) + ':' + SC.lead(s.toFixed(3));
};

SC.fileName = function (aFileName) {
    // Return just the filename without path
    return aFileName.split('/').slice(-1)[0]; // slice is shallow, value is string
};

