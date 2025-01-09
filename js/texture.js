// Texture loading and caching
"use strict";
// globals: document, window, Image

var SC = window.SC || {};

SC.textures = {};
SC.texturesNeeded = {};

// Aliases for certain textures
SC.texturePath = {
    "shadow.png": "model/apex/shadow.png",
    "lights.png": "model/apex/lights.png",
    "column.jpg": "textures/column.jpg",
    "stonewall.jpg": "textures/stonewall.jpg",
    "desert_building.jpg": "textures/desert_building.jpg",
    "road.jpg": "textures/road.jpg",
    "road_sand.jpg": "textures/road_sand.jpg",
    "road_night.jpg": "textures/road_night.jpg",
    "palm.jpg": "textures/palm.jpg",
    "sand.jpg": "textures/sand.jpg",
    "salt_flats.png": "textures/salt_flats.png",
    "flags.jpg": "textures/flags.jpg",
    "wood.jpg": "textures/wood.jpg",
    "grass.jpg": "textures/grass.jpg",
    "tarmac.jpg": "textures/tarmac.jpg",
    "go_kart.jpg": "textures/go_kart.jpg",
    "rails.jpg": "textures/rails.jpg",
    "skyscrapers.jpg": "textures/skyscrapers.jpg",
    "concrete_walls.jpg": "textures/concrete_walls.jpg",
    "decorations.jpg": "textures/decorations.jpg"
};

SC.keepOnlyNeededTextures = function () {
    // Delete textures not in SC.texturesNeeded{}, this significantly improves performance on my $39 phone
    var t;
    for (t in SC.textures) {
        if (SC.textures.hasOwnProperty(t)) {
            // not needed?
            if (!SC.texturesNeeded.hasOwnProperty(t)) {
                //console.warn('deleting texture', t);
                // mark it as not loaded (if other model still has it's reference)
                SC.textures[t].loaded = false;
                // delete webgl texture
                SC.textures[t].wc.gl.deleteTexture(SC.textures[t]);
                // remove from cache
                delete SC.textures[t];
            }
        }
    }
};

SC.texture = function (aWC, aFileName, aClampToEdge, aCallback) {
    // Load texture and cache it
    if (!aWC.gl) {
        throw "SC.texture(WC, " + aFileName + ",...) has no gl";
    }
    //console.log('SC.texture', aFileName, aClampToEdge, typeof aCallback);
    var self, fn = SC.fileName(aFileName), image,
        real_path = SC.texturePath.hasOwnProperty(fn) ? SC.texturePath[fn] : aFileName,
        gl = aWC.gl;

    // mark texture as needed in this level
    SC.texturesNeeded[fn] = true;

    // Load texture or use cached one
    if (SC.textures.hasOwnProperty(fn)) {
        if (SC.wait) {
            SC.wait.done(real_path);
        }
        if (aCallback) {
            aCallback(SC.textures[fn]);
        }
        return SC.textures[fn];
    }

    // create new texture
    self = gl.createTexture();
    self.wc = aWC;
    image = new Image();
    image.onload = function () {
        if (aWC.freeing) {
            console.log('Texture loaded while WC was freed, ignoring');
            return;
        }
        gl.bindTexture(gl.TEXTURE_2D, self);
        var ext = gl.getExtension('EXT_texture_filter_anisotropic'),
            max;
        if (ext) {
            max = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
            gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
        }
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        if (aClampToEdge) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        // mark as loaded
        self.loaded = true;
        if (SC.wait) {
            SC.wait.done(real_path);
        }
        //SC.wait.done(fn);
        if (aCallback) {
            aCallback(self);
        }
    };

    // magic path
    image.src = real_path;

    // add to cache
    SC.textures[fn] = self;

    return self;
};


