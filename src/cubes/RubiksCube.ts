import * as THREE from 'three'
import { TaskRunner } from './Scenario'
declare module '*.png'
import * as BLUE from '../assets/cubes/blue.png'
import * as GREEN from '../assets/cubes/green.png'
import * as ORANGE from '../assets/cubes/orange.png'
import * as RED from '../assets/cubes/red.png'
import * as WHITE from '../assets/cubes/white.png'
import * as YELLOW from '../assets/cubes/yellow.png'
/*
  the interface to load all three-created regular cube models
  some types of cube's rotation layer can transfrom between moves, which cannot be described by the following order set.
*/
type state = number[]
type stateMap = [state, state]
type order = [string, stateMap]
interface RegularModel {
  meshs: THREE.Mesh[]
  orderSet: order[]
}

class MyCubeMaterial {
  materials: THREE.Material[]
  constructor() {
    this.materials = [
      new THREE.MeshBasicMaterial({ color: 0x00ffff }),
      new THREE.MeshBasicMaterial(),
      new THREE.MeshBasicMaterial(),
      new THREE.MeshBasicMaterial(),
      new THREE.MeshBasicMaterial(),
      new THREE.MeshBasicMaterial(),
    ]
    this.materials.forEach((el) => {
      el.needsUpdate = true
      el.setValues({
        opacity: 0,
        transparent: true,
        side: THREE.DoubleSide,
      })
    })
  }
}
/*
  create a N layer rubik's cube.
*/

export class RubiksCube implements RegularModel {
  scene: THREE.Scene
  layer: number
  meshs: THREE.Mesh[]
  group: THREE.Group
  cubeMat: THREE.Mesh[][][]
  orderSet: order[]
  state: state
  taskRunner: TaskRunner
  flag: boolean //flag for whether rotating or not

  constructor(layer: number, scene: THREE.Scene, taskRunner: TaskRunner) {
    this.layer = layer
    this.scene = scene
    this.meshs = []
    this.cubeMat = []
    for (let i = 0; i < layer; i++) {
      this.cubeMat.push([])
      for (let j = 0; j < layer; j++) {
        this.cubeMat[i].push(new Array(3))
      }
    }
    this.group = new THREE.Group()
    this.group.scale.setScalar(0.2)
    this.group.setRotationFromEuler(new THREE.Euler(0.4, 1, 0, 'XYZ'))
    this._generateMeshs()
    // this.orderSet = this._generateOrderSet()
    this.flag = false

    this.scene.add(this.group)

    // set current state to standard state
    this.state = new Array(layer * layer * layer)
    this.state.forEach((val, index) => {
      val = index
    })

    this.taskRunner = taskRunner
  }

  private _generateMeshs() {
    const geometry = new THREE.BoxGeometry()
    for (let i = 0; i < this.layer; i++) {
      for (let j = 0; j < this.layer; j++) {
        for (let k = 0; k < this.layer; k++) {
          const cubeMesh = new THREE.Mesh(
            geometry,
            new MyCubeMaterial().materials
          )
          cubeMesh.name = (
            i * this.layer * this.layer +
            j * this.layer +
            k
          ).toString()
          this.cubeMat[i][j][k] = cubeMesh
          this.meshs[
            i * this.layer * this.layer + j * this.layer + k
          ] = cubeMesh
          cubeMesh.position.set(i - 1, j - 1, k - 1)
          this.group.add(cubeMesh)
        }
      }
    }

    for (let i = 0; i < this.layer; i++) {
      for (let j = 0; j < this.layer; j++) {
        this.cubeMat[i][j][0].material[5].setValues(this._loadStickers(5))
        this.cubeMat[i][j][2].material[4].setValues(this._loadStickers(4))
        this.cubeMat[i][0][j].material[3].setValues(this._loadStickers(3))
        this.cubeMat[i][2][j].material[2].setValues(this._loadStickers(2))
        this.cubeMat[0][i][j].material[1].setValues(this._loadStickers(1))
        this.cubeMat[2][i][j].material[0].setValues(this._loadStickers(0))
        console.log(this.cubeMat[i][j][2])
      }
    }
  }

  private _generateMaterial(): THREE.Material[] {
    const materials = [
      new THREE.MeshBasicMaterial(),
      new THREE.MeshBasicMaterial(),
      new THREE.MeshBasicMaterial(),
      new THREE.MeshBasicMaterial(),
      new THREE.MeshBasicMaterial(),
      new THREE.MeshBasicMaterial(),
    ]
    materials.forEach((el) => {
      el.needsUpdate = true
      el.setValues({
        opacity: 0,
        transparent: true,
        side: THREE.DoubleSide,
      })
    })
    return materials
  }

  private _loadStickers(color = 6) {
    const stickers = [BLUE, GREEN, WHITE, ORANGE, RED, YELLOW]

    const stickerSetting = {
      transparent: false,
      map:
        color == 6
          ? null
          : new THREE.TextureLoader().load(
              // '../assets/cubes/' + stickers[color] + '.png'
              stickers[color]
            ),
    }
    console.log('../assets/cubes/' + stickers[color] + '.svg')
    return stickerSetting
  }

  // public performOrder(ord: order): void {}
  // public performOrderList(ords: order[]): void {}

  // // randomly scramble this cube and return afterward state
  // public scramble(): state {}

  // // solve a cube with given/current state, return orders list
  // public static solve(layer, state: state): order[]
  // public solve(): order[] {
  //   return RubiksCube.solve(this.layer, this.state)
  // }
  // private _generateOrder(): order {}

  // private _generateOrderSet(): order[] {}
}
