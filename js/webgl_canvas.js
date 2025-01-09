// Webgl canvas
"use strict";
// globals: document, window, mat4, Vector, Float32Array

var SC = window.SC || {};

SC.webglCanvas = function (aElementOrId, aOptions) {
    var self = {}, fragment_shader, vertex_shader,
        canvas = typeof aElementOrId === 'string' ? document.getElementById(aElementOrId) : aElementOrId,
        M = new Float32Array(16), // typed arrays cause GC lag
        gl = canvas.getContext('webgl', aOptions);
    self.then = Date.now();
    self.now = Date.now();
    self.dt = 0;
    self.gl = gl;
    if (!gl) {
        console.warn('trying webgl2');
        gl = canvas.getContext('webgl2', aOptions);
        if (!gl) {
            console.warn('trying experimental-webgl');
            gl = canvas.getContext('experimental-webgl', aOptions);
        }
        if (!gl) {
            console.warn('trying webkit-3d');
            gl = canvas.getContext('webkit-3d', aOptions);
        }
        self.gl = gl;
        if (!gl) {
            alert('Your device does not support webgl nor webgl2, it will not work, sorry :(');
            throw "Cannot initialize webgl nor webgl2 context for " + aElementOrId;
        }
    }
    self.textureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

    self.clear = function () {
        // Clear canvas
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    };

    fragment_shader = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec3 vLightWeighting;',
        'uniform vec4 uFogColor;',
        'uniform float uFogA;',  // 0.995
        'uniform float uFogB;',  // 0.99999
        'uniform float uFogC;',  // 0.9
        'uniform sampler2D uSampler;',
        'uniform bool uUseFog;',
        'uniform bool uUseAlpha;',
        'uniform float uAlpha;',
        'void main(void) {',
        '    vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));',
        '    gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a);',
        '    if (uUseFog) {',
        '       float fogAmount = smoothstep(uFogA, uFogB, gl_FragCoord.z);',
        '       gl_FragColor = mix(gl_FragColor, uFogColor, uFogC * fogAmount);',
        '    }',
        '    if (uUseAlpha) {',
        '        gl_FragColor.a = uAlpha;',
        '    }',
        '}'];

    vertex_shader = [
        'attribute vec3 aVertexPosition;',
        'attribute vec3 aVertexNormal;',
        'attribute vec2 aTextureCoord;',
        'uniform mat4 uMVMatrix;',
        'uniform mat4 uPMatrix;',
        'uniform mat3 uNMatrix;',
        'uniform vec3 uAmbientColor;',
        'uniform vec3 uLightingDirection;',
        'uniform vec3 uDirectionalColor;',
        'uniform bool uUseLighting;',
        'varying vec2 vTextureCoord;',
        'varying vec3 vLightWeighting;',
        'varying vec3 v_normal;',
        'void main(void) {',
        '    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);',
        '    vTextureCoord = aTextureCoord;',
        '    if (!uUseLighting) {',
        '        vLightWeighting = vec3(1.0, 1.0, 1.0);',
        '    } else {',
        '        vec3 transformedNormal = uNMatrix * aVertexNormal;',
        '        float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);',
        '        vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;',
        '    }',
        '}'];

    self.shaderProgram = SC.createShaderProgram(gl, fragment_shader, vertex_shader,
        ['vTextureCoord', 'uSampler', 'aVertexPosition', 'aTextureCoord',
            'uMVMatrix', 'uPMatrix', 'vTextureCoord', 'aVertexNormal', 'uNMatrix',
            'uUseLighting', 'uAmbientColor', 'uLightingDirection', 'uDirectionalColor',
            'uFogColor', 'uUseFog', 'uFogA', 'uFogB', 'uFogC', 'uUseAlpha', 'uAlpha']);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    self.transform = mat4.create(); // typed arrays cause GC lag, this is not hot loop
    self.projection = mat4.perspective(60, 1, 0.7, 2100);

    self.lags = [];
    self.minFPS = 5; //30;
    self.limitedFrames = 0;
    self.time = 0;
    self.frame = 0;

    self.cameraPosition = Vector.create([0, 0, 0]);
    self.cameraForward = Vector.create([0, 0, 1]);
    self.cameraUp = Vector.create([0, 1, 0]);

    self.camera = function (aPosition, aUp, aForward) {
        // Orient camera
        var right = aUp.cross(aForward),
            x = -right.dot(aPosition),
            y = -aUp.dot(aPosition),
            z = aForward.dot(aPosition); // no minus because there should be back, not forward
        M[0] = right.elements[0];
        M[4] = right.elements[1];
        M[8] = right.elements[2];
        M[12] = x;
        M[1] = aUp.elements[0];
        M[5] = aUp.elements[1];
        M[9] = aUp.elements[2];
        M[13] = y;
        M[2] = -aForward.elements[0]; // minus because it is forward, not back
        M[6] = -aForward.elements[1];
        M[10] = -aForward.elements[2];
        M[14] = z;
        M[3] = 0;
        M[7] = 0;
        M[11] = 0;
        M[15] = 1;
        return M;
    };

    self.sceneBegin = function () {
        // Initialize rendering of a frame
        self.cameraMatrix = self.camera(self.cameraPosition, self.cameraUp, self.cameraForward);
        // program
        gl.useProgram(self.shaderProgram.program);
        // measure time
        self.now = Date.now();
        self.dt = (self.now - self.then) / 1000;
        if ((self.dt > 1 / self.minFPS) || (self.dt < 0)) {
            self.lags.push(self.dt);
            self.dt = 1 / self.minFPS;
            self.limitedFrames++;
        }
        self.time += self.dt;
        self.frame++;
        self.then = self.now;
        // clear canvas
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.CULL_FACE);
        // fog
        gl.uniform1f(self.shaderProgram.uFogA, self.fogA || 0.995);
        gl.uniform1f(self.shaderProgram.uFogB, self.fogB || 0.99999);
        gl.uniform1f(self.shaderProgram.uFogC, self.fogC || 0.9);
        // transformation
        mat4.multiply(
            self.projection,
            self.cameraMatrix,
            self.transform
        );
        gl.uniformMatrix4fv(self.shaderProgram.uPMatrix, false, self.transform);
    };

    self.sceneEnd = function () {
        // End rendering of a frame
        SC.lapCounter.lapFrame++;
    };

    // handle window resize
    function onResizeCallback() {
        if (canvas) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            gl.viewportWidth = canvas.clientWidth;
            gl.viewportHeight = canvas.clientHeight;
            gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
            self.projection = mat4.perspective(60, canvas.clientWidth / canvas.clientHeight, 0.7, 2100);
        }
    }
    window.addEventListener('resize', onResizeCallback);
    onResizeCallback();
    self.enabled = true;

    self.free = function () {
        // Release webgl context
        self.freeing = true;
        self.enabled = false;
        var k, lc;
        // delete models in this wc
        for (k in SC.modelsNeeded) {
            if (SC.modelsNeeded.hasOwnProperty(k)) {
                if (SC.models[k] && (SC.models[k].wc === self)) {
                    delete SC.modelsNeeded[k];
                }
            }
        }
        // delete textures in this wc
        for (k in SC.texturesNeeded) {
            if (SC.texturesNeeded.hasOwnProperty(k)) {
                if (SC.textures[k] && (SC.textures[k].wc === self)) {
                    delete SC.texturesNeeded[k];
                }
            }
        }
        // actually delete VBO and textures
        SC.keepOnlyNeededTextures();
        SC.keepOnlyNeededModels();
        // loose context
        lc = SC.carDialog.canvas.gl.getExtension('WEBGL_lose_context');
        if (lc) {
            lc.loseContext();
        }
        // remove from dom
        canvas.parentElement.removeChild(canvas);
        canvas = null;
        self.freed = true;
    };

    return self;
};
