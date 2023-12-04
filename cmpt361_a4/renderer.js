import { Mat4 } from "./math.js";

class Renderer {
  constructor(opts) {
    // initialize context and shader program
    this.canvas = opts.canvas;
    this.gl = this.canvas.getContext('webgl');

    // check for gl context
    if (!this.gl) {
      alert('Unable to initialize WebGL. Your browser or machine may not support it.');
      return;
    }
  }

  async shaderSetUp(gl, scene) {
    this.gl.clearColor(0.9, 0.9, 0.9, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    let vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, this.VERTEX_SHADER);
    gl.compileShader(vertShader);
    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
      console.error('Error compiling shader: ' + gl.getShaderInfoLog(vertShader));
    }

    let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, this.FRAGMENT_SHADER);
    gl.compileShader(fragShader);
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      console.error('Error compiling shader: ' + gl.getShaderInfoLog(fragShader));
    }

    let program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Error linking shader program: ' + gl.getProgramInfoLog(program));
    }
    gl.useProgram(program);

    this.shader = {
      program: program,
      attribLocations: {
        position: gl.getAttribLocation(program, "position"),
        normal: gl.getAttribLocation(program, "normal"),
        uvCoord: gl.getAttribLocation(program, "uvCoord"),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(program, "projectionMatrix"),
        viewMatrix: gl.getUniformLocation(program, "viewMatrix"),
        modelMatrix: gl.getUniformLocation(program, "modelMatrix"),
        normalMatrix: gl.getUniformLocation(program, "normalMatrix"),
        ka: gl.getUniformLocation(program, "ka"),
        kd: gl.getUniformLocation(program, "kd"),
        ks: gl.getUniformLocation(program, "ks"),
        shininess: gl.getUniformLocation(program, "shininess"),
        lightPosition: gl.getUniformLocation(program, "lightPosition"),
        lightIntensity: gl.getUniformLocation(program, "lightIntensity"),
        texture: gl.getUniformLocation(program, 'uTexture'),
        hasTexture: gl.getUniformLocation(program, 'hasTexture'),
      }
    }

    // projection matrix
    let projectionMatrix = Mat4.create();
    const fovy = Math.PI / 4;
    const aspect = this.canvas.width / this.canvas.height;
    const near = 0.1;
    const far = 100.0;
    Mat4.perspective(projectionMatrix, fovy, aspect, near, far);
    gl.uniformMatrix4fv(this.shader.uniformLocations.projectionMatrix, false, projectionMatrix);

    // light position and intensity
    for (const [lightId, light] of Object.entries(scene.lights)) {
      gl.uniform3fv(this.shader.uniformLocations.lightPosition, light.position);
      gl.uniform3fv(this.shader.uniformLocations.lightIntensity, light.intensity);
      break;  // For now, we only use the first light!
    }

    // load textures
    for (const [materialId, material] of Object.entries(scene.materials)) {
      if (material.textureMap && !material.texture) {
        await this.loadTexture(this.gl, material);
      }
    }
  }

  async loadTexture(gl, material) {
    const texture = gl.createTexture();
    const image = new Image();
    image.src = material.textureMap;
    await image.decode();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    material.texture = texture;
    console.log("Loaded texture " + material.textureMap);
  }

  renderMesh(gl, scene, mesh, material, modelMatrix) {
    // set model transformation matrix, view matrix, and normal matrix
    gl.uniformMatrix4fv(this.shader.uniformLocations.modelMatrix, false, modelMatrix);
    let viewMatrix = Mat4.create();
    Mat4.lookAt(viewMatrix, scene.camera.position, scene.camera.lookAt, scene.camera.up);
    gl.uniformMatrix4fv(this.shader.uniformLocations.viewMatrix, false, viewMatrix);
    let normalMatrix = new Float32Array(9);
    let modelViewMatrix = Mat4.create();
    Mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
    Mat4.inverseTranspose3x3(normalMatrix, modelViewMatrix);
    gl.uniformMatrix3fv(this.shader.uniformLocations.normalMatrix, false, normalMatrix);

    // set material parameters
    gl.uniform3fv(this.shader.uniformLocations.ka, material.ka);
    gl.uniform3fv(this.shader.uniformLocations.kd, material.kd);
    gl.uniform3fv(this.shader.uniformLocations.ks, material.ks);
    gl.uniform1f(this.shader.uniformLocations.shininess, material.shininess);

    // vertex positions
    let vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.positions), gl.STATIC_DRAW);
    const vPositionLoc = this.shader.attribLocations.position;
    gl.vertexAttribPointer(vPositionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPositionLoc);

    // normals
    let nbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.normals), gl.STATIC_DRAW);
    const vNormalLoc = this.shader.attribLocations.normal;
    gl.vertexAttribPointer(vNormalLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormalLoc);

    // uv coords
    let uvbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.uvCoords), gl.STATIC_DRAW);
    const vUvCoordLoc = this.shader.attribLocations.uvCoord;
    gl.vertexAttribPointer(vUvCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vUvCoordLoc);

    // bind texture if we have one
    if (material.texture) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, material.texture);
      gl.uniform1i(this.shader.uniformLocations.texture, 0);
      gl.uniform1i(this.shader.uniformLocations.hasTexture, 1);
    } else {
      gl.uniform1i(this.shader.uniformLocations.hasTexture, 0);
    }

    // index buffer
    if (mesh.indices.length == 0) {  // generate index buffer for non-indexed mesh
      const numVerts = mesh.positions.length / 3;
      mesh.indices = [...Array(numVerts).keys()];
    }
    const ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

    gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
  }

  async render(scene) {
    await this.shaderSetUp(this.gl, scene, this.shaders);

    this.clear();
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    for (const [objectId, object] of Object.entries(scene.objects)) {
      const transformSequence = scene.transformations[objectId] || [];
      const mesh = scene.meshes[object.mesh];
      const material = scene.materials[object.material];
      const transform = scene.computeTransformation(transformSequence);
      this.renderMesh(this.gl, scene, mesh, material, transform);
    }
  }

  clear() {
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
  }

  saveImage(filename) {
    filename = filename || "image.png"
    const dataUrl = this.canvas.toDataURL();
    var link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.click();
  }
}

export { Renderer };
