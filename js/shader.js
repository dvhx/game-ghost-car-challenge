// Shader program boilerplate
"use strict";
// globals: gl, window

var SC = window.SC || {};

SC.createShaderProgram = function (gl, aFragmentCode, aVertexCode, aVariables) {
    // Create shader program with 2 shaders and some input variables
    var self = {},
        tmp = gl.createProgram(),
        shader,
        i;

    function findAttribute(aVariableName) {
        // find address of attribute
        var a = gl.getAttribLocation(tmp, aVariableName);
        gl.enableVertexAttribArray(a);
        return a;
    }

    function findUniform(aVariableName) {
        // find address of uniform
        return gl.getUniformLocation(tmp, aVariableName);
    }

    // fragment shader
    shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(shader, Array.isArray(aFragmentCode) ? aFragmentCode.join('\n') : aFragmentCode);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw gl.getShaderInfoLog(shader);
    }
    gl.attachShader(tmp, shader);

    // vertex shader
    shader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(shader, Array.isArray(aVertexCode) ? aVertexCode.join('\n') : aVertexCode);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw gl.getShaderInfoLog(shader);
    }
    gl.attachShader(tmp, shader);

    // link it
    gl.linkProgram(tmp);
    if (!gl.getProgramParameter(tmp, gl.LINK_STATUS)) {
        throw "Shader program linking failed!";
    }
    gl.useProgram(tmp);

    // find variables
    for (i = 0; i < aVariables.length; i++) {
        switch (aVariables[i].substr(0, 1)) {
        case 'u':
            // uniform
            self[aVariables[i]] = findUniform(aVariables[i]);
            break;
        case 'a':
            // attribute
            self[aVariables[i]] = findAttribute(aVariables[i]);
            break;
        }
    }

    self.program = tmp;
    return self;
};
