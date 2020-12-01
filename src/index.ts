import { AmbientLight, BoxGeometry, BufferAttribute, BufferGeometry, BufferGeometryUtils, DirectionalLight, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const container = document.getElementById('map') as HTMLCanvasElement;

const scene = new Scene();
const renderer = new WebGLRenderer({
    canvas: container
});

const camera = new PerspectiveCamera(75, container.width/container.height, 0.1, 1000);
camera.position.z = 5;

const controls = new OrbitControls(camera, container);

const light = new DirectionalLight('white');
light.position.x = -3;
light.position.y = 1;
light.position.z = 5;
scene.add(light);

const light2 = new AmbientLight('yellow', 0.5);
scene.add(light2);

const geometry = new BoxGeometry();
const material = new MeshPhongMaterial( { color: 0x00ff00 } );
const cube = new Mesh( geometry, material );
scene.add( cube );


/**
 * Polygon model: hardcoded model
 * Voxel model: data-driven models
 */

// cube data
const cubeData = {
    'left': {
        normal: [-1, 0, 0],
        vertices: [
            [-1,  1,  1],
            [-1,  1, -1],
            [-1, -1, -1],
            [-1,  1,  1],
            [-1, -1, -1],
            [-1, -1,  1]
        ],
    },
    'right': {
        normal: [1, 0, 0],
        vertices: [
            [ 1,  1,  1],
            [ 1,  1, -1],
            [ 1, -1, -1],
            [ 1,  1,  1],
            [ 1, -1, -1],
            [ 1, -1,  1],
        ],
    },
    'top': {
        normal: [0, 1, 0],
        vertices: [
            [-1,  1,  1],
            [ 1,  1,  1],
            [ 1,  1, -1],
            [-1,  1,  1],
            [ 1,  1, -1],
            [-1,  1, -1],
        ],
    },
    'bottom': {
        normal: [0, -1, 0],
        vertices: [
            [-1, -1,  1],
            [ 1, -1,  1],
            [ 1, -1, -1],
            [-1, -1,  1],
            [ 1, -1, -1],
            [-1, -1, -1],
        ],
    },
    'front': {
        normal: [0, 0, 1],
        vertices: [
            [-1,  1, 1],
            [ 1,  1, 1],
            [-1, -1, 1],
            [ 1,  1, 1],
            [-1, -1, 1],
            [ 1, -1, 1],
        ],
    },
    'back': {
        normal: [0, 0, -1],
        vertices: [
            [-1,  1, -1],
            [ 1,  1, -1],
            [-1, -1, -1],
            [ 1,  1, -1],
            [-1, -1, -1],
            [ 1, -1, -1],
        ],
    },
};

// Voxel data
const X = 30;
const Y = 30;
const Z = 30;
const data: number[][][] = [];
for (let x = 0; x < X; x++) {
    data.push([]);
    for (let y = 0; y < Y; y++) {
        data[x].push([]);
        for (let z = 0; z < Z; z++) {
            if (y < 15) {
                data[x][y].push(1 + Math.floor(Math.random() * 4));
            } else {
                data[x][y].push(0);
            }
        }
    }
}

const cubeSize = 0.3;
const vertices: number[][] = [];
const normals: number[][] = [];
for (let x = 0; x < X; x++) {
    for (let y = 0; y < Y; y++) {
        for (let z = 0; z < Z; z++) {
            if (data[x][y][z] !== 0) {

                // left neighbor
                if (x === 0 || data[x-1][y][z] !== 0) {
                    for (const vertex of cubeData.left.vertices) {
                        vertices.push([cubeSize * (vertex[0] + x), cubeSize * (vertex[1] + y), cubeSize * (vertex[2] + z)]);
                        normals.push(cubeData.left.normal);
                    }
                }
                
                // right neighbor
                if (x === X-1 || data[x+1][y][z] !== 0) {
                    for (const vertex of cubeData.right.vertices) {
                        vertices.push([cubeSize * (vertex[0] + x), cubeSize * (vertex[1] + y), cubeSize * (vertex[2] + z)]);
                        normals.push(cubeData.right.normal);
                    }
                }
                
                // top neighbor;
                if (y === Y-1 || data[x][y+1][z] !== 0) {
                    for (const vertex of cubeData.top.vertices) {
                        vertices.push([cubeSize * (vertex[0] + x), cubeSize * (vertex[1] + y), cubeSize * (vertex[2] + z)]);
                        normals.push(cubeData.top.normal);
                    }
                }
                
                // bottom neighbor
                if (y === 0 || data[x][y-1][z] !== 0) {
                    for (const vertex of cubeData.bottom.vertices) {
                        vertices.push([cubeSize * (vertex[0] + x), cubeSize * (vertex[1] + y), cubeSize * (vertex[2] + z)]);
                        normals.push(cubeData.bottom.normal);
                    }
                }
                
                // front neighbor
                if (z === Z-1 || data[x][y][z+1] !== 0) {
                    for (const vertex of cubeData.front.vertices) {
                        vertices.push([cubeSize * (vertex[0] + x), cubeSize * (vertex[1] + y), cubeSize * (vertex[2] + z)]);
                        normals.push(cubeData.front.normal);
                    }
                }
                
                // back neighbor
                if (z === 0 || data[x][y][z-1] !== 0) {
                    for (const vertex of cubeData.back.vertices) {
                        vertices.push([cubeSize * (vertex[0] + x), cubeSize * (vertex[1] + y), cubeSize * (vertex[2] + z)]);
                        normals.push(cubeData.back.normal);
                    }
                }
                
            }
        }
    }
}

const voxelBlockGeometry = new BufferGeometry();
voxelBlockGeometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices.flat()), 3));
voxelBlockGeometry.setAttribute('normal', new BufferAttribute(new Float32Array(normals.flat()), 3));
const voxelBlockMaterial = new MeshLambertMaterial({color: 'blue'});
const voxelBlock = new Mesh(voxelBlockGeometry, voxelBlockMaterial);
scene.add(voxelBlock);




function animate() {
    requestAnimationFrame( animate );
    cube.rotateX(0.01);
    cube.rotateY(0.01);
	renderer.render( scene, camera );
}
animate();