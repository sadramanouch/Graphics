import { TriangleMesh } from './trianglemesh.js';

class Scene {
  constructor() {
    this.meshes = {};
    this.materials = {};
    this.objects = {};
    this.transformations = {};
    this.lights = {};
    this.camera = {};
  }

  addCube(id) {
    let mesh = new TriangleMesh();
    mesh.createCube();
    this.meshes[id] = mesh;
  }

  addSphere(id, numStacks, numSectors) {
    let mesh = new TriangleMesh();
    mesh.createSphere(numStacks, numSectors);
    this.meshes[id] = mesh;
  }

  createMaterial(id, ka, kd, ks, shininess, textureMap) {
    this.materials[id] = {
      ka: ka,
      kd: kd,
      ks: ks,
      shininess: shininess,
      textureMap: textureMap
    };
  }

  createObject(id, mesh, material) {
    this.objects[id] = { mesh: mesh, material: material };
  }

  pushTransformation(id, transformDefinition) {
    if (id in this.transformations) {
      this.transformations[id].push(transformDefinition);
    } else {
      this.transformations[id] = [transformDefinition];
    }
  }

  addLight(id, type, position, intensity) {
    this.lights[id] = {
      id: id,
      type: type,
      position: position,
      intensity: intensity
    };
  }

  setCamera(id, type, position, lookAt, up) {
    this.camera = {
      id: id,
      type: type,
      position: position,
      lookAt: lookAt,
      up: up
    }
  }
}

export { Scene, TriangleMesh };
