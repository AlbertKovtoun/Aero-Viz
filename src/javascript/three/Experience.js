import * as THREE from "three"
import Stats from "stats.js"

import { Camera } from "./Camera"
import { Renderer } from "./Renderer"
import { Sizes } from "./Sizes"
import { Loaders } from "./Loaders"
import { PostProcessing } from "./PostProcessing"
import { Earth } from "./Earth"
import { Flights } from "./Flights"
import { Pane } from "tweakpane"
import { TimeModule } from "./TimeModule"

const pane = new Pane()

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

export const timeModule = new TimeModule()

const clock = new THREE.Clock()
let lastTime = performance.now()

const tick = () => {
  stats.begin()

  const elapsedTime = clock.getElapsedTime()

  const currentTime = performance.now()
  const deltaTime = currentTime - lastTime
  lastTime = currentTime

  camera.controls.update()

  timeModule.update(elapsedTime)

  if (flights.flightsInstance) {
    flights.update(deltaTime)
    earth.update(deltaTime)
  }

  renderer.renderer.renderAsync(scene, camera.camera)

  //setTimeout(() => {
  window.requestAnimationFrame(tick)
  //}, 1000 / 30)

  stats.end()
}

tick()
