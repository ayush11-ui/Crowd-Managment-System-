class BFSTraversal {
    constructor() {
        this.visited = new Set();
        this.queue = [];
        this.path = [];
    }

    // Find shortest path between two zones using BFS
    findShortestPath(startZone, endZone) {
        if (!startZone || !endZone) {
            return null;
        }

        if (startZone.id === endZone.id) {
            return [startZone];
        }

        const queue = [{ zone: startZone, path: [startZone] }];
        const visited = new Set([startZone.id]);

        while (queue.length > 0) {
            const { zone: currentZone, path } = queue.shift();

            // Check all adjacent zones
            for (const adjacentZone of currentZone.adjacentZones) {
                if (!visited.has(adjacentZone.id)) {
                    const newPath = [...path, adjacentZone];
                    
                    // Found the target zone
                    if (adjacentZone.id === endZone.id) {
                        return newPath;
                    }

                    visited.add(adjacentZone.id);
                    queue.push({ zone: adjacentZone, path: newPath });
                }
            }
        }

        return null; // No path found
    }

    // Find all zones within a certain distance using BFS
    findZonesWithinDistance(startZone, maxDistance) {
        if (!startZone) return [];

        const queue = [{ zone: startZone, distance: 0 }];
        const visited = new Set([startZone.id]);
        const result = [];

        while (queue.length > 0) {
            const { zone: currentZone, distance } = queue.shift();
            
            result.push({ zone: currentZone, distance });

            // Don't traverse beyond max distance
            if (distance >= maxDistance) continue;

            for (const adjacentZone of currentZone.adjacentZones) {
                if (!visited.has(adjacentZone.id)) {
                    visited.add(adjacentZone.id);
                    queue.push({ zone: adjacentZone, distance: distance + 1 });
                }
            }
        }

        return result;
    }

    // Find optimal evacuation routes using BFS with capacity constraints
    findEvacuationRoutes(startZone, exitZones, crowdSize) {
        if (!startZone || !exitZones || exitZones.length === 0) {
            return [];
        }

        const routes = [];

        for (const exitZone of exitZones) {
            const path = this.findShortestPath(startZone, exitZone);
            if (path) {
                const routeCapacity = this.calculateRouteCapacity(path);
                const congestionScore = this.calculateCongestionScore(path);
                
                routes.push({
                    path,
                    exitZone,
                    capacity: routeCapacity,
                    congestionScore,
                    distance: path.length - 1,
                    canAccommodate: routeCapacity >= crowdSize
                });
            }
        }

        // Sort by best route (lowest congestion, highest capacity, shortest distance)
        return routes.sort((a, b) => {
            if (a.canAccommodate && !b.canAccommodate) return -1;
            if (!a.canAccommodate && b.canAccommodate) return 1;
            
            const scoreA = a.congestionScore + (a.distance * 0.1);
            const scoreB = b.congestionScore + (b.distance * 0.1);
            
            return scoreA - scoreB;
        });
    }

    // Calculate the minimum capacity along a route
    calculateRouteCapacity(path) {
        if (!path || path.length === 0) return 0;
        
        return Math.min(...path.map(zone => zone.capacity - zone.currentCrowd));
    }

    // Calculate congestion score for a route
    calculateCongestionScore(path) {
        if (!path || path.length === 0) return 100;
        
        const totalCongestion = path.reduce((sum, zone) => sum + zone.congestionLevel, 0);
        return totalCongestion / path.length;
    }

    // Find all connected zones from a starting zone
    findConnectedZones(startZone) {
        if (!startZone) return [];

        const queue = [startZone];
        const visited = new Set([startZone.id]);
        const connectedZones = [];

        while (queue.length > 0) {
            const currentZone = queue.shift();
            connectedZones.push(currentZone);

            for (const adjacentZone of currentZone.adjacentZones) {
                if (!visited.has(adjacentZone.id)) {
                    visited.add(adjacentZone.id);
                    queue.push(adjacentZone);
                }
            }
        }

        return connectedZones;
    }

    // Find critical zones (high congestion) within a certain radius
    findCriticalZones(startZone, radius, threshold = 80) {
        const zonesInRadius = this.findZonesWithinDistance(startZone, radius);
        
        return zonesInRadius
            .filter(({ zone }) => zone.congestionLevel >= threshold)
            .sort((a, b) => b.zone.congestionLevel - a.zone.congestionLevel);
    }

    // Find alternative routes avoiding high congestion zones
    findAlternativeRoutes(startZone, endZone, avoidZones = []) {
        if (!startZone || !endZone) return null;

        const avoidIds = new Set(avoidZones.map(zone => zone.id));
        const queue = [{ zone: startZone, path: [startZone] }];
        const visited = new Set([startZone.id]);

        while (queue.length > 0) {
            const { zone: currentZone, path } = queue.shift();

            for (const adjacentZone of currentZone.adjacentZones) {
                // Skip zones we want to avoid
                if (avoidIds.has(adjacentZone.id)) continue;
                
                if (!visited.has(adjacentZone.id)) {
                    const newPath = [...path, adjacentZone];
                    
                    if (adjacentZone.id === endZone.id) {
                        return newPath;
                    }

                    visited.add(adjacentZone.id);
                    queue.push({ zone: adjacentZone, path: newPath });
                }
            }
        }

        return null;
    }
}

module.exports = BFSTraversal;
