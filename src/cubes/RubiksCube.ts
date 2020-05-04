import * as THREE from 'three'
// import { TaskRunner } from './Scenario'
// declare module '*.png'
import * as BLUE from '../assets/cubes/blue.png'
import * as GREEN from '../assets/cubes/green.png'
import * as ORANGE from '../assets/cubes/orange.png'
import * as RED from '../assets/cubes/red.png'
import * as WHITE from '../assets/cubes/white.png'
import * as YELLOW from '../assets/cubes/yellow.png'

import { state, Order, Direction } from './Order'

/*
  the interface to load all three-created regular cube models
  some types of cube's rotation layer can transfrom between moves, which cannot be described by the following order set.
*/
interface RegularModel {
  meshs: THREE.Mesh[]
  orderQueue: Order[]
}

class MyCubeMaterial {
  materials: THREE.Material[]
  constructor() {
    this.materials = [
      new THREE.MeshBasicMaterial(),
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
        transparent: false,
        side: THREE.DoubleSide,
      })
    })
  }
}

interface FaceIndicesHelper {
  R: (i: number, j: number, level: number) => number
  L: (i: number, j: number, level: number) => number
  U: (i: number, j: number, level: number) => number
  D: (i: number, j: number, level: number) => number
  F: (i: number, j: number, level: number) => number
  B: (i: number, j: number, level: number) => number
}
/*
  create a N layer rubik's cube.
*/
export class RubiksCube implements RegularModel {
  layer: number
  meshs: THREE.Mesh[]
  group: THREE.Group
  orderQueue: Order[]
  state: state
  test = false
  isRotating: boolean
  subgroup: THREE.Group
  rotationGroup: THREE.Object3D[]
  axisX: THREE.Vector3
  axisY: THREE.Vector3
  axisZ: THREE.Vector3

  readonly faceIndicesHelper: FaceIndicesHelper

  constructor(layer: number) {
    this.layer = layer
    this.meshs = []
    this.orderQueue = []

    this.group = new THREE.Group()
    this.subgroup = new THREE.Group()
    this.rotationGroup = []

    // don't exactly know why, but the world coordinates seem to stick with this group, so no further rotation needed on these axes
    this.axisX = new THREE.Vector3(1, 0, 0)
    this.axisY = new THREE.Vector3(0, 1, 0)
    this.axisZ = new THREE.Vector3(0, 0, 1)

    //TODO: export scale and Euler angle
    this.group.scale.setScalar(0.2)
    const globalRuler = new THREE.Euler(0.4, -0.7, 0, 'XYZ')
    this.group.setRotationFromEuler(globalRuler)
    // this.axisX.applyEuler(globalRuler)
    // this.axisY.applyEuler(globalRuler)
    // this.axisZ.applyEuler(globalRuler)
    this._generateMeshs()
    this.isRotating = false

    // set current state to standard state
    this.state = new Array(layer ** 3)
    for (let i = 0; i < this.state.length; i++) {
      this.state[i] = i
    }

    // help construct a rotation group
    this.faceIndicesHelper = {
      B: (i: number, j: number, level = 0) => {
        return i * this.layer ** 2 + j * this.layer + level
      },
      F: (i: number, j: number, level = 0) => {
        return i * this.layer ** 2 + j * this.layer + (this.layer - 1 - level )
      },
      U: (i: number, j: number, level = 0) => {
        return i * this.layer ** 2 + (this.layer - 1 - level ) * this.layer + j
      },
      D: (i: number, j: number, level = 0) => {
        return i * this.layer ** 2 + level * this.layer + j
      },
      L: (i: number, j: number, level = 0) => {
        return level * this.layer ** 2 + i * this.layer + j
      },
      R: (i: number, j: number, level = 0) => {
        return (this.layer - 1 - level ) * this.layer ** 2 + i * this.layer + j
      },
    }
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
        this.meshs[
          i * this.layer ** 2 + j * this.layer + 0
        ].material[5].setValues(this._loadStickers(5))
        this.meshs[
          i * this.layer ** 2 + j * this.layer + 2
        ].material[4].setValues(this._loadStickers(4))
        this.meshs[
          i * this.layer ** 2 + 0 * this.layer + j
        ].material[3].setValues(this._loadStickers(3))
        this.meshs[
          i * this.layer ** 2 + 2 * this.layer + j
        ].material[2].setValues(this._loadStickers(2))
        this.meshs[
          0 * this.layer ** 2 + i * this.layer + j
        ].material[1].setValues(this._loadStickers(1))
        this.meshs[
          2 * this.layer ** 2 + i * this.layer + j
        ].material[0].setValues(this._loadStickers(0))
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
    const stickers = [RED, ORANGE, WHITE, YELLOW, GREEN, BLUE]

    const stickerSetting = {
      transparent: false,
      map: new THREE.TextureLoader().load(stickers[color]),
    }
    // console.log('../assets/cubes/' + stickers[color] + '.svg')
    return stickerSetting
  }

  /*
    peek the last order of this.orderQueue
    if this order hasn't be done, set this.isRotating = true and perform next step of this order
    if this order is done, remove it from this.orderQueue.
    */
  public update(): void {
    // manual test codes
    if (this.test) {
      this.test = false
      console.log(this.subgroup.rotation)
    }

    // get next order (in progress or not)
    if (this.orderQueue.length > 0) {
      const nextOrder = this.orderQueue[this.orderQueue.length - 1]
      this.performOrder(nextOrder)
    }
  }

  /*
    perform an specific order.
  */
  public performOrder(order: Order): void {
    // set which axis should be used
    let axis: THREE.Vector3
    switch (order.face) {
      case 'R':
        axis = this.axisX.clone().negate()
        break
      case 'L':
        axis = this.axisX
        break
      case 'U':
        axis = this.axisY.clone().negate()
        break
      case 'D':
        axis = this.axisY
        break
      case 'F':
        axis = this.axisZ.clone().negate()
        break
      case 'B':
        axis = this.axisZ
        break
      default:
        axis = new THREE.Vector3(0, 0, 0)
    }

    const anglePerFrame = order.direction == Direction.clockwise ? 0.3 : -0.3
    if (this.isRotating) {
      // return
      const remainingAngle = order.getRemainingAngle()

      // if the remaining angle from target point is too small
      if (Math.abs(remainingAngle) < Math.abs(anglePerFrame)) {
        this._rotateGroupFromAxisAngle(axis, remainingAngle)
        this.isRotating = false
        this.orderQueue.pop()
        this.rotationGroup = []

        // update this.state and this.meshs using the order's target state
        const oldState: state = []
        const oldMeshs: THREE.Mesh[] = []
        for (let i = 0; i < this.layer ** 3; i++) {
          oldState.push(this.state[i])
          oldMeshs.push(this.meshs[i])
        }
        order.targetState.forEach((value: number, index: number) => {
          this.state[index] = oldState[value]
          this.meshs[index] = oldMeshs[value]
        })
        return
      } else {
        // if not, rotate a fixed degree
        // TODO: better animation
        this._rotateGroupFromAxisAngle(axis, anglePerFrame)
        order.rotatedDegree += anglePerFrame
      }
    } else {
      this._setRotationGroup(order)
      this._rotateGroupFromAxisAngle(axis, anglePerFrame)
      this.isRotating = true
      order.rotatedDegree += anglePerFrame
    }
  }

  /*
    rotate an array of meshs around axis.
    translate mesh and then rotate it on world axis.
  */
  private _rotateGroupFromAxisAngle(axis: THREE.Vector3, angle: number) {
    for (const obj of this.rotationGroup) {
      const pos = obj.position.clone()
      pos.applyAxisAngle(axis, angle)
      obj.rotateOnWorldAxis(axis, angle)
      obj.position.copy(pos)
    }
  }

  /*
    set up an array for rotation.
  */
  private _setRotationGroup(order: Order) {
    // rotationGroup must be empty
    this.rotationGroup = []
    for (let i = 0; i < this.layer; i++) {
      for (let j = 0; j < this.layer; j++) {
        // https://stackoverflow.com/questions/56568423/typescript-no-index-signature-with-a-parameter-of-type-string-was-found-on-ty/56569217
        for (let level = 0; level < order.level; level ++) {
          const index = this.faceIndicesHelper[order.face as keyof FaceIndicesHelper](i, j, level)
          this.rotationGroup.push(this.meshs[index])
        }
      }
    }
    console.log(this.rotationGroup)
  }

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
