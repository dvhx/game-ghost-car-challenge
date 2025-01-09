// Finding current triangle on track, orienting car on road, reflection from sides
"use strict";
// globals: document, window, Vector, Plane, Line, pointInTriangle

var SC = window.SC || {};

SC.trackPosition = (function () {
    var self = {}, lastPlaneIndex = -1;

    self.plane = null;    // sylvester plane
    self.triangle = {index: -1, a: [0, 0, 0], b: [0, 0, 0], c: [0, 0, 0]};

    self.clearCache = function () {
        // Drop speed optiomizations
        lastPlaneIndex = -2;
        self.plane = null;
        self.frontLeftTriangle = null;
        self.frontRightTriangle = null;
    };

    self.orientCar = function () {
        // Orient car flat on track
        // u=n, f is random on plane so that angle with old f was smallest
        var pfru = SC.carPhysics,
            f = Vector.create(pfru.forward),
            n = Vector.create(self.plane.normal).multiply(-1),
            a,
            pt,
            cpos,
            cplane,
            planept,
            f2;
        // a is vector from up to normal plane scaled to 0.9
        a = n.subtract(Vector.create(pfru.up)).multiply(-0.9);
        // move n from plane in up direction
        n = n.add(a).toUnitVector();
        // create plane from camera and normal
        cpos = Vector.create(pfru.position);
        cplane = Plane.create(cpos, n);
        if (!cplane) {
            console.warn('no plane');
            return;
        }
        // point far in front
        pt = cpos.add(f.multiply(1000));
        // find closest point to pt but on plane
        planept = cplane.pointClosestTo(pt);
        // new f will be there
        f2 = planept.subtract(cpos).toUnitVector();
        // new camera
        SC.carPhysics.forward = Vector.create(f2);
        SC.carPhysics.right = n.cross(f2).toUnitVector();
        SC.carPhysics.up = SC.carPhysics.forward.cross(SC.carPhysics.right);
        return {
            f: SC.carPhysics.forward, //new_forward,
            r: SC.carPhysics.right //new_right
        };

    };

    self.reflection = function () {
        // Reflect car back to last valid triangle
        if (!SC.lastValidPFRU) {
            return;
        }
        var t = self.triangle,
            a = Vector.create(t.a),
            b = Vector.create(t.b),
            c = Vector.create(t.c),
            cam = SC.lastValidPFRU.position,
            camfwd = SC.lastValidPFRU.forward,
            camup = SC.lastValidPFRU.up,
            plane = SC.reflection.findPlane(cam, a, b, c, false, null, true),
            ref;
        if (!plane) {
            console.log('camNow', SC.carPhysics.position.elements);
            console.log('cam', cam.elements);
            console.log('a', a.elements);
            console.log('b', b.elements);
            console.log('c', c.elements);
            console.warn('Could not find reflection plane!');
            //throw "Could not find reflection plane!";
            SC.unstuck();
            return;
        }
        // find reflection
        ref = SC.reflection.findNewDirection(cam, camfwd, plane);
        // return camera to previous valid position
        SC.carPhysics.position = cam;
        SC.carPhysics.up = Vector.create(camup);
        SC.carPhysics.forward = ref.toUnitVector();
        SC.carPhysics.right = camup.cross(ref).toUnitVector();
        SC.carPhysics.halveSpeed(0.5, ref);
        SC.dir = 0;
        SC.carPhysics.steering = 0;
    };

    self.triangleVertices = function (aIndex) {
        // Get one triangle, used in reflections, don't use in next function for speed reasons
        var vertex = SC.road.model.vertices,
            index = SC.road.model.indices,
            a = index[aIndex],
            b = index[aIndex + 1],
            c = index[aIndex + 2],
            o = {
                a: Vector.create([vertex[a * 3], vertex[a * 3 + 1], vertex[a * 3 + 2]]),
                b: Vector.create([vertex[b * 3], vertex[b * 3 + 1], vertex[b * 3 + 2]]),
                c: Vector.create([vertex[c * 3], vertex[c * 3 + 1], vertex[c * 3 + 2]])
            };
        o.t = o.a.add(o.b).add(o.c).multiply(1 / 3);
        return o;
    };

    self.findTriangle = function (aCamX, aCamZ) {
        // Return index of triangle or -1 if point is not on any triangle of track
        if (!SC.road || !SC.road.model) {
            return null;
        }
        var i, a, b, c, ax, ay, az, bx, by, bz, cx, cy, cz,
            vertex = SC.road.model.vertices,
            index = SC.road.model.indices;
        // console.log(vertex, index);
        for (i = 0; i < index.length; i += 3) {
            a = index[i];
            b = index[i + 1];
            c = index[i + 2];
            //console.log('abc', a, b, c);
            ax = vertex[a * 3];
            ay = vertex[a * 3 + 1];
            az = vertex[a * 3 + 2];
            bx = vertex[b * 3];
            by = vertex[b * 3 + 1];
            bz = vertex[b * 3 + 2];
            cx = vertex[c * 3];
            cy = vertex[c * 3 + 1];
            cz = vertex[c * 3 + 2];
            //console.log(i, 'cam', camx, camz, 'a', ax, az, 'b', bx, bz, 'c', cx, cz);
            if (pointInTriangle(aCamX, aCamZ, ax, az, bx, bz, cx, cz)) {
                return {
                    index: i,
                    ai: a,
                    bi: b,
                    ci: c,
                    a: [ax, ay, az],
                    b: [bx, by, bz],
                    c: [cx, cy, cz]
                };
            }
        }
        return null;
    };

    self.reflectionSoundTime = 0;

    self.frontPointReflection = function (aPoint, aTriangle) {
        // find collision single point in front
        var inside = null, camfwd, plane;
        // are we still in the same triangle?
        if (aTriangle) {
            if (pointInTriangle(
                    aPoint.elements[0], //x
                    aPoint.elements[2], //z
                    aTriangle.a[0],
                    aTriangle.a[2],
                    aTriangle.b[0],
                    aTriangle.b[2],
                    aTriangle.c[0],
                    aTriangle.c[2]
                )) {
                // same triangle, no need for reflection
                return aTriangle;
            }
        }
        // we are outside previous triangle, try all triangles now
        inside = self.findTriangle(aPoint.elements[0], aPoint.elements[2]);
        if (inside) {
            // still on road, all good
            return inside;
        }
        if (!SC.lastValidPFRU) {
            return;
        }
        // outside the road, find plane
        camfwd = SC.lastValidPFRU.forward;
        plane = SC.reflection.findPlane(
            aPoint,
            Vector.create(aTriangle.a),
            Vector.create(aTriangle.b),
            Vector.create(aTriangle.c),
            false,
            null,
            true
        );
        if (!plane) {
            throw "frontPointReflection found no reflection plane";
        }
        // find reflection
        SC.reflection.findNewDirection(aPoint, camfwd, plane);
        // set fence force
        SC.carPhysics.fence = SC.carPhysics.fence.add(plane.normal.multiply(SC.carPhysics.fenceMultiplier));
        // sound and slowdown on initial impact
        if (SC.canvas.time - self.reflectionSoundTime > 3) {
            self.reflectionSoundTime = SC.canvas.time;
            SC.carSound.crash(SC.carPhysics.speed.modulus());
            SC.carPhysics.speed = SC.carPhysics.speed.multiply(SC.carPhysics.reflectionSpeedMultiplier);
        }
        // in certain levels first crash disables further reflections
        if (SC.reflectionDisablesGround) {
            self.disabled = true;
            return;
        }
        return aTriangle;
    };

    self.get = function () {
        // Get current road triangle and plane, camera is above it
        if (!SC.road || !SC.road.model) {
            return;
        }
        var pfru = SC.carPhysics,
            camx = pfru.position.elements[0],
            camz = pfru.position.elements[2],
            underCam,
            inside;
        // this is used in vulcan to keep falling in lava field via "reflectionDisablesGround"
        if (self.disabled) {
            pfru.forward = pfru.forward.add(Vector.create([0, -0.1, 0])).toUnitVector();
            pfru.up = pfru.up.add(Vector.create([0, 0, -0.1])).toUnitVector();
            pfru.right = pfru.up.cross(pfru.forward).toUnitVector();
            pfru.position.elements[1] -= 0.1;
            SC.roadY = pfru.position.elements[1];
            return SC.roadY;
        }

        // find front left and front right of the car
        self.frontBumper = pfru.position.add(pfru.forward.multiply(pfru.length / 2));
        self.frontLeft = self.frontBumper.add(pfru.right.multiply(-pfru.width / 2));
        self.frontRight = self.frontBumper.add(pfru.right.multiply(pfru.width / 2));
        //self.frontLeft2 = self.frontBumper.add(pfru.right.multiply(-pfru.width / 2)).add(pfru.up.multiply(pfru.camHeight));
        //self.frontRight2 = self.frontBumper.add(pfru.right.multiply(pfru.width / 2)).add(pfru.up.multiply(pfru.camHeight));

        self.frontLeftTriangle = self.frontPointReflection(self.frontLeft, self.frontLeftTriangle);
        self.frontRightTriangle = self.frontPointReflection(self.frontRight, self.frontRightTriangle);

        // are we still in the same triangle?
        inside = pointInTriangle(
            camx,
            camz,
            self.triangle.a[0],
            self.triangle.a[2],
            self.triangle.b[0],
            self.triangle.b[2],
            self.triangle.c[0],
            self.triangle.c[2]
        );
        if (!inside || !self.plane) {
            // try all triangles
            inside = self.findTriangle(camx, camz);
            if (inside) {
                if (lastPlaneIndex !== inside.index) {
                    self.plane = Plane.create(
                        Vector.create(inside.a),      // NEXT: cache [triangle_index] -> plane
                        Vector.create(inside.b),
                        Vector.create(inside.c)
                    );
                    lastPlaneIndex = inside.index;
                    self.triangle = inside;
                }
            }
        }
        // on triangle
        if (inside) {
            // find where camera down line intersects it
            self.line = Line.create([camx, 0, camz], [0, 1, 0]);
            underCam = self.plane.intersectionWith(self.line);
            SC.roadY = underCam.elements[1]; // + SC.camHeight;
            // orient car
            self.orientCar();
            // remember last valid pfru
            SC.lastValidPFRU = {
                position: pfru.position.dup(),
                forward: pfru.forward.dup(),
                right: pfru.right.dup(),
                up: pfru.up.dup()
            };
        } else {
            // out of track
            // fall through
            if (SC.reflectionDisablesGround) {
                self.disabled = true;
                return;
            }
            // reflect car back on track
            self.reflection();
            SC.carSound.crash(pfru.speed.modulus());
        }
    };

    return self;
}());

