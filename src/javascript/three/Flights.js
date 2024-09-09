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
        console.log(flightsArray)
        // console.log(flightsArray[0]["departure.lat"])
        this.setFlights()
        clearInterval(waitForFlights)
      } else {
        console.log("Waiting for flight data...")
      }
    }, 100)
  }

  setFlights() {
    this.flightGeometry = new THREE.BoxGeometry(0.01, 0.01, 0.01, 1, 1, 1)
    this.flightMaterial = new THREE.MeshBasicMaterial({ color: "red" })

    for (let i = 0; i < flightsArray.length; i++) {
      this.flight = new THREE.Mesh(this.flightGeometry, this.flightMaterial)

      const { x, y, z } = this.latLongToVector3(
        flightsArray[i].arrival.lat,
        flightsArray[i].arrival.lng,
        1
      )
      this.flight.position.set(x, y, z + Math.random() * 0.1)
      scene.add(this.flight)
    }
  }
}
