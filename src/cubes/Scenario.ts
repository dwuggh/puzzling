import * as THREE from "three";

export default class Scenario {
  width: number;
  height: number;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.Renderer;

  constructor(element: HTMLCanvasElement, width: number, height: number) {
    // this.cube = document.getElementById(element).parentElement;
    // console.log(this.cube);
    this.width = width;
    this.height = height;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(25, width / height, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: element,
    });
    this.camera.position.set(0, 0, 5);
    this.renderer.setSize(width, height);

    this.scene.add(new THREE.AxesHelper(10));
    this.animate();

    // window.addEventListener("resize", this.onWindowResize, false);
  }
  private onWindowResize = () => {
    this.width = window.innerWidth * 0.8;
    this.height = window.innerHeight * 0.8;
    this.camera.aspect = this.width / this.height;
    this.camera.updateMatrix();
    this.renderer.setSize(this.width, this.height);
  };
  private animate = () => {
    requestAnimationFrame(this.animate);
    this.render();
  };
  private render() {
    this.renderer.render(this.scene, this.camera);
  }
}
