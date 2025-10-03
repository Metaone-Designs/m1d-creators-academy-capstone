// Creators Academy Capstone Project - Animated Centerpiece
// This file contains the code for a complex animated object with multiple states.

import {
  engine,
  GltfContainer,
  Transform,
  Animator,
  Entity,
  inputSystem,
  InputAction,
  PointerEventType,
  PointerEvents
} from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'

/**
 * M1D - Creators Academy Workshop 5: Multi-Action Animation States
 *
 * This function sets up a single 3D object with three distinct animation states
 * that respond to player interaction:
 * - Idle: A default, looping animation.
 * - Proximity: A looping animation that plays when the player is near.
 * - Click: A non-looping, uninterruptible animation triggered by the player.
 */
export function createAnimatedCenterpiece() {
  // === 1. ENTITY SETUP ===
  // Create an entity for the centerpiece.
  const centerpiece: Entity = engine.addEntity()

  // Attach the 3D model to the entity.
  GltfContainer.create(centerpiece, { src: 'models/m1d_anim_3actions.glb' })

  // Set the entity's position, rotation, and scale.
  Transform.create(centerpiece, {
    position: { x: 10, y: 9.45, z: 8 },
    rotation: Quaternion.fromEulerDegrees(0, 0, 0),
    scale: { x: 1, y: 1, z: 1 }
  })

  // === 2. ANIMATION & INTERACTIVITY SETUP ===
  // The Animator component defines all the animation clips stored in the GLB model.
  // The 'clip' name must exactly match the Action name from Blender.
  Animator.create(centerpiece, {
    states: [
      { clip: 'Idle_Anim', playing: true, loop: true },
      { clip: 'Proximity_Anim', playing: false, loop: true },
      { clip: 'Click_Anim', playing: false, loop: false }
    ]
  })

  // The PointerEvents component makes the entity clickable and shows hover text.
  PointerEvents.create(centerpiece, {
    pointerEvents: [
      {
        eventType: PointerEventType.PET_DOWN,
        eventInfo: { button: InputAction.IA_POINTER, hoverText: 'Activate' }
      }
    ]
  })

  // === 3. STATE MACHINE SETUP ===
  // A state machine is a clean way to manage how the object behaves.
  // It can only be in one state at a time, which prevents animation conflicts.
  type SystemState = 'idle' | 'proximity' | 'clicking'
  let systemState: SystemState = 'idle'

  // === 4. SINGLE, UNIFIED LOGIC SYSTEM ===
  // An `engine.addSystem` runs on every frame. By putting all the logic
  // in one system, we prevent different systems from fighting for control.
  engine.addSystem(() => {
    // --- GUARD CLAUSE: THE "UNINTERRUPTIBLE" STATE ---
    // If the system is in the 'clicking' state, we immediately stop all other
    // logic for this frame. The timer is the ONLY thing that can change this state.
    if (systemState === 'clicking') {
      return
    }

    // --- SHARED DATA ---
    // Get the player's position to calculate the distance to the centerpiece.
    const playerPosition = Transform.getOrNull(engine.PlayerEntity)
    const distance = playerPosition
      ? Vector3.distance(playerPosition.position, Transform.get(centerpiece).position)
      : 999 // If player position is not available, set a large distance

    // --- CLICK EVENT HANDLER ---
    // Check if the player clicked the centerpiece on this frame.
    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, centerpiece)) {
      // The click is only allowed if the player is within the proximity range.
      if (distance <= 6) {
        // 1. Lock the state to 'clicking' to make the animation uninterruptible.
        systemState = 'clicking'

        // 2. Play the one-shot click animation.
        Animator.playSingleAnimation(centerpiece, 'Click_Anim', true)

        // 3. Manually define the duration of the animation in seconds.
        const clickAnimationDuration = 37.25 // From Blender: 900 frames / 24 fps

        // 4. Set a timer to run after the animation is finished.
        utils.timers.setTimeout(() => {
          // 5. When the timer finishes, check the player's distance AGAIN
          //    to decide which state to return to.
          const playerPositionAfterClick = Transform.getOrNull(engine.PlayerEntity)
          const distanceAfterClick = playerPositionAfterClick
            ? Vector3.distance(playerPositionAfterClick.position, Transform.get(centerpiece).position)
            : 999

          if (distanceAfterClick <= 6) {
            // If the player is still close, go to the proximity state.
            systemState = 'proximity'
            Animator.playSingleAnimation(centerpiece, 'Proximity_Anim')
          } else {
            // If the player has moved away, go back to the idle state.
            systemState = 'idle'
            Animator.playSingleAnimation(centerpiece, 'Idle_Anim')
          }
        }, clickAnimationDuration * 1000) // Convert seconds to milliseconds
        return // Stop processing for this frame to let the click take priority.
      }
    }

    // --- PROXIMITY & IDLE LOGIC ---
    // This logic only runs if the system is NOT in the 'clicking' state.
    if (distance <= 6) {
      // If the player is close and the system is not already in the proximity state, switch to it.
      if (systemState !== 'proximity') {
        systemState = 'proximity'
        Animator.playSingleAnimation(centerpiece, 'Proximity_Anim')
      }
    } else {
      // If the player is far and the system is not already in the idle state, switch to it.
      if (systemState !== 'idle') {
        systemState = 'idle'
        Animator.playSingleAnimation(centerpiece, 'Idle_Anim')
      }
    }
  })
}