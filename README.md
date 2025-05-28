# Dragon Game

A 2D platformer game built with React, TypeScript, and Phaser.js featuring multiple playable characters.

## Features

- **Multiple Characters**: Choose from 3 different player characters (Player 1, Player 2, Player 3)
- **Smooth Animations**: Optimized animation system with stable sprite transitions
- **Multiple Stages**: Progress through different challenging levels
- **Touch Controls**: Mobile-friendly touch controls for movement and jumping
- **Lives System**: Health management with respawn mechanics
- **Enemy Variety**: Face different types of enemies including slimes, bats, and spikes

## Recent Improvements

- **Fixed Animation Flickering**: Resolved rapid texture switching issues for Player 2 and Player 3
- **Stable State Management**: Improved animation state transitions to prevent visual glitches
- **Optimized Performance**: Reduced unnecessary texture updates for smoother gameplay

## Tech Stack

- **React** + **TypeScript** for UI framework
- **Phaser.js** for game engine
- **Vite** for build tooling
- **ESLint** for code quality

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/Satoshi5884/dragon-game.git
cd dragon-game
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Game Controls

- **Arrow Keys** or **WASD**: Move left/right
- **Space** or **Up Arrow**: Jump (double jump available)
- **Touch Controls**: Use on-screen buttons for mobile devices

## Project Structure

```
src/
├── game/
│   ├── scenes/          # Game scenes (Menu, Stages, UI)
│   ├── sprites/         # Player and Enemy classes
│   └── utils/           # Utility functions
├── assets/              # Game assets
└── App.tsx             # Main React component
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).
