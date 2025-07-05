class Zone {
    constructor(id, name, capacity, x, y) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
        this.currentCrowd = 0;
        this.position = { x, y };
        this.adjacentZones = [];
        this.isEvacuationRoute = false;
        this.isCritical = false;
        this.congestionLevel = 0; // 0-100 scale
    }

    // Add adjacent zone for graph connectivity
    addAdjacentZone(zone) {
        if (!this.adjacentZones.includes(zone)) {
            this.adjacentZones.push(zone);
        }
    }

    // Calculate congestion level based on current crowd vs capacity
    updateCongestionLevel() {
        this.congestionLevel = Math.min(100, (this.currentCrowd / this.capacity) * 100);
        this.isCritical = this.congestionLevel > 80;
    }

    // Check if zone can accommodate additional people
    canAccommodate(additionalPeople) {
        return (this.currentCrowd + additionalPeople) <= this.capacity;
    }

    // Add people to zone
    addCrowd(count) {
        this.currentCrowd = Math.min(this.currentCrowd + count, this.capacity);
        this.updateCongestionLevel();
    }

    // Remove people from zone
    removeCrowd(count) {
        this.currentCrowd = Math.max(0, this.currentCrowd - count);
        this.updateCongestionLevel();
    }

    // Calculate distance to another zone
    distanceTo(otherZone) {
        const dx = this.position.x - otherZone.position.x;
        const dy = this.position.y - otherZone.position.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Get zone status
    getStatus() {
        return {
            id: this.id,
            name: this.name,
            currentCrowd: this.currentCrowd,
            capacity: this.capacity,
            congestionLevel: this.congestionLevel,
            isCritical: this.isCritical,
            isEvacuationRoute: this.isEvacuationRoute,
            utilizationRate: (this.currentCrowd / this.capacity) * 100
        };
    }
}

module.exports = Zone;
