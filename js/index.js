// Main page
"use strict";
// globals: window, document, Vector, setTimeout

var SC = window.SC || {};

SC.pause = false;
SC.speed = 1;

SC.showIntro = function () {
    // Show device-correct intro
    var img = document.getElementById('intro');
    img.classList.remove('hide');
    if (SC.isTouchDevice()) {
        img.src = 'image/intro_touch.png';
        window.setTimeout(function () {
            if (!img.classList.contains('hide')) {
                img.src = 'image/intro_touch_simple.png';
            }
        }, 5000);
    } else {
        img.src = 'image/intro_keyboard.png';
        window.setTimeout(function () {
            img.classList.add('hide');
        }, 5000);
    }
};

SC.hideIntro = function () {
    // Hide intro
    var img = document.getElementById('intro');
    img.classList.add('hide');
};

SC.submitRecord = function (aTime, aRecord) {
    // Save player's new record
    //console.log(aTime, aRecord, SC.compact.pack(aRecord));
    var old = SC.storage.readObject('SC.record.' + SC.currentTrack, null),
        data,
        prev;
    SC.player.wins++;
    SC.player.save();
    data = {
        track_id: SC.currentTrack,
        record: SC.compact.pack(aRecord),
        record_lap_time: aTime,
        record_frames: SC.lapCounter.lapFrame,
        record_limited_frames: SC.canvas.limitedFrames,
        player_name: SC.player.name,
        player_year: SC.player.year,
        country_name: SC.player.country,
        car_name: SC.player.car
    };
    try {
        data.record_startup = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    } catch (e) {
        console.error(e);
    }
    // opponent defeated but not own time
    if (old && (old.record_lap_time < data.record_lap_time)) {
        SC.splash('Congratulation', ['OK'], 'skyblue',
            'You drove faster than ' + SC.currentOpponent.name +
                ' on ' + SC.currentOpponent.car +
                ' at ' + SC.currentOpponent.lap_time.toFixed(3) + 's (' + (SC.currentOpponent.lap_time - data.record_lap_time).toFixed(3) + 's faster)' +
                ' but you did not beat your own previous record on this track which is still ' + old.record_lap_time.toFixed(3) + 's (' + (data.record_lap_time - old.record_lap_time).toFixed(3) + 's faster!)', console.log);
        SC.recordsShow(SC.currentTrack);
        return;
    }
    // improved own time
    prev = '';
    if (old) {
        prev = ' (' + (old.record_lap_time - data.record_lap_time).toFixed(3) + 's improvement)';
    }
    SC.storage.writeObject('SC.record.' + SC.currentTrack, data);
    if (SC.currentOpponent && SC.currentOpponent.you) {
        SC.splash('Congratulation', ['OK'], 'skyblue',
            'You have improved your own record from ' + SC.currentOpponent.lap_time.toFixed(3) + 's to ' + data.record_lap_time.toFixed(3) + 's' + prev, console.log);
        SC.recordsShow(SC.currentTrack);
        return;
    }
    // defeated opponent
    if (SC.currentOpponent) {
        SC.splash('Congratulation', ['OK'], 'skyblue',
            'You have beaten ' + SC.currentOpponent.name +
                    ' on ' + SC.currentOpponent.car +
                    ' at ' + SC.currentOpponent.lap_time.toFixed(3) + 's (' + (SC.currentOpponent.lap_time - data.record_lap_time).toFixed(3) + 's faster)' + ' and improved your track record to ' + data.record_lap_time.toFixed(3) + 's' + prev, console.log);
    }
    SC.recordsShow(SC.currentTrack);
};

SC.onWin = function (aTime, aRecord) {
    // User beated the record
    SC.pause = true;
    SC.carSound.stop();
    SC.hideIntro();
    // submit record
    SC.submitRecord(aTime, aRecord);
};

SC.render = function () {
    // Main render function
    if (SC.pause) {
        return;
    }
    if (!SC.road || !SC.road.loaded) {
        return;
    }
    if (SC.gasAlwaysOn) {
        SC.carPhysics.gasPedal = 1;
    }
    // render skybox
    var i,
        p,
        f,
        r,
        u,
        cam = SC.carPhysics.position.elements;

    // car is camera
    SC.canvas.cameraPosition = SC.carPhysics.position.add(SC.carPhysics.up.multiply(SC.camHeight));
    SC.canvas.cameraForward = SC.carPhysics.forward.dup();
    SC.canvas.cameraUp = SC.carPhysics.up.dup();

    // begin scene
    SC.canvas.sceneBegin();

    // skybox
    if (SC.currentSkybox) {
        SC.currentSkybox.render(cam[0], cam[1], cam[2]);
    }

    // render track and other
    SC.road.render(0, 0, 0, 0, 0, 0);
    for (i = 0; i < SC.other.length; i++) {
        SC.other[i].render(0, 0, 0, 0, 0, 0);
    }

    /*
    SC.box10cm.render(
        SC.trackPosition.frontLeft.elements[0],
        SC.trackPosition.frontLeft.elements[1],
        SC.trackPosition.frontLeft.elements[2],
        0, 0, 0
        );
    SC.box10cm.render(
        SC.trackPosition.frontRight.elements[0],
        SC.trackPosition.frontRight.elements[1],
        SC.trackPosition.frontRight.elements[2],
        0, 0, 0
        );
    SC.box10cm.render(
        SC.trackPosition.frontLeft2.elements[0],
        SC.trackPosition.frontLeft2.elements[1],
        SC.trackPosition.frontLeft2.elements[2],
        0, 0, 0
        );
    SC.box10cm.render(
        SC.trackPosition.frontRight2.elements[0],
        SC.trackPosition.frontRight2.elements[1],
        SC.trackPosition.frontRight2.elements[2],
        0, 0, 0
        );
    */

    // Opponent car
    if (SC.rec1 && SC.car) {
        SC.inter = SC.record.inter(SC.rec1, SC.lapCounter.first ? 0 : (SC.canvas.time - SC.lapCounter.lapStart));
        p = SC.inter.p;
        f = SC.inter.f;
        u = SC.inter.u;
        r = Vector.create(SC.inter.u).cross(Vector.create(SC.inter.f)).elements;

        SC.enemyDistance = SC.carPhysics.position.distanceFrom(p);

        SC.modelMatrix = [
            r[0], r[1], r[2], 0,
            u[0], u[1], u[2], 0,
            f[0], f[1], f[2], 0,
            p[0], p[1], p[2], 1
        ];
        if (SC.enemyDistance < 20) {
            //SC.box10cm.render(0, 0, 0, 0, 0, 0);
            SC.canvas.gl.disable(SC.canvas.gl.DEPTH_TEST);
            SC.carShadow.render(0, 0, 0, 0, 0, 0);
            SC.canvas.gl.enable(SC.canvas.gl.DEPTH_TEST);
        }

        SC.modelMatrix = [
            r[0], r[1], r[2], 0,
            u[0], u[1], u[2], 0,
            f[0], f[1], f[2], 0,
            p[0], p[1], p[2], 1
        ];
        //gl.enable(gl.BLEND);
        //gl.disable(gl.DEPTH_TEST);
        //gl.blendFunc(gl.SRC_ALPHA, gl.CONSTANT_ALPHA);
        //gl.blendFunc( gl.SRC_ALPHA_SATURATE, gl.DST_COLOR );
        SC.car.alpha = SC.enemyDistance / 5 - 1.3; // 0.3
        if (SC.car.alpha < 0) {
            SC.car.alpha = 0;
        }
        SC.car.render(0, 0, 0, 0, 0, 0);

        // lights
        if (SC.tracks[SC.currentTrack].nightlights) {
            SC.modelMatrix = [
                r[0], r[1], r[2], 0,
                u[0], u[1], u[2], 0,
                f[0], f[1], f[2], 0,
                p[0], p[1], p[2], 1
            ];
            //SC.carLights.alpha = SC.car.alpha;
            SC.carLights.render(0, 0, 0, 0, 0, 0);
        }

    }
    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    //SC.originalTexture = null;
    //gl.enable(gl.DEPTH_TEST);

    // checkpoints
    SC.lapCounter.update(cam[0], cam[1], cam[2]);

    // car physics
    if (SC.trackPosition.plane) {
        // save record
        if (SC.record.enabled) {         //12
            if (SC.lapCounter.lapFrame % 8 === 0) { // 200ms / (1000ms / 60fps) = 12 frames
                SC.record.add();
            }
        }
        SC.dir *= 0.99;
        SC.carPhysics.steering = SC.dir;
        // this should be update params
        SC.carPhysics.plane = SC.trackPosition.plane;
        SC.carPhysics.normal = SC.trackPosition.plane.normal;
        SC.carPhysics.update(SC.canvas.dt);
        // keep on road
        SC.carPhysics.position.elements[1] = SC.roadY;
    }

    // done
    SC.canvas.sceneEnd();
    SC.wasd();
};

SC.loop = function () {
    // Main loop
    SC.render();
    window.requestAnimationFrame(SC.loop);
};

SC.loadingShow = function () {
    // Show loading label where menu is
    document.getElementById('menu_loading').classList.remove('hide');
    document.getElementById('menu_hamburger').classList.add('hide');
};

SC.loadingHide = function () {
    // Hide loading label and show menu
    document.getElementById('menu_loading').classList.add('hide');
    document.getElementById('menu_hamburger').classList.remove('hide');
};

window.addEventListener('DOMContentLoaded', function () {
    // init webgl
    SC.jsonFailedAjaxAsWarningNotError = true;
    SC.canvas = SC.webglCanvas('canvas');

    // touch controls
    document.getElementById('gas').ontouchstart = function () {
        SC.carPhysics.gasPedal = 1;
    };
    document.getElementById('gas').ontouchend = function () {
        SC.carPhysics.gasPedal = 0;
    };
    document.getElementById('brake').ontouchstart = function () {
        SC.carPhysics.brakePedal = 1;
        SC.carPhysics.gasPedal = 0;
    };
    document.getElementById('brake').ontouchend = function () {
        SC.carPhysics.brakePedal = 0;
    };

    // Prevent context menu on long tap in chrome console so I can test long press
    if (SC.storage.readBoolean('SC.contextMenu', true)) {
        window.oncontextmenu = function (event) { event.preventDefault(); };
    }

    // main menu
    document.getElementById('menu').onclick = SC.onTrackMenu;

    // cache audio
    SC.audioCache.loadMultiple([
        'sound/engine.ogg',
        'sound/engine_go_kart.ogg',
        'sound/squeeling.ogg',
        'sound/squeeling_off.ogg',
        'sound/squeeling_sand.ogg'
    ], function () {

        function normalStart() {
            // start
            SC.loop();
            SC.recordsShow(SC.currentTrack);
            //SC.leaderboard();
            //SC.startTrack(1, null, true, '???');
        }

        // mobile start requires touch to activate fullscreen and orientation lock
        if (SC.isTouchDevice()) {
            SC.fixMobile(normalStart);
            return;
        }
        normalStart();
    });
});

