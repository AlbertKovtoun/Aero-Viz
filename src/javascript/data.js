let flightsArray = null

const fetchData = async () => {
  try {
    const response = await fetch("/data/flight-data-real.json")
    const data = await response.json()
    flightsArray = data
  } catch (error) {
    console.error("Error fetching data:", error)
    flightsArray = null
  }
}

fetchData()

export { flightsArray }
