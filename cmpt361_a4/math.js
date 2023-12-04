class Mat4 {
  // create 4x4 identity matrix Mat4
  static create() {
    let o = new Float32Array(16);
    o[0] = 1; o[5] = 1; o[10] = 1; o[15] = 1;
    return o;
  }

  // set components of Mat4 o to the given values
  static set(o, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    o[0] = m00; o[1] = m01; o[2] = m02; o[3] = m03;
    o[4] = m10; o[5] = m11; o[6] = m12; o[7] = m13;
    o[8] = m20; o[9] = m21; o[10] = m22; o[11] = m23;
    o[12] = m30; o[13] = m31; o[14] = m32; o[15] = m33;
    return o;
  }

  // multiply Mat4 a with Mat4 b and return resulting Mat4
  static multiply(o, a, b) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    o[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    o[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    o[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    o[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    o[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    o[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    o[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    o[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    o[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    o[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    o[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    o[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    o[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    o[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    o[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    o[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return o;
  }

  // set Mat4 o to transpose of Mat4 a
  static transpose(o, a) {
    if (o === a) {  // in-place transpose
      const a01 = a[1], a02 = a[2], a03 = a[3];
      const a12 = a[6], a13 = a[7];
      const a23 = a[11];
      o[1] = a[4]; o[2] = a[8]; o[3] = a[12];
      o[4] = a01; o[6] = a[9]; o[7] = a[13];
      o[8] = a02; o[9] = a12; o[11] = a[14];
      o[12] = a03; o[13] = a13; o[14] = a23;
    } else {
      o[0] = a[0]; o[1] = a[4]; o[2] = a[8]; o[3] = a[12];
      o[4] = a[1]; o[5] = a[5]; o[6] = a[9]; o[7] = a[13];
      o[8] = a[2]; o[9] = a[6]; o[10] = a[10]; o[11] = a[14];
      o[12] = a[3]; o[13] = a[7]; o[14] = a[11]; o[15] = a[15];
    }
    return o;
  }

  // set Mat4 o to inverse of Mat4 a
  static inverse(o, a) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;
    const det = 1.0 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);
    o[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    o[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    o[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    o[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    o[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    o[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    o[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    o[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    o[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    o[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    o[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    o[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    o[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    o[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    o[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    o[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return o;
  }

  static inverseTranspose3x3(o, a) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;
    const det = 1.0 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);
    o[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    o[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    o[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    o[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    o[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    o[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    o[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    o[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    o[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    return o;
  }

  // set Mat4 o to perspective projection matrix with vertical field of view
  // in radians fovy, and near and far planes at near and far respectively
  static perspective(o, fovy, aspect, near, far) {
    const f = 1.0 / Math.tan(fovy / 2.0);
    o[0] = f / aspect; o[1] = 0; o[2] = 0; o[3] = 0;
    o[4] = 0; o[5] = f; o[6] = 0; o[7] = 0; o[8] = 0;
    o[9] = 0; o[11] = -1; o[12] = 0; o[13] = 0; o[15] = 0;
    const nf = 1 / (near - far);
    o[10] = (far + near) * nf;
    o[14] = 2 * far * near * nf;
    return o;
  }

  // set Mat4 o to "look at" matrix with camera position at eye, point
  // to look at in center, and camera up axis up
  static lookAt(o, e, c, up) {
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, l;
    z0 = e[0] - c[0]; z1 = e[1] - c[1]; z2 = e[2] - c[2];
    l = 1 / Math.hypot(z0, z1, z2);
    z0 *= l; z1 *= l; z2 *= l;
    x0 = up[1] * z2 - up[2] * z1; x1 = up[2] * z0 - up[0] * z2; x2 = up[0] * z1 - up[1] * z0;
    l = 1 / Math.hypot(x0, x1, x2);
    x0 *= l; x1 *= l; x2 *= l;
    y0 = z1 * x2 - z2 * x1; y1 = z2 * x0 - z0 * x2; y2 = z0 * x1 - z1 * x0;
    l = 1 / Math.hypot(y0, y1, y2);
    y0 *= l; y1 *= l; y2 *= l;
    o[0] = x0; o[1] = y0; o[2] = z0; o[3] = 0;
    o[4] = x1; o[5] = y1; o[6] = z1; o[7] = 0;
    o[8] = x2; o[9] = y2; o[10] = z2; o[11] = 0;
    o[12] = -(x0 * e[0] + x1 * e[1] + x2 * e[2]);
    o[13] = -(y0 * e[0] + y1 * e[1] + y2 * e[2]);
    o[14] = -(z0 * e[0] + z1 * e[1] + z2 * e[2]);
    o[15] = 1;
    return o;
  }
}

class Vec4 {
  // create and return Vec4
  static create() { return new Float32Array(4); }

  // set components of Vec4 o to the given values
  static set(o, x, y, z, w) {
    o[0] = x; o[1] = y; o[2] = z; o[3] = w;
  }

  // create and return Vec4 with given values
  static from(x, y, z, w) {
    let o = Vec4.create();
    Vec4.set(o, x, y, z, w)
    return o;
  }

  // transform Vec4 a by Mat4 m and return resulting Vec4
  static transformMat4(o, a, m) {
    const x = a[0], y = a[1], z = a[2], w = a[3];
    o[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    o[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    o[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    o[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return o;
  }
}

export { Mat4, Vec4 };
