import * as THREE from "three"
import { flightsArray } from "../data"
import { scene } from "./Experience"

export class Flights {
  constructor() {
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
      if (flightsArray) {
        //This code executes after all the flights are loaded
        console.log(flightsArray)
        this.setFlights()
        clearInterval(waitForFlights)
      } else {
        console.log("Waiting for flight data...")
      }
    }, 100)
  }

  setFlights() {
    this.flightGeometry = new THREE.SphereGeometry(0.01, 16, 16)
    this.flightMaterial = new THREE.MeshBasicMaterial({ color: "#ff0000" })
    this.flightsInstance = new THREE.InstancedMesh(
      this.flightGeometry,
      this.flightMaterial,
      flightsArray.length,
    )

    this.flightDummy = new THREE.Object3D()

    for (let i = 0; i < flightsArray.length; i++) {
      const { x, y, z } = this.latLongToVector3(
        flightsArray[i].arrival.lat,
        flightsArray[i].arrival.lng,
        1,
      )
      this.flightDummy.position.set(x, y, z + Math.random() * 0.1)

      this.flightDummy.updateMatrix()
      this.flightsInstance.setMatrixAt(i, this.flightDummy.matrix)
    }
    scene.add(this.flightsInstance)
  }
}
