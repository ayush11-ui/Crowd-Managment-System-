const Zone = require('./Zone');
const BFSTraversal = require('./BFSTraversal');

class CrowdManagementSystem {
    constructor() {
        this.zones = new Map();
        this.bfsTraversal = new BFSTraversal();
        this.exitZones = [];
        this.emergencyActive = false;
        this.monitoringInterval = null;
    }

    // Add a new zone to the system
    addZone(id, name, capacity, x, y) {
        const zone = new Zone(id, name, capacity, x, y);
        this.zones.set(id, zone);
        return zone;
    }

    // Get zone by ID
    getZone(id) {
        return this.zones.get(id);
    }

    // Connect two zones bidirectionally
    connectZones(zone1Id, zone2Id) {
        const zone1 = this.zones.get(zone1Id);
        const zone2 = this.zones.get(zone2Id);
        
        if (zone1 && zone2) {
            zone1.addAdjacentZone(zone2);
            zone2.addAdjacentZone(zone1);
            return true;
        }
        return false;
    }

    // Mark a zone as an exit/evacuation point
    addExitZone(zoneId) {
        const zone = this.zones.get(zoneId);
        if (zone) {
            zone.isEvacuationRoute = true;
            this.exitZones.push(zone);
            return true;
        }
        return false;
    }

    // Simulate crowd movement to a zone
    moveCrowdToZone(zoneId, crowdSize) {
        const zone = this.zones.get(zoneId);
        if (zone) {
            zone.addCrowd(crowdSize);
            this.checkForCriticalSituations();
            return zone.getStatus();
        }
        return null;
    }

    // Find optimal evacuation route for a crowd
    findOptimalEvacuationRoute(fromZoneId, crowdSize) {
        const startZone = this.zones.get(fromZoneId);
        if (!startZone) return null;

        const routes = this.bfsTraversal.findEvacuationRoutes(startZone, this.exitZones, crowdSize);
        
        return routes.length > 0 ? routes[0] : null;
    }

    // Redistribute crowd from overcrowded zones
    redistributeCrowd(fromZoneId, crowdSize) {
        const sourceZone = this.zones.get(fromZoneId);
        if (!sourceZone || sourceZone.currentCrowd < crowdSize) {
            return { success: false, message: 'Invalid source zone or insufficient crowd' };
        }

        // Find nearby zones with available capacity
        const nearbyZones = this.bfsTraversal.findZonesWithinDistance(sourceZone, 3);
        const availableZones = nearbyZones
            .filter(({ zone }) => zone.id !== fromZoneId && zone.canAccommodate(crowdSize))
            .sort((a, b) => (a.zone.congestionLevel + a.distance) - (b.zone.congestionLevel + b.distance));

        if (availableZones.length === 0) {
            return { success: false, message: 'No available zones for redistribution' };
        }

        const targetZone = availableZones[0].zone;
        const path = this.bfsTraversal.findShortestPath(sourceZone, targetZone);

        // Execute the redistribution
        sourceZone.removeCrowd(crowdSize);
        targetZone.addCrowd(crowdSize);

        return {
            success: true,
            message: `Redistributed ${crowdSize} people from ${sourceZone.name} to ${targetZone.name}`,
            path: path.map(zone => zone.name),
            sourceZone: sourceZone.getStatus(),
            targetZone: targetZone.getStatus()
        };
    }

    // Check for critical situations and trigger alerts
    checkForCriticalSituations() {
        const criticalZones = [];
        
        for (const zone of this.zones.values()) {
            if (zone.isCritical) {
                criticalZones.push(zone);
            }
        }

        if (criticalZones.length > 0) {
            this.handleCriticalSituation(criticalZones);
        }

        return criticalZones;
    }

    // Handle critical situations
    handleCriticalSituation(criticalZones) {
        console.log('🚨 CRITICAL SITUATION DETECTED!');
        
        criticalZones.forEach(zone => {
            console.log(`⚠️  Zone ${zone.name} (ID: ${zone.id}) - Congestion: ${zone.congestionLevel}%`);
            
            // Find alternative routes for this zone
            const alternatives = this.findAlternativeRoutes(zone.id);
            if (alternatives.length > 0) {
                console.log(`📍 Alternative routes available: ${alternatives.length}`);
                alternatives.forEach((alt, index) => {
                    console.log(`   Route ${index + 1}: ${alt.path.map(z => z.name).join(' → ')}`);
                });
            }
        });
    }

    // Find alternative routes from a zone
    findAlternativeRoutes(zoneId) {
        const zone = this.zones.get(zoneId);
        if (!zone) return [];

        const routes = [];
        const criticalZones = Array.from(this.zones.values()).filter(z => z.isCritical && z.id !== zoneId);

        for (const exitZone of this.exitZones) {
            const alternativeRoute = this.bfsTraversal.findAlternativeRoutes(zone, exitZone, criticalZones);
            if (alternativeRoute) {
                routes.push({
                    path: alternativeRoute,
                    exitZone: exitZone.name,
                    congestionScore: this.bfsTraversal.calculateCongestionScore(alternativeRoute)
                });
            }
        }

        return routes.sort((a, b) => a.congestionScore - b.congestionScore);
    }

    // Get system overview
    getSystemOverview() {
        const zones = Array.from(this.zones.values());
        const totalCapacity = zones.reduce((sum, zone) => sum + zone.capacity, 0);
        const totalCrowd = zones.reduce((sum, zone) => sum + zone.currentCrowd, 0);
        const criticalZones = zones.filter(zone => zone.isCritical);
        const averageCongestion = zones.reduce((sum, zone) => sum + zone.congestionLevel, 0) / zones.length;

        return {
            totalZones: zones.length,
            totalCapacity,
            totalCrowd,
            overallUtilization: (totalCrowd / totalCapacity) * 100,
            criticalZones: criticalZones.length,
            averageCongestion,
            exitZones: this.exitZones.length,
            emergencyActive: this.emergencyActive,
            zonesStatus: zones.map(zone => zone.getStatus())
        };
    }

    // Start real-time monitoring
    startMonitoring(intervalMs = 5000) {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }

        this.monitoringInterval = setInterval(() => {
            const overview = this.getSystemOverview();
            console.log('\n📊 SYSTEM MONITORING UPDATE');
            console.log(`Total Crowd: ${overview.totalCrowd}/${overview.totalCapacity}`);
            console.log(`Overall Utilization: ${overview.overallUtilization.toFixed(1)}%`);
            console.log(`Critical Zones: ${overview.criticalZones}`);
            console.log(`Average Congestion: ${overview.averageCongestion.toFixed(1)}%`);
            
            this.checkForCriticalSituations();
        }, intervalMs);

        console.log('🔄 Monitoring started');
    }

    // Stop monitoring
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
            console.log('⏹️  Monitoring stopped');
        }
    }

    // Emergency evacuation procedure
    initiateEmergencyEvacuation() {
        this.emergencyActive = true;
        console.log('🚨 EMERGENCY EVACUATION INITIATED');

        const evacuationPlan = [];
        
        // Find all zones with people
        const occupiedZones = Array.from(this.zones.values())
            .filter(zone => zone.currentCrowd > 0)
            .sort((a, b) => b.congestionLevel - a.congestionLevel); // Prioritize high congestion zones

        occupiedZones.forEach(zone => {
            const routes = this.bfsTraversal.findEvacuationRoutes(zone, this.exitZones, zone.currentCrowd);
            if (routes.length > 0) {
                evacuationPlan.push({
                    zone: zone.name,
                    crowd: zone.currentCrowd,
                    route: routes[0].path.map(z => z.name),
                    estimatedTime: routes[0].distance * 2, // Assume 2 minutes per zone
                    priority: zone.isCritical ? 'HIGH' : 'NORMAL'
                });
            }
        });

        console.log('📋 EVACUATION PLAN:');
        evacuationPlan.forEach((plan, index) => {
            console.log(`${index + 1}. ${plan.zone} (${plan.crowd} people) - Priority: ${plan.priority}`);
            console.log(`   Route: ${plan.route.join(' → ')}`);
            console.log(`   Estimated Time: ${plan.estimatedTime} minutes\n`);
        });

        return evacuationPlan;
    }

    // Simulate crowd flow over time
    simulateCrowdFlow(duration = 60000, interval = 1000) {
        console.log(`🎬 Starting crowd flow simulation for ${duration/1000} seconds`);
        
        let elapsed = 0;
        const simulationInterval = setInterval(() => {
            // Randomly add/remove people from zones
            const zones = Array.from(this.zones.values());
            const randomZone = zones[Math.floor(Math.random() * zones.length)];
            
            const change = Math.floor(Math.random() * 20) - 10; // -10 to +10 people
            
            if (change > 0) {
                randomZone.addCrowd(change);
            } else {
                randomZone.removeCrowd(Math.abs(change));
            }

            elapsed += interval;
            
            if (elapsed >= duration) {
                clearInterval(simulationInterval);
                console.log('🎬 Simulation completed');
            }
        }, interval);
    }
}

module.exports = CrowdManagementSystem;
