import * as THREE from 'three'

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

/*
  create a N layer rubik's cube.
*/

export class RubiksCube implements RegularModel {
    layer: number
    meshs: THREE.Mesh[]
    orderSet: order[]
    state: state
    flag: boolean //flag for whether rotating or not

    constructor(layer: number) {
        this.layer = layer
        this.meshs = this._generateMeshs()
        this.orderSet = this._generateOrderSet()
        this.flag = false

        // set current state to standard state
        this.state = new Array(layer * layer * layer)
        this.state.forEach((val, index, arr) => {
            val = index
        })
    }

    public performOrder(ord: order): void {}
    public performOrderList(ords: order[]): void {}

    // randomly scramble this cube and return afterward state
    public scramble(): state {}

    // solve a cube with given/current state, return orders list
    public static solve(layer, state: state): order[]
    public solve(): order[] {
        return RubiksCube.solve(this.layer, this.state)
    }

    private _generateMeshs(): THREE.Mesh[] {}

    private _generateOrder(): order {}

    private _generateOrderSet(): order[] {}
}
