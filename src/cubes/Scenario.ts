import * as THREE from "three";

export default class Scenario {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.Renderer;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      25,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: document.getElementById("canvas")
    });
    this.camera.position.set(0, 0, 5);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene.add(new THREE.AxesHelper(10));
    this.animate();

    window.addEventListener("resize", this.onWindowResize, false);
  }
  private onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };
  private animate = () => {
    requestAnimationFrame(this.animate);
    this.render();
  };
  private render() {
    this.renderer.render(this.scene, this.camera);
  }
}
