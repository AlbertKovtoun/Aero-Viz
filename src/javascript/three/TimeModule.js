import { flights } from "./Experience"

export class TimeModule {
  constructor() {
    this.time = document.querySelector(".time-module")

    console.log(this.time.textContent)

    console.log(flights.flightProgresses)
  }
}
