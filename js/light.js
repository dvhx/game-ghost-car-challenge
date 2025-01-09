// Default lights
"use strict";
// globals: window, vec3

var SC = window.SC || {};

SC.light = {};
SC.lightAmbientColor = [1, 1, 1];
SC.lightDirection = [0, 1, 0];
SC.lightDirectionalColor = [0, 0, 0];
SC.lightSkybox = [1, 1, 1];
SC.lightOpposite = vec3.create();

SC.light.none = function () {
    // No lights
    return;
};

SC.light.basic = function (gl, aShaderProgram) {
    // Basic lights for all scenes
    gl.uniform1i(aShaderProgram.uUseLighting, true);
    // ambient color
    gl.uniform3f(
        aShaderProgram.uAmbientColor,
        SC.lightAmbientColor[0],
        SC.lightAmbientColor[1],
        SC.lightAmbientColor[2]
    );
    // directional lighting
    //opposite = vec3.create();
    vec3.normalize(SC.lightDirection, SC.lightOpposite);
    vec3.scale(SC.lightOpposite, -1);
    gl.uniform3fv(aShaderProgram.uLightingDirection, SC.lightOpposite);
    gl.uniform3f(
        aShaderProgram.uDirectionalColor,
        SC.lightDirectionalColor[0],
        SC.lightDirectionalColor[1],
        SC.lightDirectionalColor[2]
    );
};

SC.light.skybox = function (gl, aShaderProgram) {
    // Lights for skybox
    gl.uniform1i(aShaderProgram.uUseLighting, true);
    // ambient color
    gl.uniform3f(
        aShaderProgram.uAmbientColor,
        SC.lightSkybox[0],
        SC.lightSkybox[1],
        SC.lightSkybox[2]
    );
    // no directional lighting
    gl.uniform3fv(aShaderProgram.uLightingDirection, [0, 0, 0]);
    gl.uniform3f(
        aShaderProgram.uDirectionalColor,
        0,
        0,
        0
    );
};

/*
window.addEventListener('DOMContentLoaded', function () {
    document.getElementById('ambient_red').addEventListener('input', function (event) {
        SC.lightAmbientColor[0] = parseFloat(event.target.value);
    });
    document.getElementById('ambient_green').addEventListener('input', function (event) {
        SC.lightAmbientColor[1] = parseFloat(event.target.value);
    });
    document.getElementById('ambient_blue').addEventListener('input', function (event) {
        SC.lightAmbientColor[2] = parseFloat(event.target.value);
    });
});
*/
