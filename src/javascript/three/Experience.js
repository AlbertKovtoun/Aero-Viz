import * as THREE from "three"
import Stats from "stats.js"

import { Camera } from "./Camera"
import { Renderer } from "./Renderer"
import { Sizes } from "./Sizes"
import { Loaders } from "./Loaders"

import { PostProcessing } from "./PostProcessing"
import { Earth } from "./Earth"
import { Flights } from "./Flights"

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

export const canvas = document.querySelector("canvas.webgl")

export const scene = new THREE.Scene()

export const loaders = new Loaders()

export const flights = new Flights()

export const earth = new Earth()

export const sizes = new Sizes()

export const camera = new Camera()

export const renderer = new Renderer()

export const postProcessing = new PostProcessing()

//Animate
const clock = new THREE.Clock()
let time = Date.now()

const tick = () => {
  stats.begin()

  const elapsedTime = clock.getElapsedTime()

  const currentTime = Date.now()
  const deltaTime = currentTime - time
  time = currentTime

  // Update controls
  camera.controls.update()

  // Render
  renderer.renderer.render(scene, camera.camera)

  setTimeout(() => {
    window.requestAnimationFrame(tick)
  }, 1000 / 60)

  stats.end()
}

tick()
