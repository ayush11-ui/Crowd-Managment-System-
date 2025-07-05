#!/usr/bin/env node

const CrowdManagementSystem = require('./CrowdManagementSystem');

// Main entry point
console.log('🏟️  Crowd Management System - Zone-based BFS Graph Traversal');
console.log('================================================================\n');

// Check if demo mode is requested
const args = process.argv.slice(2);
const isDemoMode = args.includes('--demo') || args.includes('-d');

if (isDemoMode) {
    console.log('🎬 Running in demo mode...\n');
    require('./demo');
} else {
    // Interactive mode
    console.log('🚀 Interactive mode - Create your own crowd management system\n');
    
    const cms = new CrowdManagementSystem();
    
    // Example: Basic setup
    console.log('📝 Example: Setting up a basic venue...');
    
    // Add some zones
    cms.addZone('A1', 'Entrance Hall', 100, 0, 0);
    cms.addZone('B1', 'Main Hall', 200, 1, 0);
    cms.addZone('C1', 'Exit Hall', 80, 2, 0);
    
    // Connect zones
    cms.connectZones('A1', 'B1');
    cms.connectZones('B1', 'C1');
    
    // Set exit
    cms.addExitZone('C1');
    
    // Add some crowd
    cms.moveCrowdToZone('A1', 50);
    cms.moveCrowdToZone('B1', 80);
    
    // Show system status
    const overview = cms.getSystemOverview();
    console.log('\n📊 System Overview:');
    console.log(`Total Zones: ${overview.totalZones}`);
    console.log(`Total Capacity: ${overview.totalCapacity}`);
    console.log(`Current Crowd: ${overview.totalCrowd}`);
    console.log(`Overall Utilization: ${overview.overallUtilization.toFixed(1)}%\n`);
    
    console.log('🔍 Finding evacuation route from Entrance Hall...');
    const route = cms.findOptimalEvacuationRoute('A1', 50);
    if (route) {
        console.log(`Best route: ${route.path.map(z => z.name).join(' → ')}`);
        console.log(`Distance: ${route.distance} zones`);
        console.log(`Congestion Score: ${route.congestionScore.toFixed(1)}\n`);
    }
    
    console.log('💡 Usage Tips:');
    console.log('- Run with --demo or -d flag to see full demonstration');
    console.log('- Import CrowdManagementSystem class to create custom systems');
    console.log('- Use BFS algorithms for optimal pathfinding and crowd flow');
    console.log('- Monitor zones in real-time for critical situations\n');
    
    // Export the system for external use
    global.crowdManagementSystem = cms;
}

// Export for module usage
module.exports = { CrowdManagementSystem };
