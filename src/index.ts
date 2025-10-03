// src/index.ts

// Creators Academy Capstone Project - Main Entry Point
// This file brings together all the different elements of the scene.

// --- MODULE IMPORTS ---
// Each module is a self-contained feature of the scene.

import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { engine, GltfContainer, GltfNodeModifiers, Material, Transform, VideoPlayer } from '@dcl/sdk/ecs'
import { getPlayer } from '@dcl/sdk/players'
import { VideoToggleButton } from './videotexture_toGLB'
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { createAnimatedCenterpiece } from './animated_centerpiece'

// Import creation functions for different parts of the scene
import { createScenery } from './ai_gen_Sculpt/scenery'
import { createMovingPlatforms } from './ai_gen_Sculpt/platforms'
import { createClickableCrystal } from './ai_gen_Sculpt/interaction'
import { createLightningEffects } from './ai_gen_Sculpt/lightning'
import { createPulsingLights } from './ai_gen_Sculpt/effects'
import { createInteractiveFX } from './dancefloor/fx'
import { createTeleporter } from './teleporter'

export async function main() {
  // Get player data to be used in other parts of the scene
  const player = await getPlayer()

  // --- VIDEO SCREEN SETUP ---
  // This section sets up the video screen and its frame.

  // Create an entity for the video screen frame
  const videoscreenFrame = engine.addEntity()
  Transform.create(videoscreenFrame, {
    position: Vector3.create(0, 0, 0),
    rotation: Quaternion.fromEulerDegrees(0, 0, 0),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(videoscreenFrame, {
    src: 'models/m1d_curved_screen_frame.glb'
  })

  // Create an entity for the video screen itself
  const videoscreen = engine.addEntity()
  Transform.create(videoscreen, {
    position: Vector3.create(0, 0, 0),
    rotation: Quaternion.fromEulerDegrees(0, 0, 0),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(videoscreen, {
    src: 'models/m1d_curved_screen.glb'
  })

  // Add a VideoPlayer component to the video screen entity to play a video
  VideoPlayer.create(videoscreen, {
    src: 'https://player.vimeo.com/external/1097688868.m3u8?s=f997f22217ef2a9877977459680bf3a94c9a8930&logging=false',
    playing: true,
    loop: true
  })

  // Apply the video texture to the video screen model
  GltfNodeModifiers.create(videoscreen, {
    modifiers: [
      {
        path: '',
        material: {
          material: {
            $case: 'pbr',
            pbr: {
              texture: Material.Texture.Video({
                videoPlayerEntity: videoscreen
              }),
              alphaTest: 0.5,
              transparencyMode: 1 // ALPHA_BLEND
            }
          }
        }
      }
    ]
  })

  // --- SECOND VIDEO SCREEN ---
  // This creates a second screen that plays the same video content.
  const videoscreen2 = engine.addEntity()
  Transform.create(videoscreen2, {
    position: Vector3.create(0, 0, 0),
    rotation: Quaternion.fromEulerDegrees(0, 0, 0),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(videoscreen2, {
    src: 'models/m1d_curved_screen2.glb'
  })
  GltfNodeModifiers.create(videoscreen2, {
    modifiers: [
      {
        path: '',
        material: {
          material: {
            $case: 'pbr',
            pbr: {
              texture: Material.Texture.Video({ videoPlayerEntity: videoscreen }),
              alphaTest: 0.5,
              transparencyMode: 1 // ALPHA_BLEND
            }
          }
        }
      }
    ]
  })

  // --- ADMIN UI ---
  // This sets up the UI for the admin to start and stop the video.
  ReactEcsRenderer.setUiRenderer(() => VideoToggleButton({ targetEntity: videoscreen }))

  // --- BONUS BUILDING ---
  // This adds a bonus building to the scene.
  const building = engine.addEntity()
  Transform.create(building, {
    position: Vector3.create(2, 0, 8),
    rotation: Quaternion.fromEulerDegrees(0, 180, 0),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(building, {
    src: 'models/building_textured.glb'
  })

  // --- AI-GENERATED SCULPTURE GARDEN ---
  // This section creates the AI-assisted zen garden.
  const root = engine.addEntity()
  Transform.create(root, {
    position: Vector3.create(2, 0, 3), // Position the scene in the center of the parcel
    scale: Vector3.create(0.25, 0.25, 0.25) // Scale down the entire scene to create a miniature effect
  })

  // Create the animated centerpiece with multiple animation states
  createAnimatedCenterpiece()

  // Create the different parts of the zen garden
  createScenery(root)
  createMovingPlatforms(root)
  //createClickableCrystal(root) // This is commented out, but can be re-enabled to add the interactive crystal
  createLightningEffects(root)
  createPulsingLights()

  // --- INTERACTIVE DANCE FLOOR ---
  // This creates the interactive nightclub elements.
  createInteractiveFX()

  // --- TELEPORTER ---
  // This creates the teleporter.
  createTeleporter()
}