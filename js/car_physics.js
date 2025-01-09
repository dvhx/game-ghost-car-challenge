// Car physics
"use strict";
// globals: document, window, Vector, Plane, Line

var SC = window.SC || {};

SC.carPhysics = (function () {
    var self = {};

    // Car inputs and outputs
    self.position = Vector.create([0, 0, 0]);
    self.forward = Vector.create([1, 0, 0]);
    self.up = Vector.create([0, 1, 0]);
    self.right = self.up.cross(self.forward);

    self.reset = function () {
        // Reset car variables
        self.gas = 0; // <0,1>
        self.speed = Vector.create([0, 0, 0]);
        self.steering = 0; // <-1, 1>
        self.effectiveSpeed = 0;
        self.squeeling = 0;
        self.brake = 0;
        self.stuck = 0;
        self.fence = Vector.create([0, 0, 0]);
        // User input
        self.gasPedal = 0;      // <0, 1>
        self.steeringWheel = 0; // <-1, 1>
        self.brakePedal = 0;    // <0, 1>
        // Environment
        self.normal = Vector.create([0, 1, 0]);
        self.plane = Plane.create(self.position, self.normal);
    };

    self.importCar = function (aCar) {
        // Car constants
        self.drag = aCar.drag;
        self.gasResponsivity = aCar.gasResponsivity;
        self.grip = aCar.grip;
        self.highSpeedSteeringCoefA = aCar.highSpeedSteeringCoefA;
        self.highSpeedSteeringCoefB = aCar.highSpeedSteeringCoefB;
        self.horsePower = aCar.horsePower;
        self.mass = aCar.mass;
        self.maxSpeed = aCar.maxSpeed;
        self.maxSteering = aCar.maxSteering;
        self.steeringResponsivity = aCar.steeringResponsivity;
        self.brakeResponsivity = 0.5; //aCar.brakeResponsivity;
        self.maxBrake = 0.01;
        self.constantBrake = 0.03;
        self.width = aCar.width;
        self.length = aCar.length;
        self.height = aCar.height;
        self.camHeight = aCar.camHeight;
        self.rebound = aCar.rebound;
        self.crashSlowdown = aCar.crashSlowdown;
        self.reflectionSpeedMultiplier = aCar.reflectionSpeedMultiplier;
        self.minSpeedSteering = aCar.minSpeedSteering;
        self.fenceMultiplier = aCar.fenceMultiplier;
    };

    function str(a) {
        return a.elements[0].toFixed(3) + ' ' + a.elements[1].toFixed(3) + ' ' + a.elements[2].toFixed(3) + ' |' + a.modulus().toFixed(3) + '|';
    }

    self.debug = function () {
        // Debug car physics
        return [
            'pos: ' + str(self.position),
            'forward: ' + str(self.forward),
            'right: ' + str(self.right),
            'u=fXr: ' + str(self.forward.cross(self.right).toUnitVector()),
            'gas: ' + self.gas.toFixed(3),
            'speed: ' + str(self.speed),
            'steering: ' + self.steering.toFixed(3),
            'gasPedal: ' + self.gasPedal.toFixed(3),
            'steeringWheel: ' + self.steeringWheel.toFixed(3)
        ].join('\n');
    };

    function ortho(u, v, s) {
        // Return u and v part of vector s
        var alpha = u.angleFrom(s),
            beta = v.angleFrom(s),
            sl = s.modulus();
        return {
            u: Math.cos(alpha) * sl,
            v: Math.cos(beta) * sl
        };
    }

    self.halveSpeed = function (aRatio, aDirection) {
        // e.g. after crash
        self.speed = Vector.create(aDirection).multiply(self.speed.modulus() * aRatio);
    };

    self.update = function (aDt) {
        // Update car physics
        var dtk = aDt / 0.01666,
            old_forward = self.forward.dup(),
            effective_steering,
            fgas,
            above,
            gravity,
            line,
            ps,
            sq,
            s,
            fs,
            o,
            fsforward,
            fsright,
            ffwd,
            a,
            slope_steering,
            low_speed_steering,
            sm,
            b;

        // apply fence force that returns car back on track
        self.position = self.position.add(self.fence.multiply(0.02 * aDt));
        self.fence = self.fence.multiply(0.9);
        self.forward = self.forward.add(self.fence.multiply(0.2 * aDt)).multiply(0.5).toUnitVector();
        self.right = self.up.cross(self.forward).toUnitVector();
        self.speed = self.speed.add(self.speed.toUnitVector().multiply(-self.crashSlowdown * aDt * self.fence.modulus()));

        // speed dependent breaking
        self.brake = self.brake * (1 - self.brakeResponsivity) + self.brakePedal * self.brakeResponsivity;
        self.speed = self.speed.multiply(1 - dtk * self.maxBrake * self.brake);
        // constant breaking
        if (self.brake > 0.5) {
            b = dtk * self.constantBrake;
            sm = self.speed.modulus();
            if (sm > b) {
                self.speed = self.speed.add(self.forward.multiply(-b));
            } else {
                self.speed = Vector.create([0, 0, 0]);
            }
        }

        // Steering (only rotates, no contribution to any force)
        self.steering = self.steering * (1 - self.steeringResponsivity) + self.steeringWheel * self.steeringResponsivity;
        sm = self.speed.modulus();
        if (sm > 1) {
            sm = 1;
        }
        effective_steering = dtk * self.steering * self.maxSteering / (self.highSpeedSteeringCoefA * sm + self.highSpeedSteeringCoefB);

        // don't steer at very low speed
        low_speed_steering = 0;
        sm = self.speed.modulus();
        if (sm > 1 && sm < self.minSpeedSteering) {
            low_speed_steering = (sm - 1) / 4;
        }
        if (sm >= self.minSpeedSteering) {
            low_speed_steering = 1;
        }
        effective_steering *= low_speed_steering;

        // tire squeeling
        self.squeeling = 20 * Math.abs(effective_steering);
        if (self.squeeling > 1) {
            self.squeeling = 1;
        }
        self.squeeling *= (self.speed.modulus() / self.maxSpeed);
        if (self.squeeling > 1) {
            self.squeeling = 1;
        }
        self.forward = self.forward.add(self.right.multiply(effective_steering)).toUnitVector();
        self.right = self.right.add(old_forward.multiply(-effective_steering)).toUnitVector();

        // Forward force by engine
        self.gas = self.gas * (1 - self.gasResponsivity) + self.gasPedal * self.gasResponsivity;
        fgas = self.horsePower * self.gas * (1 - self.squeeling);
        //console.log(gas, fgas, gasResponsivity, gasPedal);

        // Slope force
        above = self.position.add(SC.trackPosition.plane.normal.multiply(-1));
        gravity = Vector.create([0, 1, 0]);
        line = Line.create(above, gravity);
        ps = SC.trackPosition.plane.intersectionWith(line);
        s = ps.subtract(self.position);
        fs = s.multiply(self.mass); // limit to 10m/s?
        o = ortho(self.forward, self.right, fs);
        fsforward = o.u;
        fsright = o.v;
        // apply side slope to turning
        slope_steering = 0.000003 * fsright * dtk * low_speed_steering;
        //console.log(slope_steering);
        self.forward = self.forward.add(self.right.multiply(slope_steering)).toUnitVector();
        self.right = self.right.add(old_forward.multiply(-slope_steering)).toUnitVector();

        // apply forward forces to movement
        ffwd = self.forward.multiply(fgas + fsforward);
        a = ffwd.multiply(1 / self.mass);
        self.speed = self.speed.add(a.multiply(aDt));
        sm = self.speed.modulus();
        self.speed = self.speed.multiply(1 - self.drag * dtk * (sm / self.maxSpeed) * (sm / self.maxSpeed));
        sm = self.speed.modulus();
        if (sm > self.maxSpeed) {
            sm = self.maxSpeed;
        }
        self.speed = self.forward.multiply(sm);
        sq = (1 - 0.1 * self.squeeling);
        self.effectiveSpeed = self.speed.modulus() * sq;

        // detect stuck
        if (self.gasPedal > 0.8 && sm < 1) {
            self.stuck++;
            if (self.stuck >= 100) {
                self.stuck = 0;
                SC.unstuck();
            }
        } else {
            self.stuck = 0;
        }

        // set new position
        self.position = self.position.add(self.speed.multiply(aDt * sq));
        if (self.alwaysDebug) {
            console.log(self.debug());
        }
    };

    self.teleport = function (aNewPosition, aNewForward, aNewUp, aNewSpeed) {
        // Safely teleport car to new position, e.g. after end of non-loop track
        self.position = Vector.create(aNewPosition);
        if (aNewForward) {
            self.forward = Vector.create(aNewForward);
        }
        if (aNewUp) {
            self.up = Vector.create(aNewUp);
        }
        if (aNewSpeed) {
            self.speed = Vector.create(aNewSpeed);
        }
    };

    return self;
}());
