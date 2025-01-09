// Skybox
"use strict";
// globals: window

var SC = window.SC || {};

SC.skybox = function (aCanvas, aName) {
    var self = {}, p = 'skybox/' + aName + '/' + aName + '_';
    self.y = 0;

    self.back = SC.model(aCanvas, 'skybox/back.obj', true, null, true);
    self.back.textureFileName = p + 'bk.jpg';
    self.back.texture = SC.texture(aCanvas, p + 'bk.jpg', true);
    self.back.fog = false;
    self.back.light = SC.light.skybox;
    self.left = SC.model(aCanvas, 'skybox/left.obj', true, null, true);
    self.left.textureFileName = p + 'lf.jpg';
    self.left.texture = SC.texture(aCanvas, p + 'lf.jpg', true);
    self.left.fog = false;
    self.left.light = SC.light.skybox;
    self.front = SC.model(aCanvas, 'skybox/front.obj', true, null, true);
    self.front.textureFileName = p + 'ft.jpg';
    self.front.texture = SC.texture(aCanvas, p + 'ft.jpg', true);
    self.front.fog = false;
    self.front.light = SC.light.skybox;
    self.right = SC.model(aCanvas, 'skybox/right.obj', true, null, true);
    self.right.textureFileName = p + 'rt.jpg';
    self.right.texture = SC.texture(aCanvas, p + 'rt.jpg', true);
    self.right.fog = false;
    self.right.light = SC.light.skybox;
    self.up = SC.model(aCanvas, 'skybox/up.obj', true, null, true);
    self.up.textureFileName = p + 'up.jpg';
    self.up.texture = SC.texture(aCanvas, p + 'up.jpg', true);
    self.up.fog = false;
    self.up.light = SC.light.skybox;
    self.down = SC.model(aCanvas, 'skybox/down.obj', true, null, true);
    self.down.textureFileName = p + 'dn.jpg';
    self.down.texture = SC.texture(aCanvas, p + 'dn.jpg', true);
    self.down.fog = false;
    self.down.light = SC.light.skybox;

    self.render = function (aCamX, aCamY, aCamZ) {
        if (!self.back.loaded || !self.back.texture.loaded) {
            return;
        }
        var x = aCamX, y = aCamY + self.y, z = aCamZ;
        SC.originalTexture = self.back.texture;
        self.back.render(x, y, z, 0, 0, 0);
        SC.originalTexture = self.left.texture;
        self.left.render(x, y, z, 0, 0, 0);
        SC.originalTexture = self.front.texture;
        self.front.render(x, y, z, 0, 0, 0);
        SC.originalTexture = self.right.texture;
        self.right.render(x, y, z, 0, 0, 0);
        SC.originalTexture = self.up.texture;
        self.up.render(x, y, z, 0, 0, 0);
        SC.originalTexture = self.down.texture;
        self.down.render(x, y, z, 0, 0, 0);
        SC.originalTexture = null;
    };

    return self;
};
