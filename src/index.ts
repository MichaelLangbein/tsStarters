import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from "three";


const container = document.getElementById('map') as HTMLCanvasElement;

const scene = new Scene();
const renderer = new WebGLRenderer({
    canvas: container
});
console.log('Using WebGL2: ', renderer.capabilities.isWebGL2);
const camera = new PerspectiveCamera(75, container.width/container.height, 0.1, 1000);

const geometry = new BoxGeometry();
const material = new MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();