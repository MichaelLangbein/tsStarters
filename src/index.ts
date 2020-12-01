import {
    AmbientLight, BoxGeometry, BufferAttribute, BufferGeometry, BufferGeometryUtils,
    Color,
    DirectionalLight, DoubleSide, Mesh, MeshBasicMaterial, MeshLambertMaterial,
    MeshPhongMaterial, PerspectiveCamera, PlaneGeometry, Scene, Vector3, VertexColors,
    WebGLRenderer, WireframeGeometry
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createAttributes, createBlockMesh } from './utils/utils';


const container = document.getElementById('map') as HTMLCanvasElement;
const slider = document.getElementById('rangeSlider') as HTMLInputElement;

const scene = new Scene();
const renderer = new WebGLRenderer({
    canvas: container
});

const camera = new PerspectiveCamera(75, container.width / container.height, 0.1, 1000);
camera.position.z = 10;
camera.position.y = 4;

const controls = new OrbitControls(camera, container);

const light = new DirectionalLight('white');
light.position.x = -3;
light.position.y = 1;
light.position.z = 5;
scene.add(light);

const light2 = new AmbientLight('yellow', 0.5);
scene.add(light2);

const planeGeom = new PlaneGeometry(80, 80);
const planeMaterial = new MeshBasicMaterial({ color: new Color('rgb(0, 100, 225)'), side: DoubleSide, transparent: true, opacity: 0.5 });
const cutPlane = new Mesh(planeGeom, planeMaterial);
cutPlane.position.setX(-20);
cutPlane.lookAt(-1, 0, 0);
scene.add(cutPlane);



const colorFunc = (val: number): [number, number, number] => {
    switch (val) {
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

const X = 80;
const Y = 30;
const Z = 80;

const allData: number[][][] = [];
for (let x = 0; x < X; x++) {
    allData.push([]);
    for (let y = 0; y < Y; y++) {
        allData[x].push([]);
        for (let z = 0; z < Z; z++) {
            if (y < 10 * Math.sin(x * 0.1) * Math.cos(z * 0.1) + 5) {
                allData[x][y].push(1 + Math.floor(Math.random() * 4));
            } else {
                allData[x][y].push(0);
            }
        }
    }
}

const blockSize = 0.5;
const translation: [number, number, number] = [-20, -10, 0];
const voxelBlock = createBlockMesh(allData, blockSize, [X, Y, Z], translation, colorFunc);
scene.add(voxelBlock);

slider.addEventListener('input', (ev: Event) => {
    const val = +(slider.value);
    cutPlane.position.setX(val);

    const newData: number[][][] = [];
    for (let x = 0; x < X; x++) {
        newData.push([]);
        for (let y = 0; y < Y; y++) {
            newData[x].push([]);
            for (let z = 0; z < Z; z++) {
                const xVal = translation[0] + x * blockSize / 2;
                if (xVal < val) {
                    newData[x][y][z] = 0;
                } else {
                    newData[x][y][z] = allData[x][y][z];
                }
            }
        }
    }

    const newAttrs = createAttributes(newData, blockSize, [X, Y, Z], translation, colorFunc);
    (voxelBlock.geometry as BufferGeometry).setAttribute('position', newAttrs.position);
    (voxelBlock.geometry as BufferGeometry).setAttribute('normal', newAttrs.normal);
    (voxelBlock.geometry as BufferGeometry).setAttribute('color', newAttrs.color);
});


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();