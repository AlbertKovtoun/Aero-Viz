// Flights.js

import * as THREE from "three"
import { gsap } from "gsap"
import { flightsArray } from "../data"
import { scene } from "./Experience"

export class Flights {
  constructor() {
    this.radius = 1.05
    this.duration = 10
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
    this.flightMaterial = new THREE.MeshBasicMaterial({ color: "yellow" })

    this.flightsInstance = new THREE.InstancedMesh(
      this.flightGeometry,
      this.flightMaterial,
      flightsCount,
    )

    this.departurePositions = []
    this.arrivalPositions = []
    this.rotationAxes = []
    this.rotationAngles = []
    this.flightProgresses = new Float32Array(flightsCount) // Stores progress (t) for each flight

    this.flightDummy = new THREE.Object3D()

    for (let i = 0; i < flightsCount; i++) {
      const flight = flightsArray[i]

      // Calculate departure and arrival positions
      const departure = this.latLongToVector3(
        flight.departure.lat,
        flight.departure.lng,
        this.radius,
      ).normalize()

      const arrival = this.latLongToVector3(
        flight.arrival.lat,
        flight.arrival.lng,
        this.radius,
      ).normalize()

      this.departurePositions.push(departure)
      this.arrivalPositions.push(arrival)

      // Calculate rotation axis and angle for spherical movement
      const rotationAxis = new THREE.Vector3()
        .crossVectors(departure, arrival)
        .normalize()
      let rotationAngle = departure.angleTo(arrival)

      this.rotationAxes.push(rotationAxis)
      this.rotationAngles.push(rotationAngle)

      // Initialize flight progress
      this.flightProgresses[i] = 0

      // Set initial instance matrix
      this.flightDummy.position.copy(
        departure.clone().multiplyScalar(this.radius),
      )
      this.flightDummy.updateMatrix()
      this.flightsInstance.setMatrixAt(i, this.flightDummy.matrix)
    }

    scene.add(this.flightsInstance)

    this.animateFlights()
  }

  animateFlights() {
    const flightsCount = this.departurePositions.length
    const duration = this.duration * 1000

    this.timeline = gsap.timeline({ repeat: -1 })

    // Add an onUpdate callback to the timeline
    this.timeline.to(
      { progress: 0 },
      {
        progress: 1,
        duration: this.duration,
        ease: "linear",
        onUpdate: () => {
          const tGlobal = this.timeline.progress()

          // Update all flights
          for (let i = 0; i < flightsCount; i++) {
            // Update flight progress
            this.flightProgresses[i] = tGlobal

            // Calculate current rotation angle
            const rotationAngle =
              this.rotationAngles[i] * this.flightProgresses[i]

            // Rotate the departure position around the rotation axis
            const currentPosition = this.departurePositions[i]
              .clone()
              .applyAxisAngle(this.rotationAxes[i], rotationAngle)
              .multiplyScalar(this.radius)

            // Update instance matrix
            this.flightDummy.position.copy(currentPosition)

            // Optional: Orient the plane along its path
            const nextRotationAngle =
              this.rotationAngles[i] * (this.flightProgresses[i] + 0.001)
            const nextPosition = this.departurePositions[i]
              .clone()
              .applyAxisAngle(this.rotationAxes[i], nextRotationAngle)
              .multiplyScalar(this.radius)
            this.flightDummy.lookAt(nextPosition)

            this.flightDummy.updateMatrix()
            this.flightsInstance.setMatrixAt(i, this.flightDummy.matrix)
          }

          // Indicate that instance matrices need an update
          this.flightsInstance.instanceMatrix.needsUpdate = true
        },
      },
    )
  }
}
