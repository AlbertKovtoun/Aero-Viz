import * as THREE from "three/webgpu"
import {
  vec4,
  vec3,
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
  abs,
  sub,
  normalMap,
  mat3,
  tangentWorld,
  bitangentWorld,
} from "three/tsl"
import { loaders, renderer, scene } from "./Experience"

export class Earth {
  constructor() {
    this.setTextures()
    this.setEarth()
    this.setAtmosphere()
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
    this.earthRoughnessTexture.anisotropy = 8

    this.earthNormalTexture = loaders.textureLoader.load(
      "/textures/earth-normal.jpg",
    )
    this.earthNormalTexture.colorSpace = THREE.SRGBColorSpace
    this.earthNormalTexture.anisotropy = 8

    this.cloudsTexture = loaders.textureLoader.load(
      "/textures/earth-clouds.jpg",
    )
    this.cloudsTexture.colorSpace = THREE.SRGBColorSpace
    this.cloudsTexture.anisotropy = 8
  }

  setEarth() {
    this.earthMaterial = new THREE.MeshBasicNodeMaterial()

    const viewDirection = normalize(cameraPosition.sub(positionWorld))

    // Color
    const dayColor = texture(this.earthDayColorTexture, uv())
    const nightColor = texture(this.earthNightColorTexture, uv())

    // Roughness
    const roughnessMap = texture(this.earthRoughnessTexture, uv())

    // Normal
    const normalTexture = texture(this.earthNormalTexture, uv()).rgb

    const tangentSpaceNormal = normalize(normalTexture)

    const TBN = mat3(tangentWorld, bitangentWorld, normalWorld)

    const finalNormal = normalize(TBN.mul(tangentSpaceNormal))

    // Lighting
    const sunDirection = normalize(vec3(1.0, 0.2, 0.0))
    const sunLight = dot(sunDirection, finalNormal)

    // Mix day and night textures based on sunlight
    let diffuse = mix(nightColor, dayColor, smoothstep(-0.2, 0.5, sunLight))

    // Specular Highlight
    const reflectedLight = normalize(
      reflect(sunDirection.negate(), finalNormal),
    )
    let phongValue = max(0.0, dot(viewDirection, reflectedLight))
    phongValue = pow(phongValue, 128.0)

    //Fresnel
    let fresnel = oneMinus(max(0.0, dot(viewDirection, finalNormal)))
    fresnel = pow(fresnel, 2.0)

    const atmosphereColor = vec3(0.4, 0.7, 1.0)
    const sunsetColor = vec3(1.0, 0.2, 0.2)

    const terminatorFactor = oneMinus(smoothstep(0.0, 0.8, abs(sunLight)))
    const dynamicGlowColor = mix(atmosphereColor, sunsetColor, terminatorFactor)

    const nightOcclusion = smoothstep(-0.1, 0.1, sunLight)

    fresnel = fresnel.mul(dynamicGlowColor).mul(nightOcclusion)

    let specularColor = mix(vec3(1.0), dynamicGlowColor, fresnel.mul(2))
    let specular = specularColor.mul(phongValue.mul(roughnessMap.add(0.05)))

    const finalColor = diffuse.rgb.add(specular).add(fresnel)
    // const finalColor = vec3(finalNormal)

    this.earthMaterial.colorNode = finalColor

    this.earthMaterial.emissiveNode = smoothstep(
      0.5,
      1.0,
      nightColor.mul(oneMinus(nightOcclusion)),
    )

    this.earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      this.earthMaterial,
    )
    scene.add(this.earth)
  }

  setAtmosphere() {
    this.atmosphereMaterial = new THREE.MeshBasicNodeMaterial({
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const viewDirection = normalize(cameraPosition.sub(positionWorld))

    // Lighting
    const sunDirection = normalize(vec3(1.0, 0.2, 0.0))
    const sunLight = dot(sunDirection, normalWorld)

    //Fresnel
    let fresnel = oneMinus(max(0.0, dot(viewDirection, normalWorld)))
    fresnel = pow(fresnel, 2.0)

    let fadeOut = fresnel

    const atmosphereColor = vec3(0.4, 0.7, 1.0)
    const sunsetColor = vec3(1.0, 0.2, 0.2)

    const terminatorFactor = oneMinus(smoothstep(0.0, 0.8, abs(sunLight)))
    const dynamicGlowColor = mix(atmosphereColor, sunsetColor, terminatorFactor)

    const nightOcclusion = smoothstep(-0.1, 0.1, sunLight)

    fresnel = fresnel.mul(dynamicGlowColor).mul(nightOcclusion)

    const finalColor = fresnel

    this.atmosphereMaterial.colorNode = fresnel

    this.atmosphereMaterial.opacityNode = nightOcclusion

    this.atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.02, 64, 64),
      this.atmosphereMaterial,
    )
    // scene.add(this.atmosphere)
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
      new THREE.SphereGeometry(1.001, 64, 64),
      this.cloudsMaterial,
    )
    scene.add(this.clouds)
  }

  update(deltaTime) {
    this.earth.rotateY(deltaTime * 0.0001)
    this.clouds.rotateY(deltaTime * 0.0001)
  }
}
