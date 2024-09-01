let flights = null

const fetchData = async () => {
  try {
    const response = await fetch("/data/flight-data.json")
    const data = await response.json()
    flights = data.flights
  } catch (error) {
    console.error("Error fetching data:", error)
    flights = null
  }
}

fetchData()

export { flights }
