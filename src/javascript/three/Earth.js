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
  dot,
} from "three/tsl"
import { loaders, renderer, scene } from "./Experience"

export class Earth {
  constructor() {
    this.setTextures()
    this.setEarth()
    this.setClouds()
  }

  setTextures() {
    this.earthDayColorTexture = loaders.textureLoader.load(
      "/textures/earth-day-color.jpg",
    )
    this.earthDayColorTexture.colorSpace = THREE.SRGBColorSpace
    this.earthDayColorTexture.anisotropy = 8

    this.earthNightColorTexture = loaders.textureLoader.load(
      "/textures/earth-night-color.jpg",
    )
    this.earthNightColorTexture.colorSpace = THREE.SRGBColorSpace
    this.earthNightColorTexture.anisotropy = 8

    this.earthRoughnessTexture = loaders.textureLoader.load(
      "/textures/earth-roughness.jpg",
    )
    this.earthRoughnessTexture.colorSpace = THREE.SRGBColorSpace

    this.cloudsTexture = loaders.textureLoader.load(
      "/textures/earth-clouds.jpg",
    )
    this.cloudsTexture.colorSpace = THREE.SRGBColorSpace
  }

  setEarthMaterial() {
    this.earthMaterial = new THREE.MeshBasicNodeMaterial()

    // Color
    const dayColor = texture(this.earthDayColorTexture, uv())
    const nightColor = texture(this.earthNightColorTexture, uv())

    //Lighting
    let lighting = vec3(0.0)
    const sunDirection = vec3(-1.0, 0.2, 0.0)
    const sunLight = dot(sunDirection, normalWorld)

    lighting = sunLight.mul(1.0)

    const finalColor = vec3(dayColor).mul(lighting)

    this.earthMaterial.colorNode = finalColor

    // Roughness
    this.earthMaterial.roughnessNode = sub(
      1,
      texture(this.earthRoughnessTexture, uv()),
    )

    // Not sure if this is needed
    //this.earthMaterial.lightingModelNode = THREE.physicalLightingModel

    return this.earthMaterial
  }

  setEarth() {
    this.earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      this.setEarthMaterial(),
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
    //scene.add(this.clouds)
  }

  update(deltaTime) {
    this.earth.rotateY(deltaTime * 0.0001)
  }
}
