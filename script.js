class CrowdSimulation {
    constructor() {
        this.gridSize = 20;
        this.grid = [];
        this.people = [];
        this.exits = [];
        this.obstacles = [];
        this.congestionMap = [];
        this.stepCount = 0;
        this.isRunning = false;
        this.autoRunInterval = null;
        
        this.initializeGrid();
        this.setupEventListeners();
        this.reset();
    }
    
    initializeGrid() {
        const gridElement = document.getElementById('grid');
        
        for (let row = 0; row < this.gridSize; row++) {
            this.grid[row] = [];
            this.congestionMap[row] = [];
            
            for (let col = 0; col < this.gridSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell empty';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // Add click event for manual editing
                cell.addEventListener('click', (e) => this.handleCellClick(e));
                
                gridElement.appendChild(cell);
                this.grid[row][col] = 'empty';
                this.congestionMap[row][col] = 0;
            }
        }
    }
    
    setupEventListeners() {
        document.getElementById('nextStepBtn').addEventListener('click', () => this.nextStep());
        document.getElementById('autoRunBtn').addEventListener('click', () => this.toggleAutoRun());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
    }
    
    handleCellClick(event) {
        if (this.isRunning) return;
        
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);
        
        // Cycle through cell types: empty -> person -> exit -> obstacle -> empty
        const currentType = this.grid[row][col];
        let newType;
        
        switch (currentType) {
            case 'empty':
                newType = 'person';
                this.people.push({ row, col });
                break;
            case 'person':
                newType = 'exit';
                this.people = this.people.filter(p => !(p.row === row && p.col === col));
                this.exits.push({ row, col });
                break;
            case 'exit':
                newType = 'obstacle';
                this.exits = this.exits.filter(e => !(e.row === row && e.col === col));
                this.obstacles.push({ row, col });
                break;
            case 'obstacle':
                newType = 'empty';
                this.obstacles = this.obstacles.filter(o => !(o.row === row && o.col === col));
                break;
        }
        
        this.grid[row][col] = newType;
        this.updateDisplay();
    }
    
    reset() {
        this.stepCount = 0;
        this.isRunning = false;
        this.people = [];
        this.exits = [];
        this.obstacles = [];
        
        // Clear auto run
        if (this.autoRunInterval) {
            clearInterval(this.autoRunInterval);
            this.autoRunInterval = null;
        }
        
        // Reset grid
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                this.grid[row][col] = 'empty';
                this.congestionMap[row][col] = 0;
            }
        }
        
        // Add some default setup
        this.addDefaultSetup();
        this.updateDisplay();
    }
    
    addDefaultSetup() {
        // Add some exits
        this.exits.push({ row: 0, col: 10 });
        this.exits.push({ row: 19, col: 10 });
        this.exits.push({ row: 10, col: 0 });
        this.exits.push({ row: 10, col: 19 });
        
        // Add some obstacles
        for (let i = 5; i < 15; i++) {
            this.obstacles.push({ row: 8, col: i });
            this.obstacles.push({ row: 12, col: i });
        }
        
        // Add some people
        for (let i = 0; i < 30; i++) {
            let row, col;
            do {
                row = Math.floor(Math.random() * this.gridSize);
                col = Math.floor(Math.random() * this.gridSize);
            } while (this.grid[row][col] !== 'empty');
            
            this.people.push({ row, col });
        }
        
        // Update grid
        this.exits.forEach(exit => {
            this.grid[exit.row][exit.col] = 'exit';
        });
        
        this.obstacles.forEach(obstacle => {
            this.grid[obstacle.row][obstacle.col] = 'obstacle';
        });
        
        this.people.forEach(person => {
            this.grid[person.row][person.col] = 'person';
        });
    }
    
    nextStep() {
        if (this.people.length === 0) return;
        
        this.stepCount++;
        
        // Clear congestion map
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                this.congestionMap[row][col] = 0;
            }
        }
        
        // Calculate new positions for all people
        const newPositions = [];
        
        for (const person of this.people) {
            const nextPos = this.findNextPosition(person);
            if (nextPos) {
                newPositions.push(nextPos);
                this.congestionMap[nextPos.row][nextPos.col]++;
            }
        }
        
        // Clear current people positions
        this.people.forEach(person => {
            if (this.grid[person.row][person.col] === 'person') {
                this.grid[person.row][person.col] = 'empty';
            }
        });
        
        // Update people positions and remove those who reached exits
        this.people = [];
        
        for (const pos of newPositions) {
            if (this.grid[pos.row][pos.col] === 'exit') {
                // Person reached exit, don't add them back
                continue;
            } else {
                this.people.push(pos);
                this.grid[pos.row][pos.col] = 'person';
            }
        }
        
        this.updateDisplay();
        
        // Stop auto run if no people left
        if (this.people.length === 0 && this.autoRunInterval) {
            this.toggleAutoRun();
        }
    }
    
    findNextPosition(person) {
        if (this.exits.length === 0) return person;
        
        // Find nearest exit using BFS
        const nearestExit = this.findNearestExit(person);
        if (!nearestExit) return person;
        
        // Get path to nearest exit
        const path = this.bfsPath(person, nearestExit);
        if (path.length <= 1) return person;
        
        // Return next position in path
        return path[1];
    }
    
    findNearestExit(person) {
        let nearestExit = null;
        let minDistance = Infinity;
        
        for (const exit of this.exits) {
            const distance = Math.abs(person.row - exit.row) + Math.abs(person.col - exit.col);
            if (distance < minDistance) {
                minDistance = distance;
                nearestExit = exit;
            }
        }
        
        return nearestExit;
    }
    
    bfsPath(start, end) {
        const queue = [{ ...start, path: [start] }];
        const visited = new Set();
        const directions = [
            { row: -1, col: 0 }, // up
            { row: 1, col: 0 },  // down
            { row: 0, col: -1 }, // left
            { row: 0, col: 1 }   // right
        ];
        
        while (queue.length > 0) {
            const current = queue.shift();
            const key = `${current.row},${current.col}`;
            
            if (visited.has(key)) continue;
            visited.add(key);
            
            if (current.row === end.row && current.col === end.col) {
                return current.path;
            }
            
            for (const dir of directions) {
                const newRow = current.row + dir.row;
                const newCol = current.col + dir.col;
                
                if (this.isValidMove(newRow, newCol)) {
                    const newKey = `${newRow},${newCol}`;
                    if (!visited.has(newKey)) {
                        queue.push({
                            row: newRow,
                            col: newCol,
                            path: [...current.path, { row: newRow, col: newCol }]
                        });
                    }
                }
            }
        }
        
        return [start]; // No path found
    }
    
    isValidMove(row, col) {
        // Check bounds
        if (row < 0 || row >= this.gridSize || col < 0 || col >= this.gridSize) {
            return false;
        }
        
        // Check if it's an obstacle
        if (this.grid[row][col] === 'obstacle') {
            return false;
        }
        
        return true;
    }
    
    toggleAutoRun() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.autoRunInterval);
            this.autoRunInterval = null;
            document.getElementById('autoRunBtn').textContent = 'Auto Run';
        } else {
            this.isRunning = true;
            this.autoRunInterval = setInterval(() => {
                this.nextStep();
            }, 500);
            document.getElementById('autoRunBtn').textContent = 'Stop';
        }
    }
    
    updateDisplay() {
        const cells = document.querySelectorAll('.cell');
        
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            const cellType = this.grid[row][col];
            const congestion = this.congestionMap[row][col];
            
            // Clear all classes
            cell.className = 'cell';
            
            // Add appropriate class
            if (cellType === 'person') {
                cell.classList.add('person');
                cell.textContent = '●';
            } else if (cellType === 'exit') {
                cell.classList.add('exit');
                cell.textContent = '✓';
            } else if (cellType === 'obstacle') {
                cell.classList.add('obstacle');
                cell.textContent = '■';
            } else {
                cell.classList.add('empty');
                cell.textContent = '';
                
                // Add congestion coloring
                if (congestion > 0) {
                    const congestionLevel = Math.min(congestion, 10);
                    cell.classList.add(`congestion-${congestionLevel}`);
                }
            }
        });
        
        // Update counters
        document.getElementById('stepCounter').textContent = this.stepCount;
        document.getElementById('peopleCounter').textContent = this.people.length;
    }
}

// Initialize the simulation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CrowdSimulation();
});
