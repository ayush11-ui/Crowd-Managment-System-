# 🚶‍♂️ Crowd Management Simulation

A web-based interactive simulation that demonstrates crowd evacuation dynamics using BFS (Breadth-First Search) pathfinding algorithm. Watch as people (blue dots) navigate through obstacles to reach the nearest exits while avoiding congestion.

![Crowd Management Simulation](https://img.shields.io/badge/Status-Complete-brightgreen)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## ✨ Features

- **Interactive 20×20 Grid**: Click cells to place people, exits, and obstacles
- **BFS Pathfinding**: Optimal path calculation using Breadth-First Search algorithm
- **Real-time Simulation**: Watch crowd movement step by step
- **Congestion Visualization**: Color-coded congestion levels (white to red)
- **Obstacle Avoidance**: Smart navigation around barriers
- **Clean UI**: Modern design with Peace Sans font
- **Responsive Design**: Works on desktop and mobile devices

## 🎮 How to Use

### Controls
- **Next Step**: Advance simulation by one step
- **Auto Run**: Start/stop automatic simulation
- **Reset**: Reset to default configuration

### Interaction
- **Click any cell** to cycle through types:
  - Empty (white) → Person (blue) → Exit (green) → Obstacle (black) → Empty

### Legend
- 🔵 **Blue Dots**: People trying to evacuate
- 🟢 **Green Squares**: Exit points
- ⬜ **Black Squares**: Obstacles/barriers
- 🔴 **Red Gradient**: Congestion levels

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software required!

### Installation
1. **Download the project**:
   ```bash
   git clone https://github.com/yourusername/crowd-management-system.git
   cd crowd-management-system
   ```

2. **Run the simulation**:
   - Double-click `index.html` to open in your browser
   - Or use a local server for better performance

### Using Live Server (Recommended)
If you have VS Code with Live Server extension:
1. Right-click on `index.html`
2. Select "Open with Live Server"
3. Simulation will open with live reload

## 🏗️ Project Structure

```
crowd-management-system/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling with Peace Sans font
├── script.js           # JavaScript logic and BFS algorithm
└── README.md          # This file
```

## 🧠 Algorithm Explained

### BFS Pathfinding
The simulation uses **Breadth-First Search (BFS)** to find optimal paths:

1. **Queue-based exploration**: Uses FIFO queue for level-by-level search
2. **Shortest path guarantee**: Always finds the minimum distance path
3. **Obstacle avoidance**: Automatically navigates around barriers
4. **Multiple exits**: Calculates distance to all exits and chooses nearest

### Key Functions
- `bfsPath(start, end)`: Core BFS implementation
- `findNearestExit(person)`: Locates closest exit
- `isValidMove(row, col)`: Validates movement (bounds + obstacles)
- `nextStep()`: Advances simulation by one step

### Congestion Algorithm
- Tracks how many people want to move to each cell
- Colors cells based on congestion level (1-10+ people)
- Visualizes bottlenecks and crowded areas

## 🎨 Customization

### Adding More People
- Click on empty cells to add people
- Default setup includes 30 people

### Creating Custom Scenarios
- **Bottlenecks**: Add obstacles to create narrow passages
- **Maze-like**: Create complex obstacle patterns
- **Multiple Exits**: Add exits at different locations
- **Emergency Scenarios**: Block certain exits to test evacuation

### Styling
- Modify `styles.css` to change colors, fonts, or layout
- Peace Sans font provides clean, modern appearance
- Responsive design adapts to different screen sizes

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Structure and semantic markup
- **CSS3**: Styling with gradients, animations, and responsive design
- **Vanilla JavaScript**: No external dependencies
- **BFS Algorithm**: Graph traversal for pathfinding

### Performance
- Efficient O(V + E) BFS implementation
- Smooth animations with CSS transitions
- Handles up to 100+ people simultaneously

### Browser Compatibility
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 📱 Mobile Support

The simulation is fully responsive and works on:
- Smartphones (portrait/landscape)
- Tablets
- Desktop computers
- Touch and mouse interactions

## 🎯 Use Cases

### Educational
- **Algorithm Visualization**: Understand BFS pathfinding
- **Computer Science**: Graph theory and search algorithms
- **Data Structures**: Queue implementation demonstration

### Research & Analysis
- **Crowd Dynamics**: Study evacuation patterns
- **Emergency Planning**: Test different exit configurations
- **Bottleneck Analysis**: Identify congestion points

### Entertainment
- **Interactive Demo**: Engaging way to learn algorithms
- **Puzzle Solving**: Create challenging evacuation scenarios

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Ideas for Contributions
- Add diagonal movement
- Implement A* pathfinding
- Add different crowd types
- Create preset scenarios
- Add sound effects
- Implement save/load functionality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **BFS Algorithm**: Classic graph traversal technique
- **Peace Sans Font**: Google Fonts for clean typography
- **CSS Grid**: Modern layout system
- **Responsive Design**: Mobile-first approach

## 📸 Screenshots

### Default Setup
![Default simulation setup with people, exits, and obstacles]

### Congestion Visualization
![Congestion levels shown in red gradient]

### Custom Scenario
![User-created maze-like obstacle pattern]

## 🐛 Known Issues

- None currently reported
- Please open an issue if you find any bugs

## 🔮 Future Enhancements

- [ ] Diagonal movement support
- [ ] Multiple crowd types with different behaviors
- [ ] Real-time statistics and analytics
- [ ] Export simulation data
- [ ] 3D visualization mode
- [ ] Sound effects and animations
- [ ] Multiplayer collaboration

## 📞 Contact

- **Author**: Ayush Kumar
- **Email**: ash43890@gmail.com 
- **GitHub**: https://github.com/ayush11-ui

---

⭐ **Star this repository** if you found it helpful!

🚀 **Share with friends** to spread the knowledge!

📚 **Learn more** about algorithms and data structures!
