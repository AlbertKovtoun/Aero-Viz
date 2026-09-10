import * as THREE from "three/webgpu"
import { loaders, scene } from "./Experience"

export class Environment {
  constructor() {
    // loaders.rgbeLoader.load("/envmap/map.hdr", (environmentMap) => {
    //   environmentMap.mapping = THREE.EquirectangularReflectionMapping
    //
    //   // scene.environment = environmentMap
    //   scene.background = environmentMap
    // })

    loaders.cubeTextureLoader.setPath("/envmap/")

    this.environmentTexture = loaders.cubeTextureLoader.load([
      "px.png",
      "nx.png",
      "py.png",
      "ny.png",
      "pz.png",
      "nz.png",
    ])
    scene.background = this.environmentTexture
  }
}
