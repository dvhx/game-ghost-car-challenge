// WASD controls on desktop
"use strict";
// globals: document, window, localStorage

var SC = window.SC || {};

SC.isDesktop = localStorage.getItem('SC.isDesktop') === 'true';

SC.wasd = function () {
    // camera movement using keyboard
    var s = 0.04;
    var m = 1.5;
    if (SC.keys.a || SC.keys.ArrowLeft) {
        SC.dir -= s;
        if (SC.dir < -m) {
            SC.dir = -m;
        }
    }
    if (SC.keys.d || SC.keys.ArrowRight) {
        SC.dir += s;
        if (SC.dir > m) {
            SC.dir = m;
        }
    }
    if (SC.keys.w || SC.keys.ArrowUp) {
        SC.carPhysics.gasPedal = 1;
        SC.keys.wOld = true;
    } else {
        if (SC.keys.wOld) {
            SC.carPhysics.gasPedal = 0;
            SC.keys.wOld = false;
        }
    }
    if (SC.keys.s || SC.carPhysics.brakePedal || SC.keys.ArrowDown) {
        SC.carPhysics.gasPedal = 0;
        SC.carPhysics.gas = 0;
        SC.carPhysics.halveSpeed(0.98, SC.carPhysics.forward);
    }

    SC.trackPosition.get();
};

window.addEventListener('DOMContentLoaded', function () {
    window.setInterval(function () {
        SC.hamburger = SC.hamburger || document.getElementById('menu_hamburger');
        SC.hamburger.textContent = SC.dir.toFixed(3);
    }, 100);
});

