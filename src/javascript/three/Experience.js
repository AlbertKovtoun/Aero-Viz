import * as THREE from "three"
import { flights } from "../data"
import Stats from "stats.js"

import { Camera } from "./Camera"
import { Renderer } from "./Renderer"
import { Sizes } from "./Sizes"
import { Loaders } from "./Loaders"

import { Particles } from "./Particles"
import { PostProcessing } from "./PostProcessing"
import { Earth } from "./Earth"

const waitForFlights = setInterval(() => {
  if (flights) {
    console.log(flights)
    clearInterval(waitForFlights)
  } else {
    console.log("Waiting for flight data...")
  }
}, 100)

const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

export const canvas = document.querySelector("canvas.webgl")

export const scene = new THREE.Scene()

export const loaders = new Loaders()

export const earth = new Earth()

export const particles = new Particles()

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
  // renderer.renderer.render(scene, camera.camera)
  postProcessing.effectComposer.render()

  window.requestAnimationFrame(tick)

  stats.end()
}

tick()
