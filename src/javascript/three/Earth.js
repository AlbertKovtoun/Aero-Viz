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
  oneMinus,
  pow,
  normalize,
  reflect,
  max,
  cameraPosition,
  positionWorld,
  add,
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
      "/textures/earth-day-color-2.jpg",
    )
    this.earthDayColorTexture.colorSpace = THREE.SRGBColorSpace
    this.earthDayColorTexture.anisotropy = 8

    this.earthNightColorTexture = loaders.textureLoader.load(
      "/textures/earth-night-color-2.jpg",
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
    this.cloudsTexture.anisotropy = 8
  }

  setEarthMaterial() {
    this.earthMaterial = new THREE.MeshBasicNodeMaterial()

    const viewDirection = normalize(cameraPosition.sub(positionWorld))

    // Color
    const dayColor = texture(this.earthDayColorTexture, uv())
    const nightColor = texture(this.earthNightColorTexture, uv())

    // Roughness
    const roughness = texture(this.earthRoughnessTexture, uv())

    // Lighting
    const sunDirection = normalize(vec3(1.0, 0.2, 0.0))
    const sunLight = dot(sunDirection, normalWorld)

    // Mix day and night textures based on sunlight
    let color = mix(nightColor, dayColor, smoothstep(-0.2, 0.5, sunLight))

    // Specular Highlight
    const reflectedLight = normalize(
      reflect(sunDirection.negate(), normalWorld),
    )
    let phongValue = max(0.0, dot(viewDirection, reflectedLight))
    phongValue = pow(phongValue, 128.0)

    const specularColor = vec3(1.0, 1.0, 1.0)
    const specular = specularColor.mul(phongValue.mul(roughness))

    const finalColor = color.rgb.add(specular)

    this.earthMaterial.colorNode = finalColor

    return this.earthMaterial
  }

  setEarth() {
    this.earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      this.setEarthMaterial(),
    )
    scene.add(this.earth)
  }

  setClouds() {
    this.cloudsMaterial = new THREE.MeshBasicNodeMaterial({ transparent: true })

    this.cloudsMaterial.colorNode = color(vec3(1))

    const sunDirection = vec3(1.0, 0.2, 0.0)
    const sunLight = dot(sunDirection, normalWorld)

    this.cloudsMaterial.opacityNode = texture(this.cloudsTexture, uv()).mul(
      smoothstep(-0.4, 0.5, sunLight),
    )

    this.clouds = new THREE.Mesh(
      new THREE.SphereGeometry(1.01, 64, 64),
      this.cloudsMaterial,
    )
    // scene.add(this.clouds)
  }

  update(deltaTime) {
    // this.earth.rotateY(deltaTime * 0.0001)
    // this.clouds.rotateY(deltaTime * 0.0001)
  }
}
