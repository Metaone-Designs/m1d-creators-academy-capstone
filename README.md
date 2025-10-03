🎓 Creators Academy - Capstone Project
Welcome to the Creators Academy Capstone! This Decentraland scene is a grand showcase that merges multiple distinct projects and technologies into a single, interactive, and feature-rich world. It serves as both a demonstration of what's possible with the Decentraland SDK 7 and a living educational resource for the entire creator community.

This project was built as a collaborative effort between MrJStickel and Gemini AI, demonstrating a powerful new workflow for rapid development and creative problem-solving in the metaverse.

✨ Scene Features
This world is a testament to modern scene development, packed with a diverse set of features that bring it to life:

*   **Multiple Video Screens**: Large-format curved screens serve as a main stage backdrop, powered by the latest video texture technology.
*   **Interactive Animated Centerpiece**: A complex animated object with three distinct states (Idle, Proximity, Click) that respond dynamically to player presence and interaction.
*   **AI-Generated Zen Garden**: A serene floating sculpture garden with animated platforms, lightning effects, and pulsing lights, largely designed and coded with AI assistance.
*   **Interactive Nightclub**: A dynamic dance floor with pulsing colors and moving lights that can be toggled by players via an in-world control panel.
*   **Bonus Feature: Walk-in Teleporter**: A seamless teleporter pad that transports players to a VIP lounge, complete with visual and audio feedback, activation effects, and a cooldown system.
*   **Modular & Organized Codebase**: The entire project is built using a clean, modular structure, making it easy to understand, maintain, and expand upon.
*   **Bonus Feature: Dynamic UI Controls**: In-world UI panels provide control over scene elements, such as a toggle for the video player.
*   **Custom 3D Models**: The scene is built with custom `.glb` models, all optimized for performance in Decentraland.

### Scene Modules

This project is a combination of several smaller scenes, each demonstrating different SDK 7 capabilities.

*   **Main Venue & Video**: The core structure, featuring multiple large video screens.
*   **Animated Centerpiece (`animated_centerpiece.ts`)**: A state machine-driven animated model that reacts to player proximity and clicks.
*   **AI Zen Garden (`ai_gen_Sculpt/`)**: A complete mini-scene demonstrating procedural animation, particle effects (lightning), and interactive elements.
*   **Nightclub FX (`dancefloor/`)**: A module for creating an interactive dance floor and controllable club lights, showcasing systems and material manipulation.
*   **Teleporter (`teleporter.ts`)**: A reusable teleporter system with clear player feedback and a cooldown mechanism.

🚀 Getting Started
To explore and run this scene locally, you'll need the Decentraland SDK installed.

Clone the Repository (if you haven't already).

Navigate to the Project Directory in your terminal.

Install Dependencies: This command downloads all the necessary libraries for the project.

```bash
npm install
```

Run the Scene Preview: This command starts a local server and opens the scene in a new browser tab. The preview will automatically update whenever you save a change in the code.

```bash
npm run start
```

🛠️ Project Structure
The project is organized into a clean, modular structure for easy navigation, precisely as follows:

```
.
├── models/
│   ├── Anim_3Actions.glb
│   ├── CA_WS1-4_Building.glb
│   └── curved_screen.glb
├── package.json
├── scene.json
├── src/
│   ├── index.ts
│   ├── modules/
│   │   ├── centerpiece.ts
│   │   ├── screen.ts
│   │   ├── teleporter.ts
│   │   └── venue.ts
│   └── ui/
│       └── components/
│           ├── SkyboxSlider.tsx
│           └── VideoControls.tsx
└── tsconfig.json
```

A New Era of Creation
This project stands as a powerful example of the synergy between human creativity and artificial intelligence. Gemini AI was instrumental throughout the development process, assisting with:

Conceptualization & Design: Brainstorming features and designing interactive systems.

Code Generation & Debugging: Writing the majority of the scene's TypeScript code, from the complex animation state machine to the UI components, and helping to troubleshoot SDK-specific challenges.

3D Workflow Guidance: Providing detailed, step-by-step instructions for the entire Blender workflow, including modeling, animation, and export best practices.

This collaborative workflow represents a significant leap forward in creative development, enabling faster iteration and the creation of more complex and engaging virtual experiences.

Built by MrJStickel with Gemini AI