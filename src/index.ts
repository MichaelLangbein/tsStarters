import { AmbientLight, BoxGeometry, BufferAttribute, BufferGeometry, BufferGeometryUtils, DirectionalLight, DoubleSide, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, PerspectiveCamera, Scene, Vector3, VertexColors, WebGLRenderer, WireframeGeometry } from 'three';
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
            [ 1, -1, -1],
            [ 1,  1, -1],
            [ 1,  1,  1],
            [ 1, -1,  1],
            [ 1, -1, -1],
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
            [ 1, -1, -1],
            [ 1, -1,  1],
            [-1, -1,  1],
            [-1, -1, -1],
            [ 1, -1, -1],
        ],
    },
    'front': {
        normal: [0, 0, 1],
        vertices: [
            [-1,  1, 1],
            [-1, -1, 1],
            [ 1,  1, 1],
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
            [ 1, -1, -1],
            [-1, -1, -1],
        ],
    },
};

const colorFunc = (val: number) => {
    switch(val) {
        case 0:
            return [0, 0, 0];
        case 1:
            return [1, 0, 0];
        case 2:
            return [0, 1, 0];
        case 3: 
            return [0, 0, 1];
        case 4: 
            return [1, 1, 0];
        case 5:
            return [1, 0, 1];
        case 6:
            return [0, 1, 1];
        case 7:
            return [1, 1, 1];
        default: 
            return [0, 0, 0];
    }
};


// Voxel data
const X = 25;
const Y = 25;
const Z = 25;
const cubeSize = 0.25;

const data: number[][][] = [];
for (let x = 0; x < X; x++) {
    data.push([]);
    for (let y = 0; y < Y; y++) {
        data[x].push([]);
        for (let z = 0; z < Z; z++) {
            if (y < 10 * Math.sin(x * 0.1) * Math.cos(z * 0.1)) {
                data[x][y].push(1 + Math.floor(Math.random() * 4));
            } else {
                data[x][y].push(0);
            }
        }
    }
}

const vertices: number[][] = [];
const normals: number[][] = [];
const colors: number[][] = [];
for (let x = 0; x < X; x++) {
    for (let y = 0; y < Y; y++) {
        for (let z = 0; z < Z; z++) {
            if (data[x][y][z] !== 0) {

                // left neighbor
                if (x === 0 || data[x-1][y][z] === 0) {
                    for (const vertex of cubeData.left.vertices) {
                        vertices.push([cubeSize * (vertex[0]/2 + x), cubeSize * (vertex[1]/2 + y), cubeSize * (vertex[2]/2 + z)]);
                        normals.push(cubeData.left.normal);
                        colors.push(colorFunc(data[x][y][z]));
                    }
                }
                
                // right neighbor
                if (x === X-1 || data[x+1][y][z] === 0) {
                    for (const vertex of cubeData.right.vertices) {
                        vertices.push([cubeSize * (vertex[0]/2 + x), cubeSize * (vertex[1]/2 + y), cubeSize * (vertex[2]/2 + z)]);
                        normals.push(cubeData.right.normal);
                        colors.push(colorFunc(data[x][y][z]));
                    }
                }
                
                // top neighbor
                if (y === Y-1 || data[x][y+1][z] === 0) {
                    for (const vertex of cubeData.top.vertices) {
                        vertices.push([cubeSize * (vertex[0]/2 + x), cubeSize * (vertex[1]/2 + y), cubeSize * (vertex[2]/2 + z)]);
                        normals.push(cubeData.top.normal);
                        colors.push(colorFunc(data[x][y][z]));
                    }
                }
                
                // bottom neighbor
                if (y === 0 || data[x][y-1][z] === 0) {
                    for (const vertex of cubeData.bottom.vertices) {
                        vertices.push([cubeSize * (vertex[0]/2 + x), cubeSize * (vertex[1]/2 + y), cubeSize * (vertex[2]/2 + z)]);
                        normals.push(cubeData.bottom.normal);
                        colors.push(colorFunc(data[x][y][z]));
                    }
                }
                
                // front neighbor
                if (z === Z-1 || data[x][y][z+1] === 0) {
                    for (const vertex of cubeData.front.vertices) {
                        vertices.push([cubeSize * (vertex[0]/2 + x), cubeSize * (vertex[1]/2 + y), cubeSize * (vertex[2]/2 + z)]);
                        normals.push(cubeData.front.normal);
                        colors.push(colorFunc(data[x][y][z]));
                    }
                }
                
                // back neighbor
                if (z === 0 || data[x][y][z-1] === 0) {
                    for (const vertex of cubeData.back.vertices) {
                        vertices.push([cubeSize * (vertex[0]/2 + x), cubeSize * (vertex[1]/2 + y), cubeSize * (vertex[2]/2 + z)]);
                        normals.push(cubeData.back.normal);
                        colors.push(colorFunc(data[x][y][z]));
                    }
                }
                
            }
        }
    }
}

const voxelBlockGeometry = new BufferGeometry();
voxelBlockGeometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices.flat()), 3));
voxelBlockGeometry.setAttribute('normal', new BufferAttribute(new Float32Array(normals.flat()), 3));
voxelBlockGeometry.setAttribute('color', new BufferAttribute(new Float32Array(colors.flat()), 3));
const voxelBlockMaterial = new MeshLambertMaterial({ vertexColors: true, side: DoubleSide, wireframe: false });
const voxelBlock = new Mesh(voxelBlockGeometry, voxelBlockMaterial);
scene.add(voxelBlock);




function animate() {
    requestAnimationFrame( animate );
    cube.rotateX(0.01);
    cube.rotateY(0.01);
	renderer.render( scene, camera );
}
animate();