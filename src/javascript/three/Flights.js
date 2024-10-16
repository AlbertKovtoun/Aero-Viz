// Flights.js

import * as THREE from "three"
import { gsap } from "gsap"
import { flightsArray } from "../data"
import { scene } from "./Experience"

import flightVertexShader from "../../shaders/flight/vertex.glsl?raw"
import flightFragmentShader from "../../shaders/flight/fragment.glsl?raw"

export class Flights {
  constructor() {
    this.radius = 1.02
    this.loadFlightData()
  }

  latLongToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lon + 180) * (Math.PI / 180)

    const x = -(radius * Math.sin(phi) * Math.cos(theta))
    const y = radius * Math.cos(phi)
    const z = radius * Math.sin(phi) * Math.sin(theta)

    return new THREE.Vector3(x, y, z)
  }

  loadFlightData() {
    const waitForFlights = setInterval(() => {
      if (flightsArray && flightsArray.length > 0) {
        console.log("Flights loaded:", flightsArray.length)
        this.setFlights()
        clearInterval(waitForFlights)
      } else {
        console.log("Waiting for flight data...")
      }
    }, 100)
  }

  setFlights() {
    const flightsCount = flightsArray.length

    this.flightGeometry = new THREE.SphereGeometry(0.005, 4, 4)
    this.flightMaterial = new THREE.ShaderMaterial({
      vertexShader: flightVertexShader,
      fragmentShader: flightFragmentShader,
    })

    this.flightsInstance = new THREE.InstancedMesh(
      this.flightGeometry,
      this.flightMaterial,
      flightsCount,
    )

    this.departurePositions = []
    this.arrivalPositions = []
    this.rotationAxes = []
    this.rotationAngles = []
    this.flightProgresses = new Float32Array(flightsCount)

    this.flightColors = new Float32Array(flightsCount * 3)
    this.flightTempColor = new THREE.Color()

    this.flightDummy = new THREE.Object3D()

    for (let i = 0; i < flightsCount; i++) {
      const flight = flightsArray[i]

      const randomAltitude = Math.random() * 0.1

      const departure = this.latLongToVector3(
        flight.departure.lat,
        flight.departure.lng,
        this.radius + randomAltitude,
      )

      const arrival = this.latLongToVector3(
        flight.arrival.lat,
        flight.arrival.lng,
        this.radius + randomAltitude,
      )

      this.departurePositions.push(departure)
      this.arrivalPositions.push(arrival)

      const rotationAxis = new THREE.Vector3()
        .crossVectors(departure, arrival)
        .normalize()
      let rotationAngle = departure.angleTo(arrival)

      this.rotationAxes.push(rotationAxis)
      this.rotationAngles.push(rotationAngle)

      this.flightProgresses[i] = 0

      this.flightTempColor.set(Math.random(), Math.random(), Math.random())
      this.flightColors[i * 3 + 0] = this.flightTempColor.r
      this.flightColors[i * 3 + 1] = this.flightTempColor.g
      this.flightColors[i * 3 + 2] = this.flightTempColor.b

      this.flightDummy.position.copy(
        departure.clone().multiplyScalar(this.radius),
      )
      this.flightDummy.updateMatrix()
      this.flightsInstance.setMatrixAt(i, this.flightDummy.matrix)
    }

    this.flightsInstance.geometry.setAttribute(
      "aInstanceColor",
      new THREE.InstancedBufferAttribute(this.flightColors, 3),
    )

    scene.add(this.flightsInstance)

    this.updateFlights()
  }

  updateFlights() {
    const flightsCount = this.departurePositions.length

    this.durations = []

    for (let i = 0; i < flightsCount; i++) {
      const randomDuration = Math.random() * 15 + 5 // Random duration between 5 and 20 seconds
      this.durations.push(randomDuration)
    }

    for (let i = 0; i < flightsCount; i++) {
      this.updateFlight(i)
    }
  }

  updateFlight(flightIndex) {
    const flightDuration = this.durations[flightIndex]

    gsap.to(this.flightProgresses, {
      [flightIndex]: 1,
      duration: flightDuration,
      repeat: -1,
      ease: "power4.inOut",
      onUpdate: () => {
        const rotationAngle =
          this.rotationAngles[flightIndex] * this.flightProgresses[flightIndex]

        const currentPosition = this.departurePositions[flightIndex]
          .clone()
          .applyAxisAngle(this.rotationAxes[flightIndex], rotationAngle)
          .multiplyScalar(this.radius)

        this.flightDummy.position.copy(currentPosition)
        this.flightDummy.updateMatrix()
        this.flightsInstance.setMatrixAt(flightIndex, this.flightDummy.matrix)

        this.flightsInstance.instanceMatrix.needsUpdate = true
      },
    })
  }
}
