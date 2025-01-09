// Remember which keys are up and down
"use strict";
// globals: window

var SC = window.SC || {};
SC.keys = {};

window.addEventListener('keydown', function (event) {
    // key pressed
    SC.keys[event.keyCode] = true;
    SC.keys[event.key] = true;
});

window.addEventListener('keyup', function (event) {
    // key released
    SC.keys[event.keyCode] = false;
    SC.keys[event.key] = false;
    if ((SC.pause === false) && (event.key === 'Escape') && (document.getElementById('records').classList.contains('hide'))) {
        SC.onTrackMenu();
    }
});

