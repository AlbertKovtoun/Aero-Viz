import * as THREE from "three/webgpu"
import { scene } from "./Experience"
import { color, mul } from "three/tsl"

export class Sun {
  constructor() {
    const sunMaterial = new THREE.MeshStandardNodeMaterial()
    sunMaterial.emissiveNode = color("#ffffff").mul(2)

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 64, 64),
      sunMaterial,
    )
    sun.position.set(80, 0, 0)
    scene.add(sun)
  }
}
