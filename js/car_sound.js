// Simple car sounds played once (crash, start, shift) and complex sounds (engine, squeeling)
"use strict";
// globals: document, window, setTimeout, setInterval

var SC = window.SC || {};

SC.carSound = (function () {
    var self = {};
    self.enabled = SC.storage.readBoolean('SC.sound.enabled', true);
    self.crashSound = 'crash';
    self.squeelingSound = 'squeeling';

    SC.sound.add('shift', 1, false);
    SC.sound.add('crash', 1, false);
    SC.sound.add('crash_sand', 1, false);
    SC.sound.add('engine_start', 2, false);

    self.prepare = function (aEngineSound, aSqeelingSound) {
        // Load custom car sounds for each level
        console.log('engine sound', aEngineSound);
        console.log('squeeling sound', aSqeelingSound);
        self.audio = {};
        self.audio.engine = SC.audio(aEngineSound);
        self.audio.squeeling = SC.audio(aSqeelingSound);
        self.audio.engine.userGesture();
        self.audio.squeeling.userGesture();
    };

    self.stop = function () {
        // Stop all sounds
        var k;
        for (k in SC.sound.sound) {
            if (SC.sound.sound.hasOwnProperty(k)) {
                SC.sound.stop(k);
            }
        }
        //self.audio.engine.rate(0.5);
        if (self.audio) {
            self.audio.engine.pause();
            self.audio.squeeling.pause();
        }
    };

    self.start = function () {
        // Start sounds
        if (!self.enabled) {
            return;
        }
        SC.sound.play('engine_start');
        if (self.audio) {
            self.audio.engine.userGesture();
            self.audio.squeeling.userGesture();
            self.audio.engine.volume(0);
            setTimeout(function () {
                self.audio.engine.play();
                self.audio.engine.fadeIn();
                self.audio.squeeling.play();
                self.audio.squeeling.volume(0);
            }, 1000);
        }
    };

    self.gear = 1;
    self.gearUp = 0.7;
    self.gearDown = 0.3;

    self.shift = 0.3;
    self.shiftAt = 0.5;

    self.engine = function (aPower) {
        // Update engine sound
        if (!self.enabled) {
            return;
        }
        if (!self.audio) {
            return;
        }

        var sp = 4 * SC.carPhysics.speed.modulus() * aPower / SC.carPhysics.maxSpeed, spi;
        spi = Math.floor(sp);
        if (spi !== self.gear) {
            self.gear = spi;
            SC.sound.play('shift');
        }
        self.audio.engine.rate(0.5 + 1.5 * (0.5 + (sp - spi) / 2));
    };

    self.squeeling = function (aSqueeling) {
        // Tire squeeling
        if (!self.enabled) {
            return;
        }
        self.audio.squeeling.volume(aSqueeling);
    };

    self.crash = function (aSpeed) {
        // Crash sound
        if (!self.enabled) {
            return;
        }
        if (aSpeed > 3) {
            SC.sound.play(self.crashSound);
        }
    };

    // engine sound updates
    setInterval(function () {
        if (!self.enabled) {
            return;
        }
        if (SC.pause) {
            return;
        }
        if (!self.audio) {
            return;
        }
        var g = SC.carPhysics.gas,
            s = SC.carPhysics.effectiveSpeed / SC.carPhysics.maxSpeed,
            r = (g + s) / 2,
            startSqueeling = Math.max(0, 5 * SC.carPhysics.gas / (SC.carPhysics.effectiveSpeed + 0.2) - 0.5);
        //document.title = 'g=' + g.toFixed(2) + ' s=' + s.toFixed(2) + ' ss=' + startSqueeling.toFixed(2);
        self.engine(r);
        //self.gasPedal(SC.carPhysics.gasPedal);
        self.squeeling(SC.carPhysics.squeeling + startSqueeling);
        self.oldSpeed = SC.carPhysics.effectiveSpeed;
    }, 200);

    return self;
}());
