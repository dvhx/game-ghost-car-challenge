// Radar chart for comparing car models
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.radarChart = function (aElementId, aObjects, aSelectedObject, aParams) {
    var self = {},
        canvas = document.getElementById(aElementId),
        context = canvas.getContext('2d'),
        w = canvas.clientWidth,
        h = canvas.clientHeight,
        w2 = w / 2,
        h2 = h / 2;
    canvas.width = w;
    canvas.height = w;

    context.clearRect(0, 0, w, h);

    function oneObject(aObject, aColor) {
        var p, x, y, ox, oy, first = true, x1, y1, v = Math.random();
        for (p in aParams) {
            if (aParams.hasOwnProperty(p)) {
                v = (aObject[p] - aParams[p].min) / (aParams[p].max - aParams[p].min);
                if (aParams[p].invert) {
                    v = (aObject[p] - aParams[p].max) / (aParams[p].min - aParams[p].max);
                }
                x = w2 + 0.8 * v * w2 * Math.sin(Math.PI * aParams[p].angle / 180);
                y = h2 - 0.8 * v * h2 * Math.cos(Math.PI * aParams[p].angle / 180);
                if (first) {
                    x1 = x;
                    y1 = y;
                    first = false;
                }
                context.strokeStyle = aColor;
                context.beginPath();
                context.moveTo(ox, oy);
                context.lineTo(x, y);
                context.stroke();
                ox = x;
                oy = y;
            }
        }
        // line back to first
        context.strokeStyle = aColor;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x, y);
        context.stroke();
    }

    (function () {
        // find range of values
        var p, o, x, y;
        for (p in aParams) {
            if (aParams.hasOwnProperty(p)) {
                aParams[p].min = Number.MAX_VALUE;
                aParams[p].max = -Number.MAX_VALUE;
            }
        }
        for (o in aObjects) {
            if (aObjects.hasOwnProperty(o)) {
                for (p in aParams) {
                    if (aParams.hasOwnProperty(p)) {
                        aParams[p].min = Math.min(aParams[p].min, aObjects[o][p]);
                        aParams[p].max = Math.max(aParams[p].max, aObjects[o][p]);
                    }
                }
            }
        }
        for (p in aParams) {
            if (aParams.hasOwnProperty(p)) {
                aParams[p].min = 0.9 * aParams[p].min;
                if (aParams[p].min === aParams[p].max) {
                    aParams[p].min = 0.9 * aParams[p].min;
                }
            }
        }
        //console.error(aParams);

        // all objects
        context.lineWidth = 1;
        for (o in aObjects) {
            if (aObjects.hasOwnProperty(o)) {
                if (o !== aSelectedObject) {
                    oneObject(aObjects[o], '#00000077');
                }
            }
        }
        // grid
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        for (p in aParams) {
            if (aParams.hasOwnProperty(p)) {
                x = w2 + 0.85 * w2 * Math.sin(Math.PI * aParams[p].angle / 180);
                y = h2 - 0.85 * h2 * Math.cos(Math.PI * aParams[p].angle / 180);
                context.beginPath();
                context.moveTo(w2, h2);
                context.lineTo(x, y);
                context.stroke();
                x = w2 + 0.92 * w2 * Math.sin(Math.PI * aParams[p].angle / 180);
                y = h2 - 0.92 * h2 * Math.cos(Math.PI * aParams[p].angle / 180);
                context.fillText(aParams[p].label, x, y);
            }
        }
        // selected object
        context.lineWidth = 2;
        oneObject(aObjects[aSelectedObject], 'red');

    }());

    self.canvas = canvas;
    self.context = context;
    return self;
};

/*
window.addEventListener('DOMContentLoaded', function () {
    var a = 360 / 10;
    SC.radarChart(
        'radar_chart',
        SC.cars,
        'Apex 440',
        {
            drag: {angle: 0, label: 'DR'},
            gasResponsivity: {angle: a, label: 'AC'},
            grip: {angle: 2 * a, label: 'GR'},
            horsePower: {angle: 3 * a, label: 'HP'},
            mass: {angle: 4 * a, label: 'MA'},
            maxSpeed: {angle: 5 * a, label: 'SP'},
            highSpeedSteeringCoefA: {angle: 6 * a, label: 'S1'},
            highSpeedSteeringCoefB: {angle: 7 * a, label: 'S2'},
            maxSteering: {angle: 8 * a, label: 'MS'},
            steeringResponsivity: {angle: 9 * a, label: 'SR'}
        }
    );
});
*/
