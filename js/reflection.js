// Reflection on side of a road triangle (after crash to side)
"use strict";
// globals: document, window, Line, setTimeout, Plane, Vector

var SC = window.SC || {};

SC.reflection = (function () {
    var self = {};

    self.findPlane = function (cam, a, b, c, aOverview, aCamNow, aAllowRecursion) {
        // Find which side is reflective by testing if there is another triangle just outside
        var fcam = cam.dup(),
            fa = a.dup(),
            fb = b.dup(),
            fc = c.dup(),
            sab,
            sbc,
            sca,
            oab,
            obc,
            oca,
            center,
            ab,
            bc,
            ca,
            p3,
            hab,
            hbc,
            hca,
            nab,
            nbc,
            nca;
        // flatten y
        fcam.elements[1] = 0;
        fa.elements[1] = 0;
        fb.elements[1] = 0;
        fc.elements[1] = 0;
        ab = Line.create(fa, fb.subtract(fa));
        bc = Line.create(fb, fc.subtract(fb));
        ca = Line.create(fc, fa.subtract(fc));
        // find center
        center = fa.add(fb).add(fc).multiply(1 / 3);
        // find side points
        sab = ab.pointClosestTo(center);
        sbc = bc.pointClosestTo(center);
        sca = ca.pointClosestTo(center);
        // find points just outside triangle
        oab = sab.add(sab.subtract(center).multiply(0.1));
        obc = sbc.add(sbc.subtract(center).multiply(0.1));
        oca = sca.add(sca.subtract(center).multiply(0.1));
        // find which are not on another tri
        hab = SC.trackPosition.findTriangle(oab.elements[0], oab.elements[2]);
        hbc = SC.trackPosition.findTriangle(obc.elements[0], obc.elements[2]);
        hca = SC.trackPosition.findTriangle(oca.elements[0], oca.elements[2]);
        // if all 3 neighbours are triangles, it means that car went from this triangle directly out, so use any of neighbouring triangles
        // doc/sketch/non_reflecting_triangle.png
        if (hab && hbc && hca && aAllowRecursion) {
            //console.warn('non-reflecting triangle', hab, hbc, hca);
            // find 3 neighbouring triangles
            nab = SC.trackPosition.triangleVertices(hab.index, true);
            nbc = SC.trackPosition.triangleVertices(hbc.index, true);
            nca = SC.trackPosition.triangleVertices(hca.index, true);
            //console.error('neighbours', nab, nbc, nca, fcam);
            // use whatever first reflection from neighbouring triangle i can find
            //console.log('n1', self.findPlane(Vector.create([nab.tx, nab.ty, nab.tz]), a, b, c, false, aCamNow, false));
            //console.log('n2', self.findPlane(Vector.create([nbc.tx, nbc.ty, nbc.tz]), a, b, c, false, aCamNow, false));
            // try all three neighbours
            p3 = self.findPlane(nab.t, nab.a, nab.b, nab.c, false, null, false);
            //console.log('nab', p3);
            if (p3) {
                return p3;
            }
            p3 = self.findPlane(nbc.t, nbc.a, nbc.b, nbc.c, false, null, false);
            //console.log('nbc', p3);
            if (p3) {
                return p3;
            }
            p3 = self.findPlane(nca.t, nca.a, nca.b, nca.c, false, null, false);
            //console.log('nca', p3);
            if (p3) {
                return p3;
            }
            console.error("Neighbours don't have reflection either!");
            return null;
        }

        // overview
        /*
        if (aOverview) {
            SC.overview.clear();
            SC.overview.renderAxis();
            SC.overview.vectors.push({v: Vector.create([nab.ax, nab.ay, nab.az]), label: 'nab.a', color: 'lime' });
            SC.overview.vectors.push({v: Vector.create([nab.bx, nab.by, nab.bz]), label: 'nab.b', color: 'lime' });
            SC.overview.vectors.push({v: Vector.create([nab.cx, nab.cy, nab.cz]), label: 'nab.c', color: 'lime' });
            SC.overview.vectors.push({v: Vector.create([nbc.ax, nbc.ay, nbc.az]), label: 'nbc.a', color: 'lime' });
            SC.overview.vectors.push({v: Vector.create([nbc.bx, nbc.by, nbc.bz]), label: 'nbc.b', color: 'lime' });
            SC.overview.vectors.push({v: Vector.create([nbc.cx, nbc.cy, nbc.cz]), label: 'nbc.c', color: 'lime' });
            if (nca) {
                SC.overview.vectors.push({v: Vector.create([nca.ax, nca.ay, nca.az]), label: 'nca.a', color: 'lime' });
                SC.overview.vectors.push({v: Vector.create([nca.bx, nca.by, nca.bz]), label: 'nca.b', color: 'lime' });
                SC.overview.vectors.push({v: Vector.create([nca.cx, nca.cy, nca.cz]), label: 'nca.c', color: 'lime' });
            }

            SC.overview.vectors.push({v: fcam, label: 'cam', color: 'cyan' });
            SC.overview.vectors.push({v: aCamNow, label: 'camNow', color: 'red' });
            SC.overview.vectors.push({v: fa, label: 'a', color: 'aqua' });
            SC.overview.vectors.push({v: fb, label: 'b', color: 'blue' });
            SC.overview.vectors.push({v: fc, label: 'c', color: 'fuchsia' });
            SC.overview.vectors.push({v: center, label: 'T', color: 'red' });
            SC.overview.vectors.push({v: sab, label: '1', color: hab >= 0 ? 'green' : 'red' });
            SC.overview.vectors.push({v: sbc, label: '2', color: hbc >= 0 ? 'green' : 'red' });
            SC.overview.vectors.push({v: sca, label: '3', color: hca >= 0 ? 'green' : 'red' });
            SC.overview.vectors.push({v: oab, label: 'oab', color: 'red' });
            SC.overview.vectors.push({v: obc, label: 'obc', color: 'red' });
            SC.overview.vectors.push({v: oca, label: 'oca', color: 'red' });
            SC.overview.renderVectors();
            SC.overview.renderTriangle(a, b, c);
        }
        */
        // create reflection plane
        if (!hab) {
            //SC.overview.renderPlane(Plane.create(sab, center.subtract(sab)));
            return Plane.create(sab, center.subtract(sab));
        }
        if (!hbc) {
            //SC.overview.renderPlane(Plane.create(sbc, center.subtract(sbc)));
            return Plane.create(sbc, center.subtract(sbc));
        }
        if (!hca) {
            //SC.overview.renderPlane(Plane.create(sca, center.subtract(sca)));
            return Plane.create(sca, center.subtract(sca));
        }
        return null;
    };

    self.findNewDirection = function (aCam, aForward, aPlane) {
        // Bounce camera from plane
        var fcam = aCam.dup(),
            fwd,
            ref,
            ref2;
        // flatten
        fcam.elements[1] = 0;
        // line from camera
        fwd = Line.create(aCam, aForward);
        //SC.overview.renderLine(fwd, 'fwd');
        // find reflection
        ref = fwd.reflectionIn(aPlane);
        // move it bit further along the forward, not perfactly same as incomming
        ref2 = ref.direction.toUnitVector().add(aForward.toUnitVector()).multiply(0.5).toUnitVector();
        //SC.overview.renderLine(ref, 'ref');
        return ref2;
    };

    return self;
}());

/*
setTimeout(function () {
    var camnow, cam, a, b, c, p;
    camnow = [-40.086182131097715, -5.3254096415180925, 4.839611288313587];
    cam = [-39.957351463043004, -5.323153853722992, 4.950851758560287];
    a = [-37.231579, -5.986315, 6.406622];
    b = [-39.572662, -6.353902, 6.914089];
    c = [-40.006428, -6.157189, 4.91464];
    p = SC.reflection.findPlane(
        Vector.create(cam),
        Vector.create(a),
        Vector.create(b),
        Vector.create(c),
        true,
        Vector.create(camnow),
        true
    );
    console.log('p', p);
    if (!p) {
        SC.pause = true;
        throw "p is null";
    }
}, 1000);
*/
