import * as THREE from "three"
import { MathUtils } from "three"
import { loaders, renderer, scene } from "./Experience"

import earthVertexShader from "../../shaders/earth/vertex.glsl?raw"
import earthFragmentShader from "../../shaders/earth/fragment.glsl?raw"

export class Earth {
  constructor() {
    this.setTextures()
    this.setEarth()
    this.setClouds()

    //const directionalLight = new THREE.DirectionalLight("#ffffe6", 2)
    //directionalLight.position.set(1, 0, 0)
    //scene.add(directionalLight)

    //const ambientLight = new THREE.AmbientLight("#ffffff", 2)
    //scene.add(ambientLight)
  }

  setTextures() {
    this.earthDayColorTexture = loaders.textureLoader.load(
      "/textures/earth-day-color.jpg",
    )
    // this.earthDayColorTexture.colorSpace = THREE.SRGBColorSpace
    setTimeout(() => {
      this.earthDayColorTexture.anisotropy =
        renderer.renderer.capabilities.getMaxAnisotropy()
    }, 1000)

    this.earthNightColorTexture = loaders.textureLoader.load(
      "/textures/earth-night-color.jpg",
    )
    this.earthNightColorTexture.colorSpace = THREE.SRGBColorSpace

    this.earthRoughnessTexture = loaders.textureLoader.load(
      "/textures/earth-roughness.jpg",
    )
    this.earthRoughnessTexture.colorSpace = THREE.SRGBColorSpace

    this.cloudsTexture = loaders.textureLoader.load(
      "/textures/earth-clouds.jpg",
    )
    this.cloudsTexture.colorSpace = THREE.SRGBColorSpace
  }

  setEarth() {
    this.earthMaterial = new THREE.ShaderMaterial({
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader,

      uniforms: {
        uColorTexture: { value: this.earthDayColorTexture },
      },
    })

    this.earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      this.earthMaterial,
    )
    //Earth tilt
    this.earth.rotateZ(MathUtils.degToRad(23.5))
    scene.add(this.earth)
  }

  setClouds() {
    this.cloudsMaterial = new THREE.ShaderMaterial({ transparent: true })

    this.clouds = new THREE.Mesh(
      new THREE.SphereGeometry(1.02, 32, 32),
      this.cloudsMaterial,
    )
    //scene.add(this.clouds)
  }

  update(deltaTime) {
    this.earth.rotateY(deltaTime * 0.0001)
  }
}
