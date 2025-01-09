// Loading and managing OBJ models and their textures
"use strict";
// globals: document, window, OBJ, modelDrawObj, mat4, mat3

var SC = window.SC || {};

SC.models = {};
SC.modelsNeeded = {};

SC.keepOnlyNeededModels = function () {
    // Delete models not in SC.modelsNeeded{}
    var t, gl;
    for (t in SC.models) {
        if (SC.models.hasOwnProperty(t)) {
            // not needed?
            if (!SC.modelsNeeded.hasOwnProperty(t)) {
                //console.warn('deleting model', t);
                // delete webgl buffer
                gl = SC.models[t].wc.gl;
                gl.deleteBuffer(SC.models[t].normalBuffer);
                gl.deleteBuffer(SC.models[t].textureBuffer);
                gl.deleteBuffer(SC.models[t].vertexBuffer);
                gl.deleteBuffer(SC.models[t].indexBuffer);
                // remove from cache
                delete SC.models[t];
            }
        }
    }
};

SC.model = function (aWC, aModel, aClampToEdge, aCallback, aSkipMaterials) {
    // Load and cache model
    //console.log('SC.model', aModel, aClampToEdge, aCallback, aSkipMaterials);
    if (!aWC.gl || !aWC.gl.ARRAY_BUFFER) {
        throw "You cannot call model " + aModel + " without gl!";
    }

    // mark model as needed in this level
    SC.modelsNeeded[aModel] = true;

    //console.warn(aModel);
    if (SC.models.hasOwnProperty(aModel)) {
        // mark texture as needed
        //console.log('model texture', SC.models[aModel].texture);
        if (!SC.textures[SC.models[aModel].textureFileName]) {
            //console.error('must read again', aModel, SC.models[aModel].textureFileName);
            if (SC.models[aModel].textureFileName) {
                SC.models[aModel].texture = SC.texture(aWC, SC.models[aModel].textureFileName, aClampToEdge);
            }
        }
        SC.texturesNeeded[SC.models[aModel].textureFileName] = true;
        if (SC.wait) {
            SC.wait.done(aModel);
        }
        return SC.models[aModel];
    }
    //console.log('model', aModel);
    var self = {}, o = {}, m = mat4.create(), normalMatrix = mat3.create(); // typed arrays cause GC lag, this is not hot loop
    self.name = aModel;
    self.model = null;
    self.loaded = true;
    self.light = SC.light.basic;
    self.shaderProgram = aWC.shaderProgram;
    self.fog = true;
    self.alpha = 1;
    self.wc = aWC;

    // find model path
    self.path = aModel.split('/');
    self.path.splice(-1);
    self.path = self.path.join('/') + '/';

    function modelDrawObj(gl, aX, aY, aZ, aRotX, aRotY, aRotZ, aVertexBuffer, aTextureBuffer, aIndexBuffer, aTexture, aNormalBuffer) {
        // Render obj
        var i;

        // lights
        if (self.light) {
            self.light(gl, self.shaderProgram);
        }

        mat4.identity(m);
        mat4.translate(m, [aX, aY, aZ]);
        mat4.rotateX(m, aRotX);
        mat4.rotateY(m, aRotY);
        mat4.rotateZ(m, aRotZ);

        if (SC.modelMatrix) {
            for (i = 0; i < 15; i++) {
                m[i] = SC.modelMatrix[i];
            }
            SC.modelMatrix = null;
        }

        // vertices
        gl.bindBuffer(gl.ARRAY_BUFFER, aVertexBuffer);
        gl.vertexAttribPointer(self.shaderProgram.aVertexPosition, aVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // normals
        gl.bindBuffer(gl.ARRAY_BUFFER, aNormalBuffer);
        gl.vertexAttribPointer(self.shaderProgram.aVertexNormal, aNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // texture coordinates
        gl.bindBuffer(gl.ARRAY_BUFFER, aTextureBuffer);
        gl.vertexAttribPointer(self.shaderProgram.aTextureCoord, aTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // texture
        gl.activeTexture(gl.TEXTURE0);
        if (SC.originalTexture) {
            gl.bindTexture(gl.TEXTURE_2D, SC.originalTexture);
        } else {
            gl.bindTexture(gl.TEXTURE_2D, aTexture);
        }
        gl.uniform1i(self.shaderProgram.uSampler, 0);
        gl.uniform4fv(self.shaderProgram.uFogColor, aWC.fogColor || [0.3, 0.3, 0.3, 1.0]);
        //gl.uniform4fv(aShaderProgram.uFogColor, [0.3, 0.3, 0.3, 1.0]);
        gl.uniform1f(self.shaderProgram.uUseFog, self.fog);
        if (self.alpha < 1) {
            gl.uniform1f(self.shaderProgram.uUseAlpha, true);
            gl.uniform1f(self.shaderProgram.uAlpha, self.alpha);
        } else {
            gl.uniform1f(self.shaderProgram.uUseAlpha, false);
        }

        // faces
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, aIndexBuffer);
        gl.uniformMatrix4fv(self.shaderProgram.uMVMatrix, false, m);

        mat3.identity(normalMatrix);
        mat4.toInverseMat3(m, normalMatrix);
        mat3.transpose(normalMatrix);
        gl.uniformMatrix3fv(self.shaderProgram.uNMatrix, false, normalMatrix);

        gl.drawElements(gl.TRIANGLES, aIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }

    self.pending = 2; // model and texture

    /*
    function oneDone() {
        // capture when both model and texture are loaded
        self.pending--;
        if (self.pending <= 0) {
            if (aCallback) {
                aCallback(aModel, SC.models[aModel].materials, SC.models[aModel]);
            }
        }
    }
    */

    // load obj
    o[aModel] = aModel;
    OBJ.downloadMeshes(o, function (aModels) {
        // create vertex buffer objects
        //console.warn('dm', self.textureFileName, self.texture);
        self.textureFileName = '';
        //console.log(aModels);
        var mo, t;
        for (mo in aModels) {
            if (aModels.hasOwnProperty(mo)) {
                OBJ.initMeshBuffers(aWC.gl, aModels[mo]);
                //SC.models[mo] = aModels[mo];
                self.model = aModels[mo];
                // load texture
                if (!aSkipMaterials) {
                    //console.log('reading', mo);
                    if (Object.keys(aModels[mo].materials).length !== 1) {
                        console.warn('skipped 2nd material in ' + mo);
                        //continue;
                        //throw "Model " + aModel + " must contain exactly 1 material but has " + Object.keys(aModels[mo].materials).join(', ');
                    }
                    for (t in aModels[mo].materials) {
                        if (aModels[mo].materials.hasOwnProperty(t)) {
                            if (t.indexOf('/') >= 0) {
                                console.warn("Model " + aModel + " contains texture outside it's directory " + t);
                            }
                            self.textureFileName = self.path + t; //SC.texture(self.path + t, aClampToEdge, oneDone);
                        }
                    }
                }
                // load texture
                if (self.textureFileName) {
                    //console.warn(aModel, 'will read', self.textureFileName, mo);
                    self.texture = SC.texture(aWC, self.textureFileName, aClampToEdge);
                }
                self.loaded = true;
                //console.log('loaded model', mo);
                if (SC.wait) {
                    SC.wait.done(mo);
                }
            }
        }
    });

    self.render = function (aPosX, aPosY, aPosZ, aRotX, aRotY, aRotZ) {
        // Render model
        if (aWC.enabled && self.loaded && self.model && self.texture && self.texture.loaded) {
            modelDrawObj(aWC.gl, aPosX, aPosY, aPosZ, aRotX, aRotY, aRotZ, self.model.vertexBuffer, self.model.textureBuffer, self.model.indexBuffer, self.texture, self.model.normalBuffer);
        }
    };

    SC.models[aModel] = self;
    return self;
};

