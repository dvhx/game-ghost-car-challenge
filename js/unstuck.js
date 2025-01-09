// Unstuck car from side
"use strict";
// globals: document, window, Vector

var SC = window.SC || {};

SC.unstuck = function () {
    // Move car away from side if it is stuck
    var x, z, cx = SC.carPhysics.position.elements[0], cz = SC.carPhysics.position.elements[2], t,
        ux = 0, uz = 0, n = 0, radius = SC.tracks[SC.currentTrack].unstuckRadius || 5;
    // five meters
    for (z = cz - radius; z < cz + radius; z += 1) {
        for (x = cx - radius; x < cx + radius; x += 1) {
            // is point on triangle
            t = SC.trackPosition.findTriangle(x, z, false);
            if (t) {
                ux += x;
                uz += z;
                n++;
            }
        }
    }
    // find average coordinates of good points
    if (n > 0) {
        ux /= n;
        uz /= n;
        SC.carPhysics.position.elements[0] = ux;
        SC.carPhysics.position.elements[2] = uz;
        SC.carPhysics.speed = Vector.create([0, 0, 0]);
        SC.sound.play('engine_start');
    }
    return {x: ux, z: uz, n: n};
};


