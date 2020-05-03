import * as THREE from 'three'
// import { TaskRunner } from './Scenario'
// declare module '*.png'
import * as BLUE from '../assets/cubes/blue.png'
import * as GREEN from '../assets/cubes/green.png'
import * as ORANGE from '../assets/cubes/orange.png'
import * as RED from '../assets/cubes/red.png'
import * as WHITE from '../assets/cubes/white.png'
import * as YELLOW from '../assets/cubes/yellow.png'

import { state, Order } from './order'

/*
  the interface to load all three-created regular cube models
  some types of cube's rotation layer can transfrom between moves, which cannot be described by the following order set.
*/
interface RegularModel {
  meshs: THREE.Mesh[]
  orderSet: Order[]
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
  // scene: THREE.Scene
  layer: number
  meshs: THREE.Mesh[]
  group: THREE.Group
  cubeMat: THREE.Mesh[][][]
  orderSet: Order[]
  state: state
  test = true
  // taskRunner: TaskRunner
  flag: boolean //flag for whether rotating or not
  subgroup: THREE.Group
  rotationGroup: THREE.Object3D[]
  axisX: THREE.Vector3
  axisY: THREE.Vector3
  axisZ: THREE.Vector3

  readonly MoveDict: {
    R: (i: number, j: number) => number
    L: (i: number, j: number) => number
    U: (i: number, j: number) => number
    D: (i: number, j: number) => number
    F: (i: number, j: number) => number
    B: (i: number, j: number) => number
  }

  constructor(layer: number) {
    this.layer = layer
    this.meshs = []
    this.cubeMat = []
    this.orderSet = []

    // initiate a 3D array
    for (let i = 0; i < layer; i++) {
      this.cubeMat.push([])
      for (let j = 0; j < layer; j++) {
        this.cubeMat[i].push(new Array(3))
      }
    }
    this.group = new THREE.Group()
    this.subgroup = new THREE.Group()
    this.rotationGroup = []

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
    // this.orderSet = this._generateOrderSet()
    this.flag = false

    // this.scene.add(this.group)

    // set current state to standard state
    this.state = new Array(layer * layer * layer)
    for (let i = 0; i < this.state.length; i++) {
      this.state[i] = i
    }
    // construct rotation subgroup
    this.MoveDict = {
      B: (i: number, j: number) => {
        return i * this.layer * this.layer + j * this.layer
      },

      F: (i: number, j: number) => {
        return i * this.layer * this.layer + j * this.layer + this.layer - 1
      },
      U: (i: number, j: number) => {
        return i * this.layer * this.layer + (this.layer - 1) * this.layer + j
      },
      D: (i: number, j: number) => {
        return i * this.layer * this.layer + 0 * this.layer + j
      },
      L: (i: number, j: number) => {
        return 0 * this.layer * this.layer + i * this.layer + j
      },
      R: (i: number, j: number) => {
        return (this.layer - 1) * this.layer * this.layer + i * this.layer + j
      },
    }
    // this.taskRunner = taskRunner
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
        // console.log(this.cubeMat[i][j][2])
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
    //TODO RED texture cound not show
    const stickers = [WHITE, ORANGE, WHITE, YELLOW, GREEN, BLUE]

    const stickerSetting = {
      transparent: false,
      map: new THREE.TextureLoader().load(stickers[color]),
    }
    // console.log('../assets/cubes/' + stickers[color] + '.svg')
    return stickerSetting
  }

  /*
    peek the last order of this.orderSet
    if this order hasn't be done, set this.flag = true and perform next step of this order
    if this order is done, remove it from this.orderSet.
    */
  public update(): void {
    // this.group.rotation.x += 0.01
    // this.group.rotation.y += 0.01
    // this.group.rotation.z += 0.01
    if (this.test) {
      this.test = false
      // this._addSubGroup('F')
      // this.subgroup.rotation.z += Math.PI / 1
      // this._dismissSubGroup()
      // this._addSubGroup('R')
      // this.subgroup.rotation.x += Math.PI / 2
      // this._dismissSubGroup()
      console.log(this.subgroup.rotation)
    }

    // get next order (in progress or not)
    if (this.orderSet.length == 0) {
      return
    } else {
      const nextOrder = this.orderSet[this.orderSet.length - 1]
      this.performOrder(nextOrder)
    }
  }

  public performOrder(order: Order): void {
    // console.log('performing order', order.face)
    let axis: THREE.Vector3
    switch (order.face) {
      case 'R':
        axis = this.axisX.clone().negate()
        break
      case 'L':
        axis = this.axisX
        break
      case 'D':
        axis = this.axisY.clone().negate()
        break
      case 'U':
        axis = this.axisY
        break
      case 'B':
        axis = this.axisZ.clone().negate()
        break
      case 'F':
        axis = this.axisZ
        break
      default:
        axis = undefined
    }
    // console.log(axis)
    // if (this.flag) {
    // const angle = (this.subgroup.rotation as any)[axis]
    // console.log(angle)
    // if (angle < Math.PI / 2 * order.degree) {
    //   (this.subgroup.rotation as any)[axis] = Math.PI / 2 * order.degree
    //   this.flag = false
    //   this.orderSet.pop()
    //   this._dismissSubGroup(Order.clockwiseStateMap(this.layer, order.face))
    // }
    // (this.subgroup.rotation as any)[axis] += order.direction ? 0.01 : -0.01
    // if (order.direction) this.group.rotation[axis] += 0.01
    // else this.group.rotation[axis] -= 0.01
    // }
    // this._addSubGroup(order.face)

    const angle = 0.01
    if (this.flag) {
      // return
      const remainAngle = order.getRemainingAngle()
      // if the angle from target point is too small
      if (remainAngle < 0.01) {
        this._rotateGroupFromAxisAngle(axis, remainAngle)
        this.flag = false
        this.orderSet.pop()
        this.rotationGroup = []

        const oldState: state = []
        const oldMeshs: THREE.Mesh[] = []
        for (let i = 0; i < this.layer ** 3; i ++) {
          oldState.push(this.state[i])
          oldMeshs.push(this.meshs[i])
        }
        // update current state in accordance to order
        const target = Order.clockwiseStateMap(this.layer, order.face)
        target.forEach((value: number, index: number) => {
          this.state[index] = oldState[value]
          this.meshs[index] = oldMeshs[value]
        })
        console.log(this.meshs, oldMeshs)
        // console.log(oldState, this.state)
        // rearrange meshs
        return
      } else {
        // if not, rotate a fixed degree
        // TODO: better animation
        this._rotateGroupFromAxisAngle(axis, angle)
        order.rotatedDegree += angle
      }
    } else {
      this._setRotationGroup(order.face)
      // this._rotateGroupFromAxisAngle(order.face, axis, 0.5)
      this._rotateGroupFromAxisAngle(axis, angle)
      // this.rotationGroup = []
      this.flag = true
      order.rotatedDegree += angle
    }
  }

  private _rotateGroupFromAxisAngle(axis: THREE.Vector3, angle: number) {
    // console.log(this.rotationGroup, axis)
    for (const obj of this.rotationGroup) {
      // rubiksCube.setRotationFromAxisAngle(axis, angle)
      const pos = obj.position.clone()
      pos.applyAxisAngle(axis, angle)
      obj.rotateOnWorldAxis(axis, angle)
      // console.log(rubiksCube.name, rubiksCube.position)
      obj.position.copy(pos)
      // console.log(rubiksCube.name, rubiksCube.position)
    }
  }

  private _setRotationGroup(floor: string) {
    // rotationGroup must be empty
    this.rotationGroup = []
    for (let i = 0; i < this.layer; i++) {
      for (let j = 0; j < this.layer; j++) {
        // https://stackoverflow.com/questions/56568423/typescript-no-index-signature-with-a-parameter-of-type-string-was-found-on-ty/56569217
        const index = (this.MoveDict as any)[floor](i, j)
        this.rotationGroup.push(this.meshs[index])
      }
    }
  }

  private _addSubGroup(floor: string) {
    for (let i = 0; i < this.layer; i++) {
      for (let j = 0; j < this.layer; j++) {
        // https://stackoverflow.com/questions/56568423/typescript-no-index-signature-with-a-parameter-of-type-string-was-found-on-ty/56569217
        const index = (this.MoveDict as any)[floor](i, j)
        this.subgroup.add(this.meshs[index])
      }
    }
    this.group.add(this.subgroup)
  }

  private _dismissSubGroup(target: state) {
    const oldState: state = []
    this.state.forEach((val: number) => {
      oldState.push(val)
    })
    // update current state in accordance to order
    target.forEach((value: number, index: number) => {
      this.state[index] = oldState[value]
    })
    console.log(oldState)
    console.log(target)
    // move subgroup elements back to this.group
    // this.subgroup.children.forEach((val) => {
    //   this.group.add(val)
    // })
    for (let i = 0; i < this.subgroup.children.length; i++) {
      // console.log(child)
      // this.group.attach(this.subgroup.children[i])
    }
    console.log(this.subgroup.children)
    // (optional) remove subgroup from group
    this.group.remove(this.subgroup)
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
