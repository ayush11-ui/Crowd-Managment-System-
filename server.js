const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

// Import our crowd management system
const CrowdManagementSystem = require('./CrowdManagementSystem');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Create a global crowd management system instance
const cms = new CrowdManagementSystem();

// Initialize demo stadium layout
function initializeDemoSystem() {
    console.log('🏟️ Initializing demo stadium layout...');
    
    // Add zones
    cms.addZone('ENT1', 'Main Entrance', 200, 0, 0);
    cms.addZone('CON1', 'Main Concourse', 500, 1, 0);
    cms.addZone('SEC1', 'Section A', 300, 2, 1);
    cms.addZone('SEC2', 'Section B', 300, 2, -1);
    cms.addZone('SEC3', 'Section C', 250, 3, 1);
    cms.addZone('SEC4', 'Section D', 250, 3, -1);
    cms.addZone('FOOD', 'Food Court', 150, 1, 1);
    cms.addZone('REST', 'Restrooms', 100, 1, -1);
    cms.addZone('EMR1', 'Emergency Exit 1', 100, 4, 1);
    cms.addZone('EMR2', 'Emergency Exit 2', 100, 4, -1);

    // Connect zones
    cms.connectZones('ENT1', 'CON1');
    cms.connectZones('CON1', 'SEC1');
    cms.connectZones('CON1', 'SEC2');
    cms.connectZones('CON1', 'FOOD');
    cms.connectZones('CON1', 'REST');
    cms.connectZones('SEC1', 'SEC3');
    cms.connectZones('SEC2', 'SEC4');
    cms.connectZones('SEC3', 'EMR1');
    cms.connectZones('SEC4', 'EMR2');
    cms.connectZones('FOOD', 'SEC1');
    cms.connectZones('REST', 'SEC2');

    // Mark exit zones
    cms.addExitZone('ENT1');
    cms.addExitZone('EMR1');
    cms.addExitZone('EMR2');

    // Add initial crowd
    cms.moveCrowdToZone('ENT1', 150);
    cms.moveCrowdToZone('CON1', 200);
    cms.moveCrowdToZone('SEC1', 180);
    cms.moveCrowdToZone('SEC2', 160);
    cms.moveCrowdToZone('FOOD', 80);

    console.log('✅ Demo system initialized successfully!');
}

// Simple in-memory user store (in production, use a real database)
const users = [
    {
        id: 1,
        name: 'Demo User',
        email: 'demo@crowdmanagement.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        organization: 'Demo Organization'
    },
    {
        id: 2,
        name: 'Admin User',
        email: 'admin@crowdmanagement.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        organization: 'CMS Admin'
    }
];

// Middleware
app.use(helmet({
    contentSecurityPolicy: false // Disable CSP for demo
}));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Crowd Management System API is running',
        timestamp: new Date().toISOString()
    });
});

// User registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, organization, password } = req.body;

        // Validate input
        if (!name || !email || !organization || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            id: users.length + 1,
            name,
            email,
            organization,
            password: hashedPassword
        };

        users.push(newUser);

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                organization: newUser.organization
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                organization: user.organization
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get system overview
app.get('/api/system/overview', authenticateToken, (req, res) => {
    try {
        const overview = cms.getSystemOverview();
        res.json(overview);
    } catch (error) {
        console.error('System overview error:', error);
        res.status(500).json({ error: 'Failed to get system overview' });
    }
});

// Get all zones
app.get('/api/zones', authenticateToken, (req, res) => {
    try {
        const zones = Array.from(cms.zones.values()).map(zone => zone.getStatus());
        res.json(zones);
    } catch (error) {
        console.error('Get zones error:', error);
        res.status(500).json({ error: 'Failed to get zones' });
    }
});

// Get specific zone
app.get('/api/zones/:id', authenticateToken, (req, res) => {
    try {
        const zone = cms.getZone(req.params.id);
        if (!zone) {
            return res.status(404).json({ error: 'Zone not found' });
        }
        res.json(zone.getStatus());
    } catch (error) {
        console.error('Get zone error:', error);
        res.status(500).json({ error: 'Failed to get zone' });
    }
});

// Move crowd to zone
app.post('/api/zones/:id/crowd', authenticateToken, (req, res) => {
    try {
        const { crowdSize } = req.body;
        if (!crowdSize || crowdSize <= 0) {
            return res.status(400).json({ error: 'Valid crowd size is required' });
        }

        const result = cms.moveCrowdToZone(req.params.id, crowdSize);
        if (!result) {
            return res.status(404).json({ error: 'Zone not found' });
        }

        res.json({
            message: `Added ${crowdSize} people to zone`,
            zone: result
        });
    } catch (error) {
        console.error('Move crowd error:', error);
        res.status(500).json({ error: 'Failed to move crowd' });
    }
});

// Find evacuation route
app.post('/api/evacuation/route', authenticateToken, (req, res) => {
    try {
        const { fromZoneId, crowdSize } = req.body;
        
        if (!fromZoneId || !crowdSize) {
            return res.status(400).json({ error: 'Zone ID and crowd size are required' });
        }

        const route = cms.findOptimalEvacuationRoute(fromZoneId, crowdSize);
        if (!route) {
            return res.status(404).json({ error: 'No evacuation route found' });
        }

        res.json({
            route: {
                path: route.path.map(zone => zone.getStatus()),
                distance: route.distance,
                congestionScore: route.congestionScore,
                canAccommodate: route.canAccommodate,
                capacity: route.capacity
            }
        });
    } catch (error) {
        console.error('Evacuation route error:', error);
        res.status(500).json({ error: 'Failed to find evacuation route' });
    }
});

// Redistribute crowd
app.post('/api/crowd/redistribute', authenticateToken, (req, res) => {
    try {
        const { fromZoneId, crowdSize } = req.body;
        
        if (!fromZoneId || !crowdSize) {
            return res.status(400).json({ error: 'Zone ID and crowd size are required' });
        }

        const result = cms.redistributeCrowd(fromZoneId, crowdSize);
        res.json(result);
    } catch (error) {
        console.error('Redistribute crowd error:', error);
        res.status(500).json({ error: 'Failed to redistribute crowd' });
    }
});

// Emergency evacuation
app.post('/api/emergency/evacuate', authenticateToken, (req, res) => {
    try {
        const evacuationPlan = cms.initiateEmergencyEvacuation();
        res.json({
            message: 'Emergency evacuation initiated',
            plan: evacuationPlan
        });
    } catch (error) {
        console.error('Emergency evacuation error:', error);
        res.status(500).json({ error: 'Failed to initiate emergency evacuation' });
    }
});

// Start/stop monitoring
app.post('/api/monitoring/start', authenticateToken, (req, res) => {
    try {
        const { interval = 5000 } = req.body;
        cms.startMonitoring(interval);
        res.json({ message: 'Monitoring started', interval });
    } catch (error) {
        console.error('Start monitoring error:', error);
        res.status(500).json({ error: 'Failed to start monitoring' });
    }
});

app.post('/api/monitoring/stop', authenticateToken, (req, res) => {
    try {
        cms.stopMonitoring();
        res.json({ message: 'Monitoring stopped' });
    } catch (error) {
        console.error('Stop monitoring error:', error);
        res.status(500).json({ error: 'Failed to stop monitoring' });
    }
});

// Simulate crowd flow
app.post('/api/simulation/start', authenticateToken, (req, res) => {
    try {
        const { duration = 60000, interval = 1000 } = req.body;
        cms.simulateCrowdFlow(duration, interval);
        res.json({ 
            message: 'Crowd flow simulation started', 
            duration, 
            interval 
        });
    } catch (error) {
        console.error('Simulation error:', error);
        res.status(500).json({ error: 'Failed to start simulation' });
    }
});

// WebSocket for real-time updates (simple implementation)
app.get('/api/events', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Send periodic updates
    const intervalId = setInterval(() => {
        const overview = cms.getSystemOverview();
        res.write(`data: ${JSON.stringify({
            type: 'system-update',
            data: overview,
            timestamp: new Date().toISOString()
        })}\n\n`);
    }, 5000);

    // Clean up on client disconnect
    req.on('close', () => {
        clearInterval(intervalId);
    });
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Initialize demo system and start server
initializeDemoSystem();

app.listen(PORT, () => {
    console.log(`
🚀 Crowd Management System Server
================================
🌐 Server running on: http://localhost:${PORT}
📱 Frontend available at: http://localhost:${PORT}
🔧 API endpoints: http://localhost:${PORT}/api
📊 Health check: http://localhost:${PORT}/api/health

🏟️ Demo system initialized with stadium layout
🔑 Demo credentials:
   Email: demo@crowdmanagement.com
   Password: password

Press Ctrl+C to stop the server
    `);
});

module.exports = app;
