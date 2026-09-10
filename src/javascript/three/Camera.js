import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { canvas, scene, sizes } from "./Experience"

export class Camera {
  constructor() {
    this.camera
    this.controls

    this.setCamera()
    this.setCameraControls()
  }

  setCamera() {
    this.camera = new THREE.PerspectiveCamera(
      40,
      sizes.width / sizes.height,
      0.1,
      100,
    )
    this.camera.position.z = 4
    scene.add(this.camera)
  }

  setCameraControls() {
    this.controls = new OrbitControls(this.camera, canvas)

    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.03

    this.controls.rotateSpeed = 0.7
    this.controls.zoomSpeed = 0.8
    this.controls.panSpeed = 0.6

    this.controls.minDistance = 3
    this.controls.maxDistance = 10
    this.controls.enablePan = false
  }
}
