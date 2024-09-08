# Aero Viz :airplane: :earth_asia:

### Idea
We get commercial flight data from an API and modify the JSON files to only contain the information we need with Python. In the Three.js section we create a sphere that will be our earth with a stylized texture on it. A 24 h time lapse will be created to visualize all the data. These are the steps to kick the project off the ground: 

#### Data to gather from API call
- Departure and arrival time/location
- Aircraft type/model/make?
#### Data we can make up/randomize
- Flight path curve
- Altitude variation
- Total distance 
#### Data we can calculate
- Heat map to visualize regions with the highest flight density
- Show total distance traveled/total flight duration
- Map for CO2 emissions estimation
- Map for total fuel consumption
#### Cool ideas
- Allow users to scrub through the time line
- Day/night cycle
- Custom shaders for atmosphere (atmospheric scattering), volumetric clouds and fading flight paths
- Weather overlay
- City lights (with bloom?)
- Lens flare for sun [https://github.com/ektogamat/lensflare-threejs-vanilla] and moon?
- Custom OrbitControls for smooth experience

## Setup

Download [Node.js](https://nodejs.org/en/download/) and run the following commands:

```bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

Made by Albert Kovtoun and Lars Moons