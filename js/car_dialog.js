// Dialog with rotating car where player can change car
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.carDialog = (function () {
    var self = {}, angle = 0;
    self.enabled = false;
    self.car = SC.player.car;

    self.show = function () {
        // Show dialog
        document.getElementById('car_dialog_prev').onclick = self.prevCar;
        document.getElementById('car_dialog_next').onclick = self.nextCar;
        document.getElementById('car_dialog_close').onclick = self.hide;
        document.getElementById('car_dialog_choose').onclick = self.chooseCar;
        document.getElementById('car_dialog').classList.remove('hide');
        self.canvas = SC.webglCanvas('car_dialog_canvas');
        self.loadCar();
        self.enabled = true;
        self.render();
    };

    self.hide = function () {
        // Hide dialog
        self.enabled = false;
        self.canvas.free();
        self.canvas = null;
        document.getElementById('car_dialog').classList.add('hide');
        var canvas = document.createElement('canvas');
        canvas.id = 'car_dialog_canvas';
        document.getElementById('car_dialog').insertAdjacentElement('afterbegin', canvas);
    };

    self.chooseCar = function () {
        // Choose this car and return back
        SC.player.car = self.car;
        SC.player.save();
        if (document.getElementById('records_car')) {
            document.getElementById('records_car').src = SC.cars[SC.player.car].icon;
        }
        if (document.getElementById('leaderboard_car')) {
            document.getElementById('leaderboard_car').src = SC.cars[SC.player.car].icon;
        }
        self.hide();
        if (SC.player.wins <= 0) {
            SC.lip.message('Choose your opponent!');
        }
    };

    self.loadCar = function () {
        // Load car
        SC.modelsNeeded = {};
        SC.texturesNeeded = {};
        SC.keepOnlyNeededTextures();
        SC.keepOnlyNeededModels();
        self.model = SC.model(self.canvas, SC.cars[self.car].model, true, console.log, false);
        document.getElementById('car_dialog_name').textContent = self.car;
        var rc, a, o = JSON.parse(JSON.stringify(SC.cars[self.car]));
        delete o.icon;
        delete o.model;
        delete o.lights;
        delete o.shadow;
        document.getElementById('car_dialog_info').textContent = JSON.stringify(o).replace(/,/g, ', ').replace(/"/g, ''); // "
        document.getElementById('car_dialog_warning').textContent = SC.cars[self.car].warning || "";
        SC.lightAmbientColor = [0.5, 0.5, 0.5];
        SC.lightDirectionalColor = [0.5, 0.5, 0.5];
        SC.lightDirection = [0, -1, 0];
        self.model.light = SC.light.basic;
        // radar chart
        a = 360 / 10;
        rc = SC.radarChart(
            'radar_chart',
            SC.cars,
            self.car,
            {
                drag: {angle: 0, label: 'DR'},
                gasResponsivity: {angle: a, label: 'AC'},
                horsePower: {angle: 2 * a, label: 'HP'},
                grip: {angle: 3 * a, label: 'GR'},
                maxSpeed: {angle: 4 * a, label: 'SP'},
                mass: {angle: 5 * a, label: 'MA'},
                highSpeedSteeringCoefA: {angle: 6 * a, label: 'S1', invert: true},
                highSpeedSteeringCoefB: {angle: 7 * a, label: 'S2', invert: true},
                maxSteering: {angle: 8 * a, label: 'MS'},
                steeringResponsivity: {angle: 9 * a, label: 'SR'}
            }
        );
        rc.canvas.onclick = function () {
            SC.splash('Car parameters', ['OK'], 'white', 'DR = drag, AC = acceleration, HP = horse power, GR = grip, SP = max speed, MA = mass, S1, S2 = steering at high speed, MS = maximal steering, SR = steering responsivity');
        };
    };

    self.prevCar = function () {
        // Previous car
        var cars = Object.keys(SC.cars),
            i = cars.indexOf(self.car);
        i = i - 1;
        if (i < 0) {
            i = cars.length - 1;
        }
        self.car = cars[i];
        self.loadCar();
    };

    self.nextCar = function () {
        // Next car
        var cars = Object.keys(SC.cars),
            i = cars.indexOf(self.car);
        i = (i + 1) % cars.length;
        self.car = cars[i];
        self.loadCar();
    };

    self.render = function () {
        // Render car
        if (!self.enabled) {
            return;
        }
        angle += 0.01;
        self.canvas.sceneBegin();
        self.model.render(0, -0.153, 4.5, -0.5, angle, 0);
        window.requestAnimationFrame(self.render);
    };

    return self;
}());

