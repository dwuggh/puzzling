import * as THREE from 'three'

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

export class BaseMesh extends THREE.Mesh {
  constructor() {
    super()
    new THREE.MeshBasicMaterial()
  }
}
