import { Mat4 } from './math.js';
import { Parser } from './parser.js';
import { Scene } from './scene.js';
import { Renderer } from './renderer.js';
import { TriangleMesh } from './trianglemesh.js';
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement createCube, createSphere, computeTransformation, and shaders
////////////////////////////////////////////////////////////////////////////////

// Definition of a quad with positions, normals, and UV coordinates
const quad = {
	positions: [-1, -1, -1, 1, -1, -1, 1, 1, -1, -1, -1, -1, 1, 1, -1, -1,  1, -1],
	normals: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
	uvCoords: [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]
}
  
// Function to generate cube geometry with positions, normals, and UV coordinates
function generateCubeGeometry() {
	const positions = [];
	const normals = [];
	const uvs = [];
  
	// Function to add vertices for each face of the cube
	function addFaceVertices(p1, p2, p3, p4, normal) {
		positions.push(...p1, ...p2, ...p3, ...p4);
		normals.push(...normal, ...normal, ...normal, ...normal);
		uvs.push(1, 0, 1 / 2, 1 / 3, 1 / 2, 0, 1 / 2, 1 / 3, 1, 0, 1, 1 / 3);
	}
  
	// Front face
	addFaceVertices([-1, -1, -1], [1, 1, -1], [1, -1, -1], [1, 1, -1], [0, 0, -1]);
  
	// Back face
	addFaceVertices([-1, -1, 1], [1, -1, 1], [1, 1, 1], [1, 1, 1], [0, 0, 1]);
  
	// Bottom face
	addFaceVertices([-1, -1, -1], [1, -1, -1], [1, -1, 1], [1, -1, 1], [0, -1, 0]);
  
	// Top face
	addFaceVertices([-1, 1, -1], [1, 1, 1], [1, 1, -1], [1, 1, 1], [0, 1, 0]);
  
	// Left face
	addFaceVertices([-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [-1, 0, 0]);
  
	// Right face
	addFaceVertices([1, 1, 1], [1, 1, -1], [1, -1, 1], [1, 1, -1], [1, 0, 0]);
  
	// Return the generated cube geometry
	return { positions, normals, uvs };
}

TriangleMesh.prototype.createCube = function() {
  	// TODO: populate unit cube vertex positions, normals, and uv coordinates
  	this.positions = quad.positions;
  	this.normals = quad.normals;
  	this.uvCoords = quad.uvCoords;
}

// Define the createSphere method for the TriangleMesh prototype
TriangleMesh.prototype.createSphere = function(numStacks, numSectors) {
	// Generate sphere geometry using helper function
	const { verts, norms, uvs, indices } = generateSphereGeometry(numStacks, numSectors);
	
	// Assign generated geometry to the TriangleMesh properties
	this.positions = verts;
	this.normals = norms;
	this.uvCoords = uvs;
	this.indices = indices;
  };
	
// Helper function to generate sphere geometry based on stacks and sectors
function generateSphereGeometry(numStacks, numSectors) {
	// Initialize arrays to store vertices, normals, UV coordinates, and indices
	const verts = [];
	const norms = [];
	const uvs = [];
	const indices = [];
	
	// Loop through stacks and sectors to generate vertices and corresponding data
	for (let i = 0; i <= numStacks; i++) {
	  	// Calculate stack angle
	  	const stackAngle = Math.PI / 2 - i * (Math.PI / numStacks);
	  	const xy = Math.cos(stackAngle);
	  	const z = Math.sin(stackAngle);
	
	  	// Loop through sectors to generate vertices, normals, and UV coordinates
	  	for (let j = 0; j <= numSectors; ++j) {
			const sectorAngle = j * (2 * Math.PI / numSectors);
			const x = xy * Math.cos(sectorAngle);
			const y = xy * Math.sin(sectorAngle);
		
			// Push vertices, normals, and UV coordinates to respective arrays
			verts.push(x, y, z);
			norms.push(x, y, z);
			uvs.push(j / numSectors, i / numStacks);
	  	}
	}
	
	// Loop through stacks and sectors to generate indices for triangles
	for (let i = 0; i < numStacks; i++) {
	  	const k1 = i * (numSectors + 1);
	  
	  	// Loop through sectors to create triangles and push indices
	  	for (let j = 0; j < numSectors; j++) {
			const k2 = k1 + j;
		
			// Check if it's not the first stack to avoid duplicate triangles
			if (i !== 0) {
		  		indices.push(k1, k2, k1 + 1);
			}
		
			// Check if it's not the last stack to avoid overflow
			if (i !== (numStacks - 1)) {
		  		indices.push(k1 + 1, k2, k2 + 1);
			}
		
			// Check if it's not the first stack to avoid duplicate lines
			if (i !== 0) {
		  		indices.push(k1, k1 + 1);
			}
	  	}
	}
	
	// Return the generated geometry as an object
	return { verts, norms, uvs, indices };
}

// Scene method to compute transformation matrix based on a sequence of transformations
Scene.prototype.computeTransformation = function(transformSequence) {
	// Create a new identity matrix for transformation
	var transform = Mat4.create(); 
  
	// Apply the transformation sequence recursively starting from the first row
	applyTransformRec(transformSequence, 0, transform);
  
	// Return the computed transformation matrix
	return transform;
};

// Recursive function to apply a sequence of 3D transformations to a matrix
function applyTransformRec(inputs, row, mt) {
	// Extract transformation type and parameters from the input array
	const transformType = inputs[row][0];
	const parameters = inputs[row].slice(1);
  
	// Create a new transformation matrix
	const m = Mat4.create();
  
	// Apply different transformations based on the transformation type
	switch (transformType) {
	  	case "S": // Scale transformation
			Mat4.set(m,
		  	parameters[0], 0, 0, 0,
		  	0, parameters[1], 0, 0,
		  	0, 0, parameters[2], 0,
		  	0, 0, 0, 1
		);
		break;
  
	  	case "T": // Translation transformation
			Mat4.set(m,
		  	1, 0, 0, 0,
		  	0, 1, 0, 0,
		  	0, 0, 1, 0,
		  	parameters[0], parameters[1], parameters[2], 1
		);
		break;
  
	  	case "Rx": // Rotation around the X-axis
			const thetaX = (parameters[0] * Math.PI) / 180.0;
			Mat4.set(m,
		  	1, 0, 0, 0,
		  	0, Math.cos(thetaX), Math.sin(thetaX), 0,
		  	0, -Math.sin(thetaX), Math.cos(thetaX), 0,
		  	0, 0, 0, 1
		);
		break;
  
	  	case "Ry": // Rotation around the Y-axis
			const thetaY = (parameters[0] * Math.PI) / 180.0;
			Mat4.set(m,
		  	Math.cos(thetaY), 0, -Math.sin(thetaY), 0,
		  	0, 1, 0, 0,
		  	Math.sin(thetaY), 0, Math.cos(thetaY), 0,
		  	0, 0, 0, 1
		);
		break;
  
	  	case "Rz": // Rotation around the Z-axis
			const thetaZ = (parameters[0] * Math.PI) / 180.0;
			Mat4.set(m,
		  	Math.cos(thetaZ), Math.sin(thetaZ), 0, 0,
		  	-Math.sin(thetaZ), Math.cos(thetaZ), 0, 0,
		  	0, 0, 1, 0,
		  	0, 0, 0, 1
		);
		break;
	}
  
	// Recursively apply the next transformation if available
	if (row + 1 < inputs.length) {
		mt = Mat4.multiply(mt, applyTransformRec(inputs, row + 1, mt), m);
		return mt;
	} 
	// Return the final transformation matrix if no more transformations
	else {
	  	return m;
	}
}

Renderer.prototype.VERTEX_SHADER = `
precision mediump float;
attribute vec3 position, normal;
attribute vec2 uvCoord;
uniform vec3 lightPosition;
uniform mat4 projectionMatrix, viewMatrix, modelMatrix;
uniform mat3 normalMatrix;
varying vec2 vTexCoord;

// TODO: implement vertex shader logic below

varying vec3 fNormal;
varying vec3 lightDir;
varying vec3 cameraDir;

// Main vertex shader function
void main() {
	// Calculate normalized surface normal in view space
	fNormal = normalize(normalMatrix * normal);

	// Pass UV coordinates to fragment shader
	vTexCoord = uvCoord;

	// Transform the object position to clip space
	vec4 pos = viewMatrix * modelMatrix * vec4(position, 1.0);

	// Transform the object position to clip space using the projection matrix
	gl_Position = projectionMatrix * pos;

	// Calculate the normalized light direction in view space
	lightDir = normalize(lightPosition - position);

	// Calculate the normalized camera direction in view space
	vec3 cameraDir = -pos.z * normalize(position);
}
`;

Renderer.prototype.FRAGMENT_SHADER = `
precision mediump float;
uniform vec3 ka, kd, ks, lightIntensity;
uniform float shininess;
uniform sampler2D uTexture;
uniform bool hasTexture;
varying vec2 vTexCoord;

// TODO: implement fragment shader logic below

varying vec3 fNormal;
varying vec3 lightDir;
varying vec3 cameraDir;

// Main fragment shader function
void main() {
	// Calculate the dot product between the normalized surface normal and light direction
	float n_dot_l = dot(fNormal, lightDir);

	// Calculate the half vector between light direction and camera direction
	vec3 halfVector = normalize(lightDir + cameraDir);
	
	// Calculate the dot product between the normalized surface normal and half vector
	float n_dot_hv = dot(fNormal, halfVector);

	// Calculate diffuse reflection using Lambert's cosine law
	vec3 diffuse = kd * lightIntensity * max(0.0, n_dot_l);

	// Calculate specular reflection using Phong reflection model
	vec3 specular = ks * lightIntensity * pow(max(0.0, n_dot_hv), shininess);

	// Combine ambient, diffuse, and specular components to get final color
	vec4 finalColor = vec4(ka + diffuse + specular, 1);

	// Apply texture if available
	if (hasTexture) {
		finalColor *= texture2D(uTexture, vTexCoord);
	}
	
	// Output the final color to the framebuffer
	gl_FragColor = finalColor;
}
`;

////////////////////////////////////////////////////////////////////////////////
// EXTRA CREDIT: change DEF_INPUT to create something interesting!
////////////////////////////////////////////////////////////////////////////////
const DEF_INPUT = [
	"c,myCamera,perspective,5,5,5,0,0,0,0,1,0;",
	"l,light1,point,5,5,5,1,1,1;",
	"l,light2,directional,-1,-1,-1,0.5,0.5,0.5;",
	"p,head,sphere,30,30;",
	"p,body,cube;",
	"p,leftLeg,cube;",
	"p,rightLeg,cube;",
	"p,leftArm,cube;",
	"p,rightArm,cube;",
	"m,headMat,0.9,0.8,0.7,1,0,0,1,1,1,30;",
	"m,bodyMat,0.2,0.5,0.8,1,0,0,1,1,1,30;",
	"m,limbMat,0.9,0.6,0.4,1,0,0,1,1,1,30;",
	"o,head,head,headMat;",
	"o,body,body,bodyMat;",
	"o,leftLeg,leftLeg,limbMat;",
	"o,rightLeg,rightLeg,limbMat;",
	"o,leftArm,leftArm,limbMat;",
	"o,rightArm,rightArm,limbMat;",
	"X,body,S,1,2,1;X,body,T,0,0.5,0;",
	"X,head,T,0,1,0;X,head,S,0.8,0.8,0.8;",
	"X,leftLeg,T,-0.3,-0.5,0;X,rightLeg,T,0.3,-0.5,0;",
	"X,leftArm,T,-0.6,1,0;X,rightArm,T,0.6,1,0;",
].join("\n");

// DO NOT CHANGE ANYTHING BELOW HERE
export { Parser, Scene, Renderer, DEF_INPUT };