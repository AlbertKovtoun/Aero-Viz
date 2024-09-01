import * as THREE from "three"
import { loaders, scene } from "./Experience"

export class Earth {
  constructor() {
    this.setEarth()
  }

  setEarth() {
    this.texture = loaders.textureLoader.load("/textures/earth.jpg")
    this.texture.colorSpace = THREE.SRGBColorSpace

    this.earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshBasicMaterial({
        map: this.texture,
      }),
    )
    scene.add(this.earth)
  }
}
