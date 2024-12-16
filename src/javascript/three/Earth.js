import * as THREE from "three/webgpu"
import {
  vec4,
  vec3,
  sub,
  texture,
  uv,
  mul,
  mix,
  color,
  normalWorld,
  smoothstep,
} from "three/webgpu"
import { loaders, renderer, scene } from "./Experience"

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
    this.earthDayColorTexture.colorSpace = THREE.SRGBColorSpace

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
    //Add this to make texture not as blurry when viewing from an angle
    //this.cloudsTexture.anisotropy =
    //  renderer.renderer.capabilities.getMaxAnisotropy()
  }

  setEarth() {
    this.earthMaterial = new THREE.MeshBasicNodeMaterial()

    // Color
    //this.earthMaterial.colorNode = texture(this.earthColorTexture, uv())
    const color1 = texture(this.earthDayColorTexture, uv())
    const color2 = texture(this.earthNightColorTexture, uv())
    const mixFactor = smoothstep(-0.04, 0.04, normalWorld.x)

    this.earthMaterial.colorNode = mix(color1, color2, mixFactor)

    // Roughness
    this.earthMaterial.roughnessNode = sub(
      1,
      texture(this.earthRoughnessTexture, uv()),
    )

    // Not sure if this is needed
    //this.earthMaterial.lightingModelNode = THREE.physicalLightingModel

    this.earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      this.earthMaterial,
    )

    scene.add(this.earth)
  }

  setClouds() {
    this.cloudsMaterial = new THREE.MeshBasicNodeMaterial({ transparent: true })

    this.cloudsMaterial.colorNode = color(vec3(1))

    const mixFactor = smoothstep(-0.04, 0.04, normalWorld.x)

    //this.cloudsMaterial.opacityNode = texture(this.cloudsTexture, uv()).mul(1)
    this.cloudsMaterial.opacityNode = mix(
      texture(this.cloudsTexture, uv()),
      vec3(0.0),
      mixFactor,
    )

    this.clouds = new THREE.Mesh(
      new THREE.SphereGeometry(1.02, 32, 32),
      this.cloudsMaterial,
    )
    scene.add(this.clouds)
  }
}
