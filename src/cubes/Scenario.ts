import * as THREE from 'three'

// HELP
import { RubiksCube } from './RubiksCube'

// https://www.cnblogs.com/Wayou/p/typescript_task_runner.html
type Task<T> = {
  name: string
  func: () => Promise<T>
}

// export class TaskRunner {
//   private _queue: Task<any>[] = []
//   private activeTaskNum = 0

//   constructor(private limit = 5, public debug = false) {
//     if (limit < 1) {
//       throw new Error('limit < 1')
//     }
//   }

//   public addTask<T>(task: Task<T>) {
//     this._queue.push(task)
//     this.activeTaskNum++
//     if (this.activeTaskNum == 1) this._runTask()
//   }

//   private _runTask() {
//     while (this.activeTaskNum < this.limit && this._queue.length > 0) {
//       const task = this._queue.shift()
//       this._excute(task)
//     }
//   }

//   private _excute<T>(task: Task<T>) {
//     return task
//       .func()
//       .then((result) => {
//         return result
//       })
//       .catch((reason) => {
//         // do sth
//       })
//       .finally(() => {
//         this.activeTaskNum--
//         this._runTask()
//       })
//   }
// }

export class Scenario {
  // update: Function
  width: number
  height: number
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.Renderer
  rubiksCube: RubiksCube
  // taskRunner: TaskRunner

  constructor(element: HTMLCanvasElement, obj: RubiksCube) {
    // this.cube = document.getElementById(element).parentElement;
    // console.log(this.cube);
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
    // this.taskRunner = new TaskRunner(5, false)

    window.addEventListener('resize', this.onWindowResize, false)
  }

  public onWindowResize = () => {
    this.width = window.innerWidth * 0.8
    this.height = window.innerHeight * 0.8
    this.camera.aspect = this.width / this.height
    this.camera.updateMatrix()
    this.renderer.setSize(this.width, this.height)
  }

  set update(func: Function) {
    this.update = func
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
