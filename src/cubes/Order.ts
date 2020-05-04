import * as THREE from 'three'

/*
  class Order recieve and parse an rotation order for later use.
  the order should look like this:
  ?[0-9]{R, L, U, D, F, B}?{', 0-9}?{', 0-9}
  number of layer(s) -- face -- moveCount(per 90) -- '(clockwise or not)
  examples: 2R, L3, U', D13, 2F3', 2F'3, etc
*/
export type state = number[]

export enum Direction {
  counterClockwise,
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
  targetState: state

  constructor(name: string, layer = 3) {
    this.name = name
    this.layer = layer
    const a = name[0]
    if (isNaN(Number(a))) {
      this.level = 1
      this.face = a
      name = name.substr(1)
    } else {
      if (Number(a) == 0) {
        throw new Error('class Order: level too small')
      } else if (Number(a) > layer) {
        throw new Error('class Order: level is larger than layer')
      } else {
        console.log(a)
        this.level = Number(a)
        this.face = name[1]
        name = name.substr(2)
      }
    }
    // TODO add level parse
    // TODO clean code, better method
    // this.face = name[0]
    this.rotatedDegree = 0

    // console.log(this.level)
    if (name.length == 0) {
      this.direction = Direction.clockwise
      this.moveCount = 1
    } else if (name[0] == "'") {
      this.moveCount = 1
      this.direction = Direction.counterClockwise
    } else {
      this.moveCount = Number(name[0])
      this.direction =
        name.length == 1 ? Direction.clockwise : Direction.counterClockwise
    }
    // this.level = 1
    // if (this.layer <= this.level) {
    //   throw new Error('invalid order: too many layers')
    // }
    this.targetState =
      this.direction == Direction.clockwise
        ? this._clockwiseStateMap()
        : this._counterClockwiseStateMap()
  }

  /*
    return radian angle to rotate
  */
  public getRemainingAngle(): number {
    const total = (this.moveCount * Math.PI) / 2
    if (this.rotatedDegree > 0) {
      return total - this.rotatedDegree
    } else {
      return -this.rotatedDegree - total
    }
    // return Math.abs(total - Math.abs(this.rotatedDegree))
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
  public static clockwiseStateMap(layer: number, face: string): state {
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
            posTo = new THREE.Vector3(0, lay - j, i)
            break
          case 'F':
            posFrom = new THREE.Vector3(i, j, 2)
            posTo = new THREE.Vector3(j, lay - i, 2)
            break
          case 'B':
            posFrom = new THREE.Vector3(i, j, 0)
            posTo = new THREE.Vector3(lay - j, i, 0)
            break
          case 'D':
            posFrom = new THREE.Vector3(i, 0, j)
            posTo = new THREE.Vector3(j, 0, lay - i)
            break
          case 'U':
            posFrom = new THREE.Vector3(i, 2, j)
            posTo = new THREE.Vector3(lay - j, 2, i)
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
  private _clockwiseStateMap(): state {
    const target = new Array(this.layer ** 3)
    const antiTarget = this._counterClockwiseStateMap()
    antiTarget.forEach((value: number, index: number) => {
      target[value] = index
    })
    return target
  }
  private _counterClockwiseStateMap(): state {
    const lay = this.layer - 1
    const target = new Array(this.layer ** 3)

    // set target to standard form first
    for (let i = 0; i < target.length; i++) {
      target[i] = i
    }

    const layerVec = new THREE.Vector3(this.layer ** 2, this.layer, 1)
    for (let i = 0; i < this.layer; i++) {
      for (let j = 0; j < this.layer; j++) {
        for (let level = 0; level < this.level; level++) {
          let posFrom: THREE.Vector3
          let posTo: THREE.Vector3
          switch (this.face) {
            case 'R':
              posFrom = new THREE.Vector3(lay - level, i, j)
              posTo = new THREE.Vector3(lay - level, lay - j, i)
              break
            case 'L':
              posFrom = new THREE.Vector3(level, i, j)
              posTo = new THREE.Vector3(level, j, lay - i)
              break
            case 'F':
              posFrom = new THREE.Vector3(i, j, lay - level)
              posTo = new THREE.Vector3(lay - j, i, lay - level)
              break
            case 'B':
              posFrom = new THREE.Vector3(i, j, level)
              posTo = new THREE.Vector3(j, lay - i, level)
              break
            case 'D':
              posFrom = new THREE.Vector3(i, level, j)
              posTo = new THREE.Vector3(lay - j, level, i)
              break
            case 'U':
              posFrom = new THREE.Vector3(i, lay - level, j)
              posTo = new THREE.Vector3(j, lay - level, lay - i)
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
    }
    return target
  }
  // private _counterClockwiseStateMap(): state {
  //   return Order.counterClockwiseStateMap(this.layer, this.face)
  // }
}
