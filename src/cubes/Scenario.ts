import * as THREE from "three";

export default class Scenario {
  cube: HTMLElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.Renderer;

  constructor(id: string) {
    this.cube = document.getElementById(id).parentElement;
    // console.log(this.cube);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      25,
      this.cube.clientWidth / this.cube.clientHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: document.getElementById(id)
    });
    this.camera.position.set(0, 0, 5);
    this.renderer.setSize(this.cube.clientWidth, this.cube.clientHeight);

    this.scene.add(new THREE.AxesHelper(10));
    this.animate();

    window.addEventListener("resize", this.onWindowResize, false);
  }
  private onWindowResize = () => {
    this.camera.aspect = this.cube.clientWidth / this.cube.clientHeight;
    this.camera.updateMatrix();
    this.renderer.setSize(this.cube.clientWidth, this.cube.clientHeight);
  };
  private animate = () => {
    requestAnimationFrame(this.animate);
    this.render();
  };
  private render() {
    this.renderer.render(this.scene, this.camera);
  }
}
