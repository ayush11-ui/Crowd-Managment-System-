# Crowd Management System

A sophisticated crowd management system using **zone-based BFS graph traversal** for optimal pathfinding, crowd flow analysis, and emergency evacuation planning.

## 🏗️ System Architecture

### Core Components

1. **Zone Class** (`Zone.js`)
   - Represents individual areas/zones in a venue
   - Tracks capacity, current crowd, and congestion levels
   - Manages adjacent zone connections for graph structure

2. **BFS Traversal Class** (`BFSTraversal.js`)
   - Implements Breadth-First Search algorithms
   - Finds shortest paths between zones
   - Calculates optimal evacuation routes
   - Identifies critical zones and alternative paths

3. **Crowd Management System** (`CrowdManagementSystem.js`)
   - Main orchestrator class
   - Manages multiple zones and their connections
   - Provides real-time monitoring and alerts
   - Handles emergency evacuation procedures

## 🚀 Features

### Core Functionality
- ✅ **Zone-based Architecture**: Modular zone system with capacity management
- ✅ **BFS Graph Traversal**: Optimal pathfinding using breadth-first search
- ✅ **Real-time Monitoring**: Continuous crowd level monitoring
- ✅ **Critical Situation Detection**: Automatic alerts for overcrowding
- ✅ **Evacuation Planning**: Emergency route calculation and optimization
- ✅ **Crowd Redistribution**: Automated load balancing between zones

### Advanced Features
- 🔍 **Shortest Path Finding**: BFS-based optimal route calculation
- 📊 **Congestion Analysis**: Real-time congestion scoring and visualization
- 🚨 **Emergency Protocols**: Comprehensive evacuation procedures
- 🔄 **Dynamic Simulation**: Time-based crowd flow simulation
- 📈 **System Analytics**: Detailed performance metrics and reporting

## 📦 Installation & Setup

### Prerequisites
- Node.js (v12 or higher)
- npm (comes with Node.js)
- Git (for deployment)

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/crowd-management-system.git
cd crowd-management-system

# Install dependencies
npm install

# Start the development server
npm start

# The application will be available at http://localhost:3000
```

### Demo Credentials
- **Email**: demo@crowdmanagement.com
- **Password**: password

Or create a new account using the signup form.

## 🎮 Usage

### Running the Demo
```bash
# Run full demonstration
node index.js --demo

# Or use short flag
node index.js -d
```

### Basic Usage
```bash
# Run interactive mode
node index.js
```

### Programmatic Usage
```javascript
const { CrowdManagementSystem } = require('./index');

// Create new system
const cms = new CrowdManagementSystem();

// Add zones
const entrance = cms.addZone('ENT1', 'Main Entrance', 200, 0, 0);
const hall = cms.addZone('HALL', 'Main Hall', 500, 1, 0);
const exit = cms.addZone('EXIT', 'Emergency Exit', 100, 2, 0);

// Connect zones
cms.connectZones('ENT1', 'HALL');
cms.connectZones('HALL', 'EXIT');

// Set exit zones
cms.addExitZone('EXIT');

// Add crowd
cms.moveCrowdToZone('ENT1', 150);

// Find evacuation route
const route = cms.findOptimalEvacuationRoute('ENT1', 100);
console.log(route);
```

## 🏟️ Example: Stadium Layout

The demo creates a realistic stadium venue with:

```
Emergency Exit 1 ← Section C ← Section A ← Main Concourse ← Main Entrance
                                    ↑           ↓
                              Food Court    Restrooms
                                    ↓           ↑
Emergency Exit 2 ← Section D ← Section B ←──────┘
```

### Zone Configuration
- **Main Entrance**: 200 capacity
- **Main Concourse**: 500 capacity  
- **Sections A-D**: 250-300 capacity each
- **Food Court**: 150 capacity
- **Restrooms**: 100 capacity
- **Emergency Exits**: 100 capacity each

## 🔍 BFS Algorithm Implementation

### Key Algorithms

1. **Shortest Path Finding**
   ```javascript
   findShortestPath(startZone, endZone)
   ```
   - Uses BFS to find optimal route between any two zones
   - Returns complete path with zone objects

2. **Evacuation Route Optimization**
   ```javascript
   findEvacuationRoutes(startZone, exitZones, crowdSize)
   ```
   - Evaluates all possible exit routes
   - Considers capacity constraints and congestion levels
   - Returns sorted routes by optimality

3. **Zone Discovery**
   ```javascript
   findZonesWithinDistance(startZone, maxDistance)
   ```
   - Finds all zones within specified distance
   - Useful for local crowd redistribution

4. **Critical Zone Detection**
   ```javascript
   findCriticalZones(startZone, radius, threshold)
   ```
   - Identifies high-congestion zones in area
   - Enables proactive crowd management

## 📊 Monitoring & Analytics

### Real-time Metrics
- **Overall Utilization**: Total crowd vs. total capacity
- **Zone-level Congestion**: Individual zone utilization rates
- **Critical Zone Count**: Number of zones exceeding threshold
- **Average Congestion**: System-wide congestion average

### Alert System
- 🔴 **Critical**: >80% capacity utilization
- 🟡 **Warning**: >50% capacity utilization  
- 🟢 **Normal**: <50% capacity utilization

## 🚨 Emergency Features

### Evacuation Procedures
1. **Automatic Detection**: Monitors for critical situations
2. **Route Calculation**: BFS-based optimal evacuation paths
3. **Priority Assignment**: Critical zones evacuated first
4. **Time Estimation**: Calculates evacuation duration
5. **Alternative Routes**: Finds backup paths avoiding congestion

### Emergency Response
```javascript
// Initiate emergency evacuation
const plan = cms.initiateEmergencyEvacuation();

// Monitor critical situations
cms.startMonitoring(2000); // Check every 2 seconds

// Handle specific overcrowding
cms.redistributeCrowd('ZONE_ID', 50);
```

## 🔧 Configuration Options

### Zone Properties
- `id`: Unique identifier
- `name`: Human-readable name
- `capacity`: Maximum occupancy
- `x, y`: Spatial coordinates
- `currentCrowd`: Current occupancy
- `congestionLevel`: Utilization percentage
- `isCritical`: Overcrowding flag
- `isEvacuationRoute`: Exit designation

### System Parameters
- **Critical Threshold**: 80% capacity (configurable)
- **Monitoring Interval**: 5000ms (configurable)
- **Simulation Speed**: 1000ms intervals (configurable)
- **Route Optimization**: Congestion + distance weighted

## 🎯 Use Cases

### Venue Types
- 🏟️ **Sports Stadiums**: Multi-section crowd management
- 🎵 **Concert Halls**: High-density event management
- 🏢 **Office Buildings**: Emergency evacuation planning
- 🏬 **Shopping Malls**: Peak-time crowd distribution
- ✈️ **Airports**: Terminal and gate area management
- 🚇 **Transit Stations**: Platform crowd control

### Scenarios
- **Peak Arrival/Departure**: Entry and exit surge management
- **Emergency Evacuation**: Optimal route calculation
- **Event Management**: Intermission and break periods
- **Maintenance Operations**: Zone closure and rerouting
- **Security Incidents**: Immediate area isolation
- **Capacity Planning**: Venue optimization analysis

## 🧪 Testing & Validation

### Demo Scenarios
1. **Normal Operations**: Standard crowd flow patterns
2. **Overcrowding**: Critical situation handling
3. **Emergency Evacuation**: Full evacuation procedures
4. **Crowd Redistribution**: Load balancing algorithms
5. **Real-time Monitoring**: Continuous system observation

### Performance Metrics
- **Path Finding Speed**: BFS algorithm efficiency
- **Memory Usage**: Zone and graph storage optimization
- **Update Frequency**: Real-time monitoring responsiveness
- **Scalability**: Large venue handling capability

## 🔮 Future Enhancements

### Planned Features
- 🌐 **Web Dashboard**: Real-time visualization interface
- 📱 **Mobile App**: On-the-go monitoring capabilities
- 🤖 **AI Predictions**: Machine learning crowd pattern analysis
- 📡 **IoT Integration**: Sensor-based crowd counting
- 🗺️ **3D Visualization**: Advanced spatial representation
- 📈 **Historical Analytics**: Long-term trend analysis

### Advanced Algorithms
- **A* Pathfinding**: Heuristic-based route optimization
- **Dijkstra's Algorithm**: Weighted graph traversal
- **Flow Networks**: Maximum flow capacity calculation
- **Genetic Algorithms**: Multi-objective optimization

## 📝 License

MIT License - Feel free to use, modify, and distribute this crowd management system.

## 🤝 Contributing

Contributions welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 🚀 Deployment Guide

### Method 1: Heroku Deployment

1. **Create a Heroku account** at [heroku.com](https://heroku.com)

2. **Install Heroku CLI**:
   ```bash
   # Windows (using chocolatey)
   choco install heroku-cli
   
   # macOS (using homebrew)
   brew install heroku/brew/heroku
   
   # Or download from: https://devcenter.heroku.com/articles/heroku-cli
   ```

3. **Deploy to Heroku**:
   ```bash
   # Login to Heroku
   heroku login
   
   # Create a new Heroku app
   heroku create your-crowd-management-app
   
   # Set environment variables
   heroku config:set JWT_SECRET=your-super-secret-jwt-key-here
   
   # Push to Heroku
   git push heroku main
   
   # Open your deployed app
   heroku open
   ```

### Method 2: Netlify + Backend on Railway

#### Frontend (Netlify)
1. **Push your code to GitHub**
2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Set publish directory to `public`
   - Deploy!

#### Backend (Railway)
1. **Go to [railway.app](https://railway.app)**
2. **Create new project from GitHub**
3. **Set environment variables**:
   - `JWT_SECRET`: your-secret-key
   - `PORT`: 3000
4. **Deploy automatically**

### Method 3: Vercel Deployment

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   # In your project directory
   vercel
   
   # Follow the prompts
   # Set environment variables in Vercel dashboard
   ```

### Method 4: DigitalOcean App Platform

1. **Create account** at [digitalocean.com](https://digitalocean.com)
2. **Create new App**
3. **Connect GitHub repository**
4. **Configure**:
   - Build command: `npm install`
   - Run command: `npm start`
   - Environment variables: `JWT_SECRET`
5. **Deploy**

### Environment Variables

For production deployment, set these environment variables:

```bash
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
NODE_ENV=production
```

### Post-Deployment Setup

1. **Update API URLs**: If frontend and backend are on different domains, update the `API_BASE_URL` in the frontend files

2. **Test the application**:
   - Visit your deployed URL
   - Test login/signup
   - Run the interactive demos
   - Verify real-time updates work

3. **Monitor performance**:
   - Check application logs
   - Monitor API response times
   - Verify WebSocket connections

### Database Integration (Optional)

For production use, consider integrating a real database:

- **MongoDB**: Use MongoDB Atlas for cloud database
- **PostgreSQL**: Use services like ElephantSQL or Heroku Postgres
- **MySQL**: Use PlanetScale or AWS RDS

---

**Built with ❤️ using Node.js and BFS Graph Traversal Algorithms**
