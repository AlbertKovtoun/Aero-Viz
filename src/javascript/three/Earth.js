import * as THREE from "three/webgpu"
import { vec4, vec3, sub, texture, uv } from "three/webgpu"
import { loaders, scene } from "./Experience"

export class Earth {
  constructor() {
    this.setTextures()
    this.setEarth()

    const directionalLight = new THREE.DirectionalLight("#ffffe6", 2)
    directionalLight.position.set(0, 0, 1)
    scene.add(directionalLight)
  }

  setTextures() {
    this.earthColorTexture = loaders.textureLoader.load(
      "/textures/earth-color.jpg",
    )
    this.earthColorTexture.colorSpace = THREE.SRGBColorSpace

    this.earthRoughnessTexture = loaders.textureLoader.load(
      "/textures/earth-roughness.jpg",
    )
    this.earthRoughnessTexture.colorSpace = THREE.SRGBColorSpace
  }

  setEarth() {
    this.earthMaterial = new THREE.MeshStandardNodeMaterial()
    this.earthMaterial.colorNode = texture(this.earthColorTexture, uv())
    this.earthMaterial.roughnessNode = sub(
      1,
      texture(this.earthRoughnessTexture, uv()),
    )
    this.earthMaterial.lightingModelNode = THREE.physicalLightingModel

    this.earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      this.earthMaterial,
    )

    scene.add(this.earth)
  }
}
