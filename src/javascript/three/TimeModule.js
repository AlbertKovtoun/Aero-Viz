import { flights } from "./Experience"
import { flightsArray } from "../data"

export class TimeModule {
  constructor() {
    const waitForFlights = setInterval(() => {
      if (flightsArray && flightsArray.length > 0) {
        //.code here
        clearInterval(waitForFlights)
      }
    }, 100)

    this.timeDisplay = document.querySelector(".time-module")

    this.progress = 0.6
    this.syncTime(this.progress)
  }

  syncTime(progress) {
    const totalMinutesInADay = 24 * 60
    const currentMinutes = Math.round(progress * totalMinutesInADay)
    const hours = Math.floor(currentMinutes / 60)
    const minutes = currentMinutes % 60

    const formattedHours = String(hours).padStart(2, "0")
    const formattedMinutes = String(minutes).padStart(2, "0")

    this.timeDisplay.textContent = `${formattedHours}:${formattedMinutes}`
  }
}
