import * as THREE from "three/webgpu"
import { vec4, attribute } from "three/webgpu"

import { gsap } from "gsap"
import { flightsArray } from "../data"
import { scene, timeModule } from "./Experience"

import flightVertexShader from "../../shaders/flight/vertex.glsl?raw"
import flightFragmentShader from "../../shaders/flight/fragment.glsl?raw"

export class Flights {
  constructor() {
    this.radius = 1.02
    this.activeFlights = new Set()
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

  timeToDecimal(time) {
    const hours = (time.charCodeAt(0) - 48) * 10 + (time.charCodeAt(1) - 48)
    const minutes = (time.charCodeAt(3) - 48) * 10 + (time.charCodeAt(4) - 48)
    return (hours * 60 + minutes) / 1440
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

    //Geometry
    this.flightGeometry = new THREE.SphereGeometry(0.005, 8, 8)

    //Material
    this.flightMaterial = new THREE.MeshStandardNodeMaterial({
      transparent: true,
    })
    //It's that easy?!?!
    this.flightMaterial.outputNode = vec4(
      attribute("aInstanceColor"),
      attribute("aOpacity"),
    )

    //Instance
    this.flightsInstance = new THREE.InstancedMesh(
      this.flightGeometry,
      this.flightMaterial,
      flightsCount,
    )

    this.departurePositions = []
    this.normalizedDepartureTimes = new Float32Array(flightsCount)
    this.arrivalPositions = []
    this.rotationAxes = []
    this.rotationAngles = []
    this.flightProgresses = new Float32Array(flightsCount)
    this.durations = new Float32Array(flightsCount)

    this.flightColors = new Float32Array(flightsCount * 3)
    this.flightTempColor = new THREE.Color()

    this.flightOpacities = new Float32Array(flightsCount)

    this.flightDummy = new THREE.Object3D()

    for (let i = 0; i < flightsCount; i++) {
      const flight = flightsArray[i]

      const randomAltitude = Math.random() * 0.1

      const departure = this.latLongToVector3(
        flight.departure.lat,
        flight.departure.lng,
        this.radius + randomAltitude,
      )
      this.departurePositions.push(departure)

      this.normalizedDepartureTimes[i] = this.timeToDecimal(
        flight.departure.time,
      )

      const arrival = this.latLongToVector3(
        flight.arrival.lat,
        flight.arrival.lng,
        this.radius + randomAltitude,
      )
      this.arrivalPositions.push(arrival)

      const rotationAxis = new THREE.Vector3()
        .crossVectors(departure, arrival)
        .normalize()
      let rotationAngle = departure.angleTo(arrival)

      this.rotationAxes.push(rotationAxis)
      this.rotationAngles.push(rotationAngle)

      this.flightProgresses[i] = 0
      this.durations[i] = Math.random() * 15 + 5 // Random duration between 5 and 20 seconds

      this.flightTempColor.set(Math.random(), 0, 0) //random red tint
      this.flightColors[i * 3 + 0] = this.flightTempColor.r
      this.flightColors[i * 3 + 1] = this.flightTempColor.g
      this.flightColors[i * 3 + 2] = this.flightTempColor.b

      this.flightOpacities[i] = 0

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

    this.flightsInstance.geometry.setAttribute(
      "aOpacity",
      new THREE.InstancedBufferAttribute(this.flightOpacities, 1),
    )

    scene.add(this.flightsInstance)

    this.checkFlightTimes()
  }

  checkFlightTimes() {
    setInterval(() => {
      const currentTime = timeModule.globalTimeProgress

      for (let i = 0; i < this.departurePositions.length; i++) {
        if (
          !this.activeFlights.has(i) &&
          Math.abs(this.normalizedDepartureTimes[i] - currentTime) < 0.001
        ) {
          this.startFlight(i)
          this.activeFlights.add(i)
        }
      }
    }, 100)
  }

  startFlight(flightIndex) {
    const flightDuration = this.durations[flightIndex]

    this.handleFlightOpacity(flightIndex, 1)

    //Animate flight
    gsap.to(this.flightProgresses, {
      [flightIndex]: 1,
      duration: flightDuration,
      ease: "power1.inOut",
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
      onComplete: () => this.handleFlightOpacity(flightIndex, 0),
    })
  }

  handleFlightOpacity(flightIndex, opacityTo) {
    gsap.to(this.flightsInstance.geometry.attributes.aOpacity.array, {
      [flightIndex]: opacityTo,
      duration: 1,
      ease: "power4.inOut",
      onUpdate: () => {
        this.flightsInstance.geometry.attributes.aOpacity.needsUpdate = true
      },
    })
  }
}
