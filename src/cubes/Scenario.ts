import * as THREE from 'three'

import { RubiksCube } from './RubiksCube'

export class Scenario {
  width: number
  height: number
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.Renderer
  rubiksCube: RubiksCube

  constructor(element: HTMLCanvasElement, obj: RubiksCube) {
    this.width = window.innerWidth * 0.8
    this.height = window.innerHeight * 0.8
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xfeffa8)
    this.camera = new THREE.PerspectiveCamera(
      25,
      this.width / this.height,
      0.1,
      1000
    )
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: element,
    })
    this.camera.position.set(0, 0, 5)
    this.renderer.setSize(this.width, this.height)

    this.scene.add(new THREE.AxesHelper(10))

    this.rubiksCube = obj
    this.scene.add(this.rubiksCube.group)

    window.addEventListener('resize', this.onWindowResize, false)
  }

  public onWindowResize = () => {

    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const rect = canvas.parentNode.getBoundingClientRect()
    canvas.width = rect.width * 0.8
    canvas.height = rect.height * 0.8
    // this.width = window.innerWidth * 0.8
    // this.height = window.innerHeight * 0.8
    this.camera.aspect = canvas.width / canvas.height
    this.camera.updateMatrix()
    this.renderer.setSize(canvas.width, canvas.height)
  }

  public animate = () => {
    requestAnimationFrame(this.animate)
    this.rubiksCube.update()
    this.render()
  }
  private render() {
    this.renderer.render(this.scene, this.camera)
  }
}
