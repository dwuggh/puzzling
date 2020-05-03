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


/*
  the Order class.
  parse an order and set state map accordingly
  also cache the rotated angle for use
 */
export class Order {
  name: string
  level: number
  face: string
  moveCount: number
  rotatedDegree: number
  direction: Direction
  layer: number
  // targetState: state

  constructor(name: string, layer: number) {
    this.name = name
    this.layer = layer
    // TODO add layer parse
    // TODO clean code, better method
    this.face = name[0]
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

  /*
    return radian angle to rotate
  */
  public getRemainingAngle(): number {
    const total = (this.level * Math.PI) / 2
    return Math.abs(total - this.rotatedDegree)
  }

  /*
    this function generates given face's 90-degree-clockwise-move's targetState, with standard state as start Vector.
    consider one face with coordinate (i, j):
    let mid = layer / 2
    let lay = layer - 1
    (i, j) - (mid, mid) = (i - mid, j - mid)
    after clockwise pi/2:
    (j-mid, mid - i)
    finally we get the coordinate:
    (j, lay - i)
  */
  public static clockwiseStateMap(layer: number, face: string): number[] {
    const lay = layer - 1
    const target = new Array(layer ** 3)

    // set target to standard form first
    for (let i = 0; i < target.length; i++) {
      target[i] = i
    }

    const layerVec = new THREE.Vector3(layer ** 2, layer, 1)
    for (let i = 0; i < layer; i++) {
      for (let j = 0; j < layer; j++) {
        let posFrom: THREE.Vector3
        let posTo: THREE.Vector3
        switch (face) {
          case 'R':
            posFrom = new THREE.Vector3(2, i, j)
            posTo = new THREE.Vector3(2, j, lay - i)
            break
          case 'L':
            posFrom = new THREE.Vector3(0, i, j)
            posTo = new THREE.Vector3(0, j, lay - i)
            break
          case 'F':
            posFrom = new THREE.Vector3(i, j, 2)
            posTo = new THREE.Vector3(j, lay - i, 2)
            break
          case 'B':
            posFrom = new THREE.Vector3(i, j, 0)
            posTo = new THREE.Vector3(j, lay - i, 0)
            break
          case 'U':
            posFrom = new THREE.Vector3(i, 2, j)
            posTo = new THREE.Vector3(j, 2, lay - i)
            break
          case 'D':
            posFrom = new THREE.Vector3(i, 0, j)
            posTo = new THREE.Vector3(j, 0, lay - i)
            break
          default:
            posFrom = new THREE.Vector3(0, 0, 0)
            posTo = new THREE.Vector3(0, 0, 0)
        }
        const from_ = layerVec.dot(posFrom)
        const to_ = layerVec.dot(posTo)
        target[to_] = from_
      }
    }
    return target
  }
}
