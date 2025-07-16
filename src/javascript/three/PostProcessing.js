import * as THREE from "three/webgpu"

import { pass, mrt, output, emissive } from "three/tsl"
import { bloom } from "three/addons/tsl/display/BloomNode.js"

import { camera, renderer, scene } from "./Experience"

export class PostProcessing {
  constructor() {
    this.scenePass = pass(scene, camera.camera)
    this.scenePass.setMRT(mrt({ output, emissive }))

    this.outputPass = this.scenePass.getTextureNode()
    this.emissivePass = this.scenePass.getTextureNode("emissive")

    this.bloomPass = bloom(this.emissivePass, 0.8, 1)

    this.postProcessing = new THREE.PostProcessing(renderer.renderer)
    this.postProcessing.outputNode = this.outputPass.add(this.bloomPass)
  }
}
