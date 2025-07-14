import * as THREE from "three/webgpu"
import { loaders, scene } from "./Experience"

export class Environment {
  constructor() {
    // loaders.rgbeLoader.load("/envmap/map.hdr", (environmentMap) => {
    //   environmentMap.mapping = THREE.EquirectangularReflectionMapping
    //
    //   scene.environment = environmentMap
    //   scene.background = environmentMap
    // })
  }
}
