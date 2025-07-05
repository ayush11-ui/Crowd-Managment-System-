const CrowdManagementSystem = require('./CrowdManagementSystem');

// Create a new crowd management system
const cms = new CrowdManagementSystem();

// Demo: Stadium/Concert Venue Layout
console.log('🏟️  Initializing Stadium Crowd Management System...\n');

// Add zones representing different areas of a stadium
const entrance = cms.addZone('ENT1', 'Main Entrance', 200, 0, 0);
const concourse = cms.addZone('CON1', 'Main Concourse', 500, 1, 0);
const section1 = cms.addZone('SEC1', 'Section A', 300, 2, 1);
const section2 = cms.addZone('SEC2', 'Section B', 300, 2, -1);
const section3 = cms.addZone('SEC3', 'Section C', 250, 3, 1);
const section4 = cms.addZone('SEC4', 'Section D', 250, 3, -1);
const foodCourt = cms.addZone('FOOD', 'Food Court', 150, 1, 1);
const restrooms = cms.addZone('REST', 'Restrooms', 100, 1, -1);
const emergency1 = cms.addZone('EMR1', 'Emergency Exit 1', 100, 4, 1);
const emergency2 = cms.addZone('EMR2', 'Emergency Exit 2', 100, 4, -1);

// Connect zones to create the venue layout
console.log('🔗 Connecting zones...');
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

console.log('✅ Stadium layout created successfully!\n');

// Simulate initial crowd arrival
console.log('👥 Simulating initial crowd arrival...');
cms.moveCrowdToZone('ENT1', 150);
cms.moveCrowdToZone('CON1', 200);
cms.moveCrowdToZone('SEC1', 180);
cms.moveCrowdToZone('SEC2', 160);
cms.moveCrowdToZone('FOOD', 80);

// Display initial system status
console.log('\n📊 Initial System Status:');
const overview = cms.getSystemOverview();
console.log(`Total Zones: ${overview.totalZones}`);
console.log(`Total Capacity: ${overview.totalCapacity}`);
console.log(`Current Crowd: ${overview.totalCrowd}`);
console.log(`Overall Utilization: ${overview.overallUtilization.toFixed(1)}%`);
console.log(`Critical Zones: ${overview.criticalZones}\n`);

// Demonstrate BFS pathfinding
console.log('🔍 Demonstrating BFS Pathfinding...');
const evacuationRoute = cms.findOptimalEvacuationRoute('SEC1', 150);
if (evacuationRoute) {
    console.log(`Best evacuation route from Section A:`);
    console.log(`Path: ${evacuationRoute.path.map(z => z.name).join(' → ')}`);
    console.log(`Distance: ${evacuationRoute.distance} zones`);
    console.log(`Congestion Score: ${evacuationRoute.congestionScore.toFixed(1)}`);
    console.log(`Can accommodate 150 people: ${evacuationRoute.canAccommodate ? 'Yes' : 'No'}\n`);
}

// Create overcrowding scenario
console.log('⚠️  Creating overcrowding scenario...');
cms.moveCrowdToZone('SEC1', 100); // This should make Section A critical
cms.moveCrowdToZone('SEC2', 120); // This should make Section B critical

// Demonstrate crowd redistribution
console.log('🔄 Demonstrating crowd redistribution...');
const redistribution = cms.redistributeCrowd('SEC1', 50);
if (redistribution.success) {
    console.log(`✅ ${redistribution.message}`);
    console.log(`Redistribution path: ${redistribution.path.join(' → ')}`);
    console.log(`Source zone after: ${redistribution.sourceZone.congestionLevel.toFixed(1)}% congestion`);
    console.log(`Target zone after: ${redistribution.targetZone.congestionLevel.toFixed(1)}% congestion\n`);
}

// Emergency evacuation demonstration
console.log('🚨 Demonstrating emergency evacuation...');
const evacuationPlan = cms.initiateEmergencyEvacuation();

// Show final system status
console.log('\n📊 Final System Status:');
const finalOverview = cms.getSystemOverview();
console.log('Zone Status:');
finalOverview.zonesStatus.forEach(zone => {
    const statusIcon = zone.isCritical ? '🔴' : zone.congestionLevel > 50 ? '🟡' : '🟢';
    console.log(`${statusIcon} ${zone.name}: ${zone.currentCrowd}/${zone.capacity} (${zone.congestionLevel.toFixed(1)}%)`);
});

// Demonstrate real-time monitoring (for 10 seconds)
console.log('\n🔄 Starting 10-second monitoring demo...');
cms.startMonitoring(2000);

// Start crowd flow simulation
cms.simulateCrowdFlow(10000, 1000);

// Clean up after demo
setTimeout(() => {
    cms.stopMonitoring();
    console.log('\n🎉 Demo completed successfully!');
    console.log('\n📚 Key Features Demonstrated:');
    console.log('✅ Zone-based crowd management');
    console.log('✅ BFS graph traversal for pathfinding');
    console.log('✅ Optimal evacuation route calculation');
    console.log('✅ Crowd redistribution algorithms');
    console.log('✅ Real-time monitoring and alerts');
    console.log('✅ Emergency evacuation procedures');
    console.log('✅ Critical situation detection');
    console.log('✅ Dynamic crowd flow simulation');
}, 12000);

// Export for testing
module.exports = { cms };
