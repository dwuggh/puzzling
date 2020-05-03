import * as THREE from 'three'

/*
  class Order recieve and parse an rotation order for later use.
  the order should look like this:
  ?[0-9]{R, L, U, D, F, B}?{', 0-9}?{', 0-9}
  number of layer(s) -- face -- moveCount(per 90) -- '(clockwise or not)
  examples: 2R, L3, U', D13, 2F3', 2F'3, etc
*/
export type state = number[]
export enum Faces {
  R = 'R',
  L = 'L',
  U = 'U',
  D = 'D',
  F = 'F',
  B = 'B',
}
enum Direction {
  anticlockwise,
  clockwise,
}

// enum FaceGroup {
//   R = (i: number, j: number, layer: number) => {
//     return i * layer * layer + j * layer
//   },
//   L = (i: number, j: number, layer: number) => {
//     return i * layer * layer + j * layer + layer - 1
//   },
//   U = (i: number, j: number, layer: number) => {
//     return i * layer * layer + (layer - 1) * layer + j
//   },
//   D = (i: number, j: number, layer: number) => {
//     return i * layer * layer + 0 * layer + j
//   },
//   F = (i: number, j: number, layer: number) => {
//     return 0 * layer * layer + i * layer + j
//   },
//   B = (i: number, j: number, layer: number) => {
//     return (layer - 1) * layer * layer + i * layer + j
//   },
// }

class Vector {
  x: number
  y: number
  z: number

  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  public static dot(p1: Vector, p2: Vector) {
    return p1.x * p2.x + p1.y * p2.y + p1.z * p2.z
  }
}

export class Order {
  name: string
  level: number
  face: Faces
  moveCount: number
  rotatedDegree: number
  direction: Direction
  layer: number
  targetState: state

  constructor(name: string, toState: state, layer: number) {
    this.name = name
    this.targetState = toState
    this.layer = layer
    // TODO add layer parse
    // TODO clean code, better method
    this.face = (Faces as any)[name]
    this.rotatedDegree = 0
    if (name.length == 1) {
      this.direction = Direction.clockwise
      this.moveCount = 1
    } else if (name[1] == "'") {
      this.moveCount = 1
      this.direction = Direction.anticlockwise
    } else {
      this.moveCount = Number(name[1])
      this.direction =
        name.length == 2 ? Direction.clockwise : Direction.anticlockwise
    }
    this.level = 1
    if (this.layer <= this.level) {
      throw new Error('invalid order: too many layers')
    }
  }

  // public set rotatedDegree(value: number) {
  //   this.rotatedDegree = Math.abs(value)
  // }

  public getRemainingAngle(): number {
    const total = this.level * Math.PI / 2
    return Math.abs(total - this.rotatedDegree)
  }

  /*
    this function generates given face's 90-degree-clockwise-move's targetState, with standard state as start Vector.
    consider one face with coordinate (i, j):
    mid = layer / 2
    if j < mid :
        (i, j) => (j, layer - 1 - i)
    if j >= mid :
        (i, j) => (layer - 1 - j, i)
  */
  public static clockwiseStateMap(layer: number, face: Faces): number[] {
    const mid = layer / 2
    const lay = layer - 1
    const target = new Array(layer * layer * layer)
    // target.forEach((val, ind) => {
    //   target[ind] = ind
    // })
    for (let i = 0; i < target.length; i++) {
      target[i] = i
    }

    const layerVec = new Vector(layer * layer, layer, 1)
    for (let i = 0; i < layer; i++) {
      for (let j = 0; j < layer; j++) {
        // TODO: clean code
        let p: Vector
        let k: Vector
        switch (face) {
          case Faces.R:
            p = new Vector(2, i, j)
            k = new Vector(2, j, lay - i)
            break
          case Faces.L:
            p = new Vector(0, i, j)
            k = new Vector(0, j, lay - i)
            break
          case Faces.F:
            p = new Vector(i, j, 2)
            k = new Vector(j, lay - i, 2)
            break
          case Faces.B:
            p = new Vector(i, j, 0)
            k = new Vector(j, lay - i, 0)
            break
          case Faces.U:
            p = new Vector(i, 2, j)
            k = new Vector(j, 2, lay - i)
            break
          case Faces.D:
            p = new Vector(i, 0, j)
            k = new Vector(j, 0, lay - i)
            break
        }
        const from_ = Vector.dot(p, layerVec)
        const to_ = Vector.dot(k, layerVec)
        target[to_] = from_
      }
    }
    return target
  }

  // public static xyzState(layer: number, axis: string, target: Array) {}
}


/*
  (i, j)
  (mid, mid)
  (i - mid, j - mid)
  (j-mid, mid - i)
  (j, lay - i)
*/
