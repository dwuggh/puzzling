import * as THREE from 'three'
declare type state = number[]
declare type stateMap = [state, state]
declare type order = [string, stateMap]
interface RegularModel {
    meshs: THREE.Mesh[]
    orderSet: order[]
}
export declare class RubiksCube implements RegularModel {
    layer: number
    meshs: THREE.Mesh[]
    orderSet: order[]
    state: state
    flag: boolean
    constructor(layer: number)
    performOrder(ord: order): void
    performOrderList(ords: order[]): void
    scramble(): state
    static solve(layer: any, state: state): order[]
    solve(): order[]
    private _generateMeshs
    private _generateOrder
    private _generateOrderSet
}
export {}
