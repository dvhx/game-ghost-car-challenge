// Fetch data from server (records/replays), pass json to callback
// linter: ngspicejs-lint
// global: window, fetch
"use strict";

var SC = window.SC || {};

SC.fetchCache = 1;

SC.fetch = function (aUrl, aCallback) {
    // Fetch data from server (records/replays), pass json to callbaack
    if (aUrl.indexOf('?') >= 0) {
        aUrl += '&cache=' + SC.fetchCache;
    } else {
        aUrl += '?cache=' + SC.fetchCache;
    }
    //console.log(aUrl);
    fetch(aUrl).then((aResponse) => {
        if (!aResponse.ok) {
            throw "Failed to fetch " + aUrl;
        }
        return aResponse.json();
    }).then((aData) => {
        if (aCallback) {
            aCallback(aData);
        }
    });
};

