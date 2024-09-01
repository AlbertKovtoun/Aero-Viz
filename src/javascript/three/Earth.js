import * as THREE from "three"
import { scene } from "./Experience"

export class Earth {
  constructor() {
    this.setEarth()
  }

  setEarth() {
    this.earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshBasicMaterial({ color: "blue" }),
    )
    this.earth.position.x = 2
    scene.add(this.earth)
  }
}
