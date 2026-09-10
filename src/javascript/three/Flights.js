import * as THREE from "three/webgpu"
import { vec3, attribute, color, mul } from "three/tsl"

import { gsap } from "gsap"
import { flightsArray } from "../data"
import { scene, timeModule } from "./Experience"

export class Flights {
  constructor() {
    this.radius = 1.01
    this.activeFlights = new Set()
    this.airborneFlightsCount = 0
    this.airborneFlightsModule = document.querySelector(
      ".airborne-flights-module",
    )
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
    this.flightGeometry = new THREE.SphereGeometry(0.002, 3, 3)

    //Material
    this.flightMaterial = new THREE.MeshBasicNodeMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    this.flightMaterial.colorNode = vec3(1.0)
    this.flightMaterial.opacityNode = attribute("aOpacity")

    this.flightMaterial.emissiveNode = color(0xffffff)

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

    this.flightOpacities = new Float32Array(flightsCount)

    this.flightDummy = new THREE.Object3D()

    for (let i = 0; i < flightsCount; i++) {
      const flight = flightsArray[i]

      const randomAltitude = Math.random() * 0.3

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
      this.durations[i] = flightsArray[i].duration * 20

      this.flightOpacities[i] = 0

      this.flightDummy.position.copy(
        departure.clone().multiplyScalar(this.radius),
      )
      this.flightDummy.updateMatrix()
      this.flightsInstance.setMatrixAt(i, this.flightDummy.matrix)
    }

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

    this.airborneFlightsCount += 1

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
      onComplete: () => {
        this.handleFlightOpacity(flightIndex, 0)
        this.airborneFlightsCount -= 1
      },
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

  updateAirborneFlights() {
    this.airborneFlightsModule.textContent = `Airborne flights: ${this.airborneFlightsCount}`
  }

  update(deltaTime) {
    this.flightsInstance.rotateY(deltaTime * 0.0001)
    this.updateAirborneFlights()
  }
}
