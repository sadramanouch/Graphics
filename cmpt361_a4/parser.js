class Parser {
  parse(input, scene) {
    console.log("Input scene:\n" + input);

    // separate definitions of primitives, materials, objects, lights, camera, and transformations
    const lines = input.split(';').map(l => l.trim());
    const pLines = lines.filter(l => l.startsWith("p"));
    const mLines = lines.filter(l => l.startsWith("m"));
    const oLines = lines.filter(l => l.startsWith("o"));
    const XLines = lines.filter(l => l.startsWith("X"));
    const lLines = lines.filter(l => l.startsWith("l"));
    const cLines = lines.filter(l => l.startsWith("c"));

    // parse primitive definition
    pLines.forEach(pLine => {
      const p = pLine.split(',');
      const id = p[1];
      const type = p[2];
      switch (type) {
        case "cube":
          scene.addCube(id);
          break;
        case "sphere":
          const numStacks = parseInt(p[3]);
          const numSectors = parseInt(p[4]);
          scene.addSphere(id, numStacks, numSectors);
          break;
        default:
          console.error("Unrecognized primitive definition: " + p);
          break;
      }
      console.log("Adding primitive: " + p);
    });

    // parse material definitions
    mLines.forEach(mLine => {
      const m = mLine.split(',');
      const id = m[1];
      const ka = [parseFloat(m[2]), parseFloat(m[3]), parseFloat(m[4])];
      const kd = m.length > 5 ? [parseFloat(m[5]), parseFloat(m[6]), parseFloat(m[7])] : [0, 0, 0];
      const ks = m.length > 8 ? [parseFloat(m[8]), parseFloat(m[9]), parseFloat(m[10])] : [0, 0, 0];
      const shininess = m.length > 11 ? parseFloat(m[11]) : 0;
      const textureMap = m.length > 12 ? m[12] : undefined;
      console.log("Creating material: " + m);
      scene.createMaterial(id, ka, kd, ks, shininess, textureMap);
    });

    // parse object definitions
    oLines.forEach(oLine => {
      const o = oLine.split(',');
      const id = o[1];
      const mesh = o[2];
      const material = o[3];
      console.log("Creating object: " + o);
      scene.createObject(id, mesh, material);
    });

    // parse transformation definitions
    XLines.forEach(XLine => {
      const X = XLine.split(',');
      const id = X[1];
      const type = X[2];
      const x = parseFloat(X[3]);
      const y = X.length > 4 ? parseFloat(X[4]) : 0;
      const z = X.length > 5 ? parseFloat(X[5]) : 0;
      console.log("Pushing transformation: " + X);
      scene.pushTransformation(id, [type, x, y, z]);
    });

    // parse light definitions
    lLines.forEach(lLine => {
      const l = lLine.split(',');
      const id = l[1];
      const type = l[2];
      const position = [parseFloat(l[3]), parseFloat(l[4]), parseFloat(l[5])];
      const intensity = [parseFloat(l[6]), parseFloat(l[7]), parseFloat(l[8])];
      console.log("Setting light: " + l);
      scene.addLight(id, type, position, intensity);
    });

    // parse camera definition
    cLines.forEach(cLine => {
      const c = cLine.split(',');
      const id = c[1];
      const type = c[2];
      const position = [parseFloat(c[3]), parseFloat(c[4]), parseFloat(c[5])];
      const lookAt = [parseFloat(c[6]), parseFloat(c[7]), parseFloat(c[8])];
      const up = [parseFloat(c[9]), parseFloat(c[10]), parseFloat(c[11])];
      console.log("Setting camera: " + c);
      scene.setCamera(id, type, position, lookAt, up);
    });
  }
}

export { Parser };
