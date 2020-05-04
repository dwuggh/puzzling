import { RubiksCube } from './RubiksCube'
import { Order } from './Order'
type Key = string

export class KeyMap {
  R: Key
  Rp: Key
  L: Key
  Lp: Key
  U: Key
  Up: Key
  D: Key
  Dp: Key
  F: Key
  Fp: Key
  B: Key
  Bp: Key

  X: Key
  Xp: Key
  Y: Key
  Yp: Key
  Z: Key
  Zp: Key
  constructor(defaults = 1, map?: Key[]) {
    if (defaults == 1) {
      this.R = 'KeyR'
      this.Rp = 'KeyG'
      this.L = 'KeyL'
      this.Lp = 'KeyH'
      this.U = 'KeyU'
      this.Up = 'KeyJ'
      this.D = 'KeyD'
      this.Dp = 'KeyK'
      this.F = 'KeyF'
      this.Fp = 'KeyV'
      this.B = 'KeyB'
      this.Bp = 'KeyN'
      this.X = 'KeyX'
      this.Xp = 'KeyC'
      this.Y = 'KeyY'
      this.Yp = 'KeyT'
      this.Z = 'KeyZ'
      this.Zp = 'KeyA'
    } else if (defaults == 2) {
      this.R = 'KeyR'
      this.Rp = 'KeyF'
      this.L = 'KeyI'
      this.Lp = 'KeyK'
      this.U = 'KeyU'
      this.Up = 'KeyJ'
      this.D = 'KeyE'
      this.Dp = 'KeyD'
      this.F = 'KeyO'
      this.Fp = 'KeyL'
      this.B = 'KeyW'
      this.Bp = 'KeyS'
      this.X = 'KeyX'
      this.Xp = 'KeyC'
      this.Y = 'KeyY'
      this.Yp = 'KeyT'
      this.Z = 'KeyZ'
      this.Zp = 'KeyA'
    } else {
      if (map!.length < 18) {
        throw new Error('keymap length too small')
        return
      }
      this.R = map[0]
      this.Rp = map[1]
      this.L = map[2]
      this.Lp = map[3]
      this.U = map[4]
      this.Up = map[5]
      this.D = map[6]
      this.Dp = map[7]
      this.F = map[8]
      this.Fp = map[9]
      this.B = map[10]
      this.Bp = map[11]
      this.X = map[12]
      this.Xp = map[13]
      this.Y = map[14]
      this.Yp = map[15]
      this.Z = map[16]
      this.Zp = map[17]
    }
  }

  public listen(key: Key, cube: RubiksCube) {
    switch (key) {
      case this.R:
        cube.orderQueue.unshift(new Order('R'))
        break
      case this.Rp:
        cube.orderQueue.unshift(new Order("R'"))
        break
      case this.L:
        cube.orderQueue.unshift(new Order('L'))
        break
      case this.Lp:
        cube.orderQueue.unshift(new Order("L'"))
        break
      case this.U:
        cube.orderQueue.unshift(new Order('U'))
        break
      case this.Up:
        cube.orderQueue.unshift(new Order("U'"))
        break
      case this.D:
        cube.orderQueue.unshift(new Order('D'))
        break
      case this.Dp:
        cube.orderQueue.unshift(new Order("D'"))
        break
      case this.F:
        cube.orderQueue.unshift(new Order('F'))
        break
      case this.Fp:
        cube.orderQueue.unshift(new Order("F'"))
        break
      case this.B:
        cube.orderQueue.unshift(new Order('B'))
        break
      case this.Bp:
        cube.orderQueue.unshift(new Order("B'"))
        break
      case this.X:
        cube.orderQueue.unshift(new Order('3R'))
        break
      case this.Xp:
        cube.orderQueue.unshift(new Order('3L'))
        break
      case this.Y:
        cube.orderQueue.unshift(new Order('3U'))
        break
      case this.Yp:
        cube.orderQueue.unshift(new Order('3D'))
        break
      case this.Z:
        cube.orderQueue.unshift(new Order('3F'))
        break
      case this.Zp:
        cube.orderQueue.unshift(new Order('3B'))
        break
      default:
        return
    }
  }
}
