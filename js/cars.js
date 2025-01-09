// Cars
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.cars = {};

SC.carNumberToName = function (aNumber) {
    // Converts 1 to "Apex 440"
    return Object.keys(SC.cars)[aNumber - 1];
};

SC.cars["Apex 440"] = {
    icon: "model/apex/icon.png",
    model: "model/apex/apex.obj",
    shadow: "model/apex/shadow.obj",
    lights: "model/apex/lights.obj",

    drag: 0.0014,
    gasResponsivity: 0.033,
    grip: 18500,
    highSpeedSteeringCoefA: 0.5,
    highSpeedSteeringCoefB: 0.5,
    horsePower: 2300,
    mass: 720,
    maxSpeed: 22,
    maxSteering: 0.16,
    steeringResponsivity: 0.85,
    rebound: 0.5,
    crashSlowdown: 1,
    reflectionSpeedMultiplier: 0.85,
    minSpeedSteering: 5,
    fenceMultiplier: 1,

    sound: 'sound/engine.ogg',
    width: 2.0,
    height: 1.3,
    length: 4.45,
    camHeight: 1.2
};

SC.cars["Blast X1"] = {
    icon: "model/blast/icon.png",
    model: "model/blast/blast.obj",
    shadow: "model/apex/shadow.obj",
    lights: "model/apex/lights.obj",

    drag: 0.0013,
    gasResponsivity: 0.037,
    grip: 19200,
    highSpeedSteeringCoefA: 0.48,
    highSpeedSteeringCoefB: 0.45,
    horsePower: 2100,
    mass: 625,
    maxSpeed: 22.5,
    maxSteering: 0.13,
    steeringResponsivity: 0.81,
    rebound: 0.6,
    crashSlowdown: 1,
    reflectionSpeedMultiplier: 0.89,
    minSpeedSteering: 5,
    fenceMultiplier: 1,

    sound: 'sound/engine.ogg',
    width: 2.0,
    height: 1.3,
    length: 4.45,
    camHeight: 1.2
};

SC.cars["Cobra 99"] = {
    icon: "model/cobra/icon.png",
    model: "model/cobra/cobra.obj",
    shadow: "model/apex/shadow.obj",
    lights: "model/apex/lights.obj",

    drag: 0.0015,
    gasResponsivity: 0.042,
    grip: 19700,
    highSpeedSteeringCoefA: 0.53,
    highSpeedSteeringCoefB: 0.51,
    horsePower: 2200,
    mass: 660,
    maxSpeed: 24,
    maxSteering: 0.12,
    steeringResponsivity: 0.84,
    rebound: 0.7,
    crashSlowdown: 1,
    reflectionSpeedMultiplier: 0.86,
    minSpeedSteering: 5,
    fenceMultiplier: 1,

    sound: 'sound/engine.ogg',
    width: 2.0,
    height: 1.3,
    length: 4.45,
    camHeight: 1.2
};

SC.cars.Deputy = {
    icon: "model/deputy/icon.png",
    model: "model/deputy/deputy.obj",
    shadow: "model/apex/shadow.obj",
    lights: "model/apex/lights.obj",

    drag: 0.0018,
    gasResponsivity: 0.029,
    grip: 17000,
    highSpeedSteeringCoefA: 0.59,
    highSpeedSteeringCoefB: 0.51,
    horsePower: 3000,
    mass: 760,
    maxSpeed: 23.5,
    maxSteering: 0.11,
    steeringResponsivity: 0.83,
    rebound: 0.55,
    crashSlowdown: 0.8,
    reflectionSpeedMultiplier: 0.85,
    minSpeedSteering: 5,
    fenceMultiplier: 1,

    sound: 'sound/engine.ogg',
    width: 2.0,
    height: 1.3,
    length: 4.45,
    camHeight: 1.2
};

SC.cars["Escape 7"] = {
    icon: "model/escape/icon.png",
    model: "model/escape/escape.obj",
    shadow: "model/apex/shadow.obj",
    lights: "model/apex/lights.obj",

    drag: 0.0016,
    gasResponsivity: 0.036,
    grip: 22100,
    highSpeedSteeringCoefA: 0.52,
    highSpeedSteeringCoefB: 0.53,
    horsePower: 2300,
    mass: 690,
    maxSpeed: 23,
    maxSteering: 0.125,
    steeringResponsivity: 0.82,
    rebound: 0.65,
    crashSlowdown: 0.7,
    reflectionSpeedMultiplier: 0.88,
    minSpeedSteering: 5,
    fenceMultiplier: 1,

    sound: 'sound/engine.ogg',
    width: 2.0,
    height: 1.3,
    length: 4.45,
    camHeight: 1.2
};

SC.cars.Fractal = {
    icon: "model/fractal/icon.png",
    model: "model/fractal/fractal.obj",
    shadow: "model/apex/shadow.obj",
    lights: "model/apex/lights.obj",

    drag: 0.0015,
    gasResponsivity: 0.032,
    grip: 20000,
    highSpeedSteeringCoefA: 0.61,
    highSpeedSteeringCoefB: 0.51,
    horsePower: 1900,
    mass: 730,
    maxSpeed: 21.5,
    maxSteering: 0.13,
    steeringResponsivity: 0.87,
    rebound: 0.75,
    crashSlowdown: 1,
    reflectionSpeedMultiplier: 0.85,
    minSpeedSteering: 5,
    fenceMultiplier: 1,

    sound: 'sound/engine.ogg',
    width: 2.0,
    height: 1.3,
    length: 4.45,
    camHeight: 1.2
};

SC.cars.Guardian = {
    icon: "model/guardian/icon.png",
    model: "model/guardian/guardian.obj",
    shadow: "model/apex/shadow.obj",
    lights: "model/apex/lights.obj",

    drag: 0.0019,
    gasResponsivity: 0.031,
    grip: 18000,
    highSpeedSteeringCoefA: 0.52,
    highSpeedSteeringCoefB: 0.48,
    horsePower: 3500,
    mass: 820,
    maxSpeed: 25,
    maxSteering: 0.0905,
    steeringResponsivity: 0.88,
    rebound: 0.45,
    crashSlowdown: 1,
    reflectionSpeedMultiplier: 0.78,
    minSpeedSteering: 5,
    fenceMultiplier: 1,

    sound: 'sound/engine.ogg',
    width: 2.0,
    height: 1.3,
    length: 4.45,
    camHeight: 1.2
};

SC.cars["Hikari 1"] = {
    icon: "model/hikari/icon.png",
    model: "model/hikari/hikari.obj",
    shadow: "model/apex/shadow.obj",
    lights: "model/apex/lights.obj",

    drag: 0.0013,
    gasResponsivity: 0.045,
    grip: 21000,
    highSpeedSteeringCoefA: 0.47,
    highSpeedSteeringCoefB: 0.45,
    horsePower: 1700,
    mass: 710,
    maxSpeed: 21.7,
    maxSteering: 0.14,
    steeringResponsivity: 0.89,
    rebound: 0.77,
    crashSlowdown: 0.5,
    reflectionSpeedMultiplier: 0.93,
    minSpeedSteering: 5,
    fenceMultiplier: 1,

    sound: 'sound/engine.ogg',
    width: 2.0,
    height: 1.3,
    length: 4.45,
    camHeight: 1.2
};

SC.cars.Inferno = {
    icon: "model/inferno/icon.png",
    model: "model/inferno/inferno.obj",
    shadow: "model/apex/shadow.obj",
    lights: "model/apex/lights.obj",
    warning: "Note: This car is optimized for \"Vulcan\" track and may not be suitable for other tracks!",

    drag: 0.0015,
    gasResponsivity: 0.038,
    grip: 18700,
    highSpeedSteeringCoefA: 0.7,
    highSpeedSteeringCoefB: 0.8,
    horsePower: 2450,
    mass: 750,
    maxSpeed: 25,
    maxSteering: 0.009,
    steeringResponsivity: 0.15,
    rebound: 0.57,
    crashSlowdown: 1,
    reflectionSpeedMultiplier: 0.75,
    minSpeedSteering: 5,
    fenceMultiplier: 1,

    sound: 'sound/engine.ogg',
    width: 2.0,
    height: 1.3,
    length: 4.45,
    camHeight: 1.2
};

SC.cars["Go-kart"] = {
    icon: "model/go_kart/icon.png",
    model: "model/go_kart/go_kart.obj",
    shadow: "model/go_kart/shadow.obj",
    lights: "model/go_kart/lights.obj",
    warning: "Note: This car is optimized for \"Go-kart\" track and may not be suitable for other tracks!",

    drag: 0.0013,
    gasResponsivity: 0.045,
    grip: 21000,
    highSpeedSteeringCoefA: 0.47,
    highSpeedSteeringCoefB: 0.45,
    horsePower: 400,
    mass: 110,
    maxSpeed: 11,
    maxSteering: 0.17,
    steeringResponsivity: 0.89,
    rebound: 0.77,
    crashSlowdown: 0.95,
    reflectionSpeedMultiplier: 0.93,
    minSpeedSteering: 0.05,
    fenceMultiplier: 0.07,

    sound: 'sound/engine_go_kart.ogg',
    width: 1.2,
    height: 1.02,
    length: 1.7,
    camHeight: 0.83
};

