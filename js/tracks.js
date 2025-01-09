// All tracks
"use strict";
// globals: document, window, Vector, setTimeout

var SC = window.SC || {};

SC.currentTrack = SC.storage.readNumber('SC.currentTrack', 1);

SC.tracks = SC.tracks || {};

SC.tracks[1] = {
    id: 1,
    dir: 'downtown',
    title: 'Downtown',
    skybox: 'union_square',
    skyboxY: -150,
    lightSkybox: [1, 1, 1],
    lightAmbientColor: [0.5, 0.5, 0.5],
    lightDirectionalColor: [0.5, 0.5, 0.5],
    lightDirection: [1, -1, 0],
    road: 'track/downtown/road.obj',
    other: [
        'track/downtown/decorations.obj',
        'track/downtown/sides.obj',
        'track/downtown/skyscrapers.obj'
    ],
    assets: [
        "skybox/left.obj",
        "skybox/right.obj",
        "skybox/up.obj",
        "skybox/down.obj",
        "skybox/front.obj",
        "skybox/back.obj",
        "skybox/union_square/union_square_lf.jpg",
        "skybox/union_square/union_square_rt.jpg",
        "skybox/union_square/union_square_up.jpg",
        "skybox/union_square/union_square_dn.jpg",
        "skybox/union_square/union_square_ft.jpg",
        "skybox/union_square/union_square_bk.jpg",
        "track/downtown/decorations.obj",
        "track/downtown/road.obj",
        "track/downtown/sides.obj",
        "track/downtown/skyscrapers.obj",
        "textures/concrete_walls.jpg",
        "textures/decorations.jpg",
        "textures/road.jpg",
        "textures/skyscrapers.jpg"
    ],
    position: [0, 0, 0],
    forward: [-0.9823762602544215, -0.1865756992847631, 0.01124240743518353], //[-1, 0, 0],
    //up: [0, 1, 0],
    up: [-0.18691410671358402, 0.9805976709857331, -0.059087429871495414],
    lap: 'x > 47,x > 75,z < -104,z > 0,x > 47',
    lights: {},
    crashSound: 'crash',
    unstuckRadius: 5,
    squeelingSound: 'sound/squeeling.ogg'
};

SC.tracks[2] = {
    id: 2,
    dir: 'desert_island',
    title: 'Desert island',
    skybox: 'tropic',
    skyboxY: 150,
    lightSkybox: [0.72, 0.62, 0.52],
    lightAmbientColor: [0.27, 0.25, 0.2],
    lightDirectionalColor: [0.72, 0.62, 0.52],
    lightDirection: Vector.create([-1, -1, -1]).toUnitVector().elements,
    road: 'track/desert_island/road.obj',
    other: [
        'track/desert_island/palms.obj',
        'track/desert_island/sides.obj',
        'track/desert_island/stonewall.obj',
        'track/desert_island/column.obj',
        'track/desert_island/building.obj',
        'track/desert_island/decorations.obj'
    ],
    assets: [
        "skybox/back.obj",
        "skybox/down.obj",
        "skybox/front.obj",
        "skybox/left.obj",
        "skybox/right.obj",
        "skybox/up.obj",
        "skybox/tropic/tropic_bk.jpg",
        "skybox/tropic/tropic_dn.jpg",
        "skybox/tropic/tropic_ft.jpg",
        "skybox/tropic/tropic_lf.jpg",
        "skybox/tropic/tropic_rt.jpg",
        "skybox/tropic/tropic_up.jpg",
        "textures/column.jpg",
        "textures/decorations.jpg",
        "textures/desert_building.jpg",
        "textures/palm.jpg",
        "textures/road_sand.jpg",
        "textures/sand.jpg",
        "textures/stonewall.jpg",
        'track/desert_island/road.obj',
        'track/desert_island/palms.obj',
        'track/desert_island/sides.obj',
        'track/desert_island/stonewall.obj',
        'track/desert_island/column.obj',
        'track/desert_island/building.obj',
        'track/desert_island/decorations.obj'
    ],
    position: [-12, -10, -46], //[-68, 4.3, -73],
    forward: [0.9890786251663591, 0.03312955455131373, -0.14361721990853413], //[1, 0, 0],
    up: [0, 1, 0],
    lap: 'x < -55,z < -107,z > 36,x > 70,x < -96,x > 6,x < -55',
    lights: {},
    crashSound: 'crash',
    unstuckRadius: 5,
    squeelingSound: 'sound/squeeling_sand.ogg'
};

SC.tracks[3] = {
    id: 3,
    dir: 'salt_flats',
    title: 'Salt flats',
    skybox: 'dust',
    skyboxY: 0,
    lightSkybox: [1, 1, 1],
    lightAmbientColor: [0.92, 0.92, 0.92],
    lightDirectionalColor: [0.1, 0.1, 0.1],
    lightDirection: Vector.create([-1, -1, -1]).toUnitVector().elements,
    road: 'track/salt_flats/road.obj',
    other: [
        'track/salt_flats/flags.obj',
        'track/salt_flats/decorations.obj'
    ],
    assets: [
        "skybox/back.obj",
        "skybox/down.obj",
        "skybox/front.obj",
        "skybox/left.obj",
        "skybox/right.obj",
        "skybox/up.obj",
        "skybox/dust/dust_bk.jpg",
        "skybox/dust/dust_dn.jpg",
        "skybox/dust/dust_ft.jpg",
        "skybox/dust/dust_lf.jpg",
        "skybox/dust/dust_rt.jpg",
        "skybox/dust/dust_up.jpg",
        "textures/decorations.jpg",
        "textures/flags.jpg",
        "textures/salt_flats.png",
        "track/salt_flats/decorations.obj",
        "track/salt_flats/flags.obj",
        "track/salt_flats/road.obj"
    ],
    position: [0, 0, 1],
    forward: [0, 0, -1],
    up: [0, 1, 0],
    lap: 'z < -34,z < -86.4,x > 8,z < -162.5,x < -52.3,x > 14.1,z > -146.2,x > 88.1,z > -171.9,x < 40,z > -96,x > 112,z < -77.3,z > 11,x < 53.5,x < 3.2,z > 7.4,z < -34',
    lights: {},
    crashSound: 'crash',
    unstuckRadius: 5,
    squeelingSound: 'sound/squeeling_sand.ogg'
};

SC.tracks[4] = {
    id: 4,
    dir: 'midnight',
    title: 'Midnight run',
    skybox: 'sleepyhollow',
    skyboxY: 150,
    lightSkybox: [1, 1, 1],
    lightAmbientColor: [0.91, 0.91, 0.91],
    lightDirectionalColor: [0, 0, 0],
    lightDirection: [0, 1, 0],
    road: 'track/midnight/road.obj',
    other: [
        'track/midnight/fence.obj',
        'track/midnight/decorations.obj'
    ],
    assets: [
        "skybox/back.obj",
        "skybox/down.obj",
        "skybox/front.obj",
        "skybox/left.obj",
        "skybox/right.obj",
        "skybox/up.obj",
        "skybox/sleepyhollow/sleepyhollow_bk.jpg",
        "skybox/sleepyhollow/sleepyhollow_dn.jpg",
        "skybox/sleepyhollow/sleepyhollow_ft.jpg",
        "skybox/sleepyhollow/sleepyhollow_lf.jpg",
        "skybox/sleepyhollow/sleepyhollow_rt.jpg",
        "skybox/sleepyhollow/sleepyhollow_up.jpg",
        "textures/decorations.jpg",
        "textures/road_night.jpg",
        "track/midnight/decorations.obj",
        "track/midnight/fence.obj",
        "track/midnight/road.obj"
    ],
    position: [0, 0, 1],
    forward: [0, 0, 1],
    up: [0, 1, 0],
    lap: 'z > 10,z > 975',
    crashSound: 'crash',
    unstuckRadius: 5,
    squeelingSound: 'sound/squeeling.ogg',
    fog: true,
    fogColor: [0, 0, 0, 1],
    fogA: 0.9,
    fogB: 0.99999,
    fogC: 0.85,
    lights: {},
    finishTeleport: [0, 0, -28],
    nightlights: true
};

SC.tracks[5] = {
    id: 5,
    dir: 'uphill',
    title: 'Uphill',
    skybox: 'meadow',
    skyboxY: 0,
    lightSkybox: [1, 1, 1],
    lightAmbientColor: [0.5, 0.5, 0.5],
    lightDirectionalColor: [0.7, 0.7, 0.7],
    lightDirection: [0, -1, 1],
    road: 'track/uphill/road.obj',
    other: [
        'track/uphill/sides.obj',
        'track/uphill/railing.obj',
        'track/uphill/wall.obj',
        'track/uphill/decorations.obj'
    ],
    assets: [
        "skybox/back.obj",
        "skybox/down.obj",
        "skybox/front.obj",
        "skybox/left.obj",
        "skybox/right.obj",
        "skybox/up.obj",
        "skybox/meadow/meadow_bk.jpg",
        "skybox/meadow/meadow_dn.jpg",
        "skybox/meadow/meadow_ft.jpg",
        "skybox/meadow/meadow_lf.jpg",
        "skybox/meadow/meadow_rt.jpg",
        "skybox/meadow/meadow_up.jpg",
        "textures/decorations.jpg",
        "textures/grass.jpg",
        "textures/road.jpg",
        "textures/stonewall.jpg",
        "track/uphill/decorations.obj",
        "track/uphill/railing.obj",
        "track/uphill/road.obj",
        "track/uphill/sides.obj",
        "track/uphill/wall.obj"
    ],
    position: [0, 0, 1], // [-58, 121, 35], //
    forward: [0, 0, 1],
    up: [0, 1, 0],
    lap: 'z > 17,y < 76,y > 134,z < 0,x > 65',
    crashSound: 'crash',
    unstuckRadius: 5,
    squeelingSound: 'sound/squeeling.ogg',
    fog: false,
    fogColor: [0.3, 0.3, 0.3, 1],
    fogA: 0.9,
    fogB: 0.99999,
    fogC: 0.85,
    finishTeleport: [0, 0, 1],
    finishTeleportForward: [0, 0, 1],
    finishTeleportUp: [0, 1, 0],
    finishTeleportSpeed: [0, 0, 0],
    //minY: -14,
    //reflectionDisablesGround: true,
    lights: {}
};

SC.tracks[6] = {
    id: 6,
    dir: 'go_kart',
    title: 'Go kart',
    skybox: 'meadow',
    skyboxY: 0,
    lightSkybox: [1, 1, 1],
    lightAmbientColor: [0.5, 0.5, 0.5],
    lightDirectionalColor: [0.7, 0.7, 0.7],
    lightDirection: [0, -1, 1],
    road: 'track/go_kart/road.obj',
    other: [
        'track/go_kart/rails.obj',
        'track/go_kart/grass.obj',
        'track/go_kart/fence.obj',
        'track/go_kart/tires.obj',
        'track/go_kart/decorations.obj'
    ],
    assets: [
        "skybox/back.obj",
        "skybox/down.obj",
        "skybox/front.obj",
        "skybox/left.obj",
        "skybox/right.obj",
        "skybox/up.obj",
        "skybox/meadow/meadow_bk.jpg",
        "skybox/meadow/meadow_dn.jpg",
        "skybox/meadow/meadow_ft.jpg",
        "skybox/meadow/meadow_lf.jpg",
        "skybox/meadow/meadow_rt.jpg",
        "skybox/meadow/meadow_up.jpg",
        "textures/decorations.jpg",
        "textures/go_kart.jpg",
        "textures/grass.jpg",
        "textures/rails.jpg",
        "textures/tarmac.jpg",
        "textures/wood.jpg",
        "track/go_kart/decorations.obj",
        "track/go_kart/fence.obj",
        "track/go_kart/grass.obj",
        "track/go_kart/rails.obj",
        "track/go_kart/road.obj",
        "track/go_kart/tires.obj"
    ],
    position: [0, 0, -9],
    forward: [0, 0, 1],
    up: [0, 1, 0],
    lap: 'z > 0,z > 25,z < -15,x > 20,z > 19,z < -9,z > 0',
    crashSound: 'crash',
    unstuckRadius: 3,
    squeelingSound: 'sound/squeeling_off.ogg',
    fog: false,
    fogColor: [0.3, 0.3, 0.3, 1],
    fogA: 0.9,
    fogB: 0.99999,
    fogC: 0.85,
    //minY: -14,
    //reflectionDisablesGround: true,
    lights: {}
};

SC.tracks[7] = {
    id: 7,
    dir: 'vulcan',
    title: 'Vulcan',
    skybox: 'vulcan',
    skyboxY: 150,
    lightSkybox: [1, 1, 1],
    lightAmbientColor: [0.5, 0.5, 0.5],
    lightDirectionalColor: [0.7, 0.7, 0.7],
    lightDirection: [0, -1, 1],
    road: 'track/vulcan/road.obj',
    other: [
        'track/vulcan/lava.obj',
        'track/vulcan/decorations.obj'
    ],
    assets: [
        "skybox/back.obj",
        "skybox/down.obj",
        "skybox/front.obj",
        "skybox/left.obj",
        "skybox/right.obj",
        "skybox/up.obj",
        "skybox/vulcan/vulcan_bk.jpg",
        "skybox/vulcan/vulcan_dn.jpg",
        "skybox/vulcan/vulcan_ft.jpg",
        "skybox/vulcan/vulcan_lf.jpg",
        "skybox/vulcan/vulcan_rt.jpg",
        "skybox/vulcan/vulcan_up.jpg",
        "textures/decorations.jpg",
        "textures/road.jpg",
        "track/vulcan/decorations.obj",
        "track/vulcan/lava.obj",
        "track/vulcan/road.obj"
    ],
    position: [3, 0, -16],
    forward: [-0.5, 0, 1],
    up: [0, 1, 0],
    lap: 'z > 0,x < -68,z < 0,z > 0',
    crashSound: 'crash',
    unstuckRadius: 5,
    squeelingSound: 'sound/squeeling.ogg',
    fog: false,
    fogColor: [0, 0, 0, 1],
    fogA: 0.9,
    fogB: 0.99999,
    fogC: 0.85,
    minY: -14,
    reflectionDisablesGround: true,
    lights: {
        'track/vulcan/lava.obj': false
    }
};

SC.restartTrack = function () {
    // Restart current track
    SC.startTrack(
        SC.currentTrack,
        SC.lastPackedData,
        true,
        SC.currentCarName
    );
};

SC.startTrack = function (aTrack, aPackedData, aStart, aCarName) {
    // Start new track, optionally with record playback
    console.log('SC.startTrack', aTrack, typeof aPackedData, typeof aTrack, aCarName);
    SC.loadingShow();
    SC.trackPosition.clearCache();
    SC.canvas.clear();
    SC.texturesNeeded = {};
    SC.modelsNeeded = {};
    SC.pause = true;
    SC.currentTrack = aTrack;
    SC.currentCarName = aCarName;
    var i, t = SC.tracks[aTrack], m, ass;
    if (!t.assets) {
        throw aTrack + ' has no assets[]';
    }

    // show intro
    if (SC.player.wins <= 0) {
        SC.showIntro();
    }

    // audio
    SC.carSound.prepare(
        SC.cars[SC.player.car].sound,
        t.squeelingSound
    );
    // level assets
    ass = t.assets.slice(); // slice is shallow, need to release, not checked!
    // add opponent's car
    if (aPackedData && aCarName) {
        ass.push(SC.cars[aCarName].model);
        // NOTE: most cars use lights and shadow from apex
        ass.push(SC.cars[aCarName].shadow);
        ass.push(SC.cars[aCarName].lights);
    }
    // wait for assets to be loaded
    SC.wait = SC.waiter(t.assets, function () {
        console.log('all level assets ready');
        // place cam in correct height even in first frame
        SC.trackPosition.get();
        SC.carPhysics.up = SC.trackPosition.plane.normal.multiply(-1);
        // unpause and start engine
        if (aStart) {
            SC.keepOnlyNeededModels();
            SC.keepOnlyNeededTextures();
            if (SC.player.wins <= 0) {
                console.log('no lip');
                //SC.lip.message('Drive one lap as fast as you can to qualify!');
            } else {
                SC.lip.message('Go!');
            }
            SC.carSound.start();
            SC.loadingHide();
            SC.storage.writeNumber('SC.currentTrack', aTrack);
            SC.pause = false;
        }
    });
    // camera height
    SC.camHeight = SC.cars[SC.player.car].camHeight;
    // unpack record
    if (aPackedData && aCarName) {
        SC.rec1 = SC.compact.unpack(Array.isArray(aPackedData) ? JSON.stringify(aPackedData) : aPackedData);
        SC.rec1carName = aCarName;
        SC.rec1camHeight = SC.cars[aCarName] ? SC.cars[aCarName].camHeight : 1.5;
        SC.rec1time = SC.compact.getLapTime(SC.rec1);
        SC.lapCounter.lapBest = SC.compact.getLapTime(SC.rec1);
        SC.lastPackedData = aPackedData;
        // load model of opponent's car
        SC.car = SC.model(SC.canvas, SC.cars[aCarName].model);
        // car fog
        if (SC.car) {
            SC.car.fog = t.fog;
        }
        // it's shadow
        SC.carShadow = SC.model(SC.canvas, SC.cars[aCarName].shadow);
        // it's lights
        SC.carLights = SC.model(SC.canvas, SC.cars[aCarName].lights);
        SC.carLights.fog = false;
    } else {
        SC.rec1 = null;
        SC.rec1time = 999;
        SC.lapCounter.lapBest = 999;
    }
    // debug models
    //SC.box1m = SC.model(SC.canvas, 'model/box/1m.obj');
    //SC.box10cm = SC.model(SC.canvas, 'model/box/10cm.obj');
    // load models
    SC.road = SC.model(SC.canvas, t.road);
    SC.other = [];
    for (i = 0; i < t.other.length; i++) {
        m = SC.model(SC.canvas, t.other[i], false);
        SC.other.push(m);
        if (t.lights[t.other[i]] === false) {
            m.fog = false;
        } else {
            m.fog = t.fog;
        }
    }
    SC.reflectionDisablesGround = t.reflectionDisablesGround;
    SC.trackPosition.disabled = false;
    SC.minY = t.minY;
    // move player to origin
    SC.carPhysics.position = Vector.create(t.position);
    SC.carPhysics.forward = Vector.create(t.forward).toUnitVector();
    SC.carPhysics.up = Vector.create(t.up).toUnitVector();
    SC.carPhysics.right = SC.carPhysics.up.cross(SC.carPhysics.forward).toUnitVector();
    SC.carPhysics.speed = Vector.create([0, 0, 0]);
    // import car to physics
    SC.carPhysics.reset();
    SC.carPhysics.importCar(SC.cars[SC.player.car]);
    // custom sounds
    SC.carSound.crashSound = t.crashSound;
    SC.carSound.squeelingSound = t.squeelingSound;
    // reset timer
    SC.canvas.limitedFrames = 0;
    SC.lapCounter.lapTime = 0;
    SC.lapCounter.lapStart = 0;
    SC.lapCounter.addRules(t.lap);
    // ambient color
    SC.lightSkybox = t.lightSkybox;
    SC.lightAmbientColor = t.lightAmbientColor;
    SC.lightDirection = Vector.create(t.lightDirection).toUnitVector().elements;
    SC.lightDirectionalColor = t.lightDirectionalColor;
    // skybox
    SC.currentSkybox = SC.skybox(SC.canvas, t.skybox);
    SC.currentSkybox.y = t.skyboxY;
    // fog
    SC.canvas.fogColor = t.fogColor;
    SC.road.fog = t.fog;
    SC.canvas.fogA = t.fogA;
    SC.canvas.fogB = t.fogB;
    SC.canvas.fogC = t.fogC;
};

SC.prevTrack = function () {
    // previous track
    var t = Object.keys(SC.tracks),
        a = t.indexOf(SC.currentTrack.toString());
    if (a === 0) {
        a = t.length;
    }
    SC.currentTrack = parseInt(t[a - 1], 10);
    SC.storage.writeNumber('SC.currentTrack', SC.currentTrack);
    return SC.currentTrack;
};

SC.nextTrack = function () {
    // previous track
    var t = Object.keys(SC.tracks),
        a = t.indexOf(SC.currentTrack.toString());
    if (a >= t.length - 1) {
        a = -1;
    }
    SC.currentTrack = parseInt(t[a + 1], 10);
    SC.storage.writeNumber('SC.currentTrack', SC.currentTrack);
    return SC.currentTrack;
};

SC.selectTrackByTitle = function (aTitle) {
    // change track by title
    var k;
    for (k in SC.tracks) {
        if (SC.tracks.hasOwnProperty(k)) {
            if (SC.tracks[k].title.trim() === aTitle.trim()) {
                SC.currentTrack = parseInt(k, 10);
            }
        }
    }
    SC.storage.writeNumber('SC.currentTrack', SC.currentTrack);
    return SC.currentTrack;
};
