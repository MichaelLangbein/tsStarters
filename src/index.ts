import { AmbientLight, BoxGeometry, DirectionalLight, Mesh, MeshBasicMaterial, MeshPhongMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
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

const geometry = new BoxGeometry();
const material = new MeshPhongMaterial( { color: 0x00ff00 } );
const cube = new Mesh( geometry, material );
scene.add( cube );







function animate() {
    requestAnimationFrame( animate );
    cube.rotateX(0.01);
    cube.rotateY(0.01);
	renderer.render( scene, camera );
}
animate();