import * as THREE from "three/webgpu"
import { vec4, texture, uv } from "three/webgpu"
import { loaders, scene } from "./Experience"

export class Earth {
  constructor() {
    this.setEarth()
  }

  setEarth() {
    this.texture = loaders.textureLoader.load("/textures/earth.jpg")
    this.texture.colorSpace = THREE.SRGBColorSpace

    this.earthMaterial = new THREE.MeshStandardNodeMaterial()
    this.earthMaterial.colorNode = texture(this.texture, uv())
    this.earthMaterial.outputNode = vec4(this.earthMaterial.colorNode)

    this.earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      this.earthMaterial,
    )
    scene.add(this.earth)
  }
}
