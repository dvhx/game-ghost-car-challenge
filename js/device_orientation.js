// Use device orientation to steer the car
"use strict";
// global: document, window, screen, alert, console
// linter: ngspicejs-lint

var SC = window.SC || {};

SC.orientFrames = 0;
SC.orientScale = 0.2;
SC.orientDirection = 1;
SC.dir = 0;

SC.onOrientationChange = function () {
    // Detect which way orientation works
    var angle = screen && screen.orientation && screen.orientation.angle;
    //console.log('Device angle ' + angle);
    switch (angle) {
    case 90:
        SC.orientDirection = 1;
        break;
    case 270:
        SC.orientDirection = -1;
        break;
    }
};

window.addEventListener('orientationchange', SC.onOrientationChange);
SC.onOrientationChange();

if (!window.DeviceOrientationEvent) {
    if (SC.isTouchDevice()) {
        if (!SC.storage.readBoolean('SC.dontFixMobile', false)) {
            alert('This device does not support device orientation events, steering by tilting phone will not work!');
        }
    }
    console.warn('This device does not support device orientation events (https required!)');
}

window.addEventListener('deviceorientation', function (event) {
    // read tilt angle and calculate turning strength
    var b = event.beta;
    var g = event.gamma;
    var b2 = b;
    if (g > 0) {
        b2 = b > 0 ? 180 - b : -(180 + b);
    }
    SC.dir = SC.orientScale * 13 * b2 / 90;
    //SC.hamburger = SC.hamburger || document.getElementById('menu_hamburger');
    //SC.hamburger.textContent = (13 * event.beta / 90).toFixed(3);
});

