// Creators Academy Capstone Project - Teleporter
// This file contains the code for a teleporter that moves the player to a different location.

import {
    engine,
    Transform,
    MeshRenderer,
    Material,
} from '@dcl/sdk/ecs'
import { Color4, Vector3, Quaternion } from '@dcl/sdk/math'
import { movePlayerTo } from '~system/RestrictedActions'
import * as utils from '@dcl-sdk/utils'

// --- TELEPORTER CONFIGURATION ---
// Define the start and end points for the teleporter.
const teleporterStartPosition = Vector3.create(2, 0.1, 13)
const teleporterTargetPosition = Vector3.create(13.5, 12, 13)

/**
 * Creates a teleporter pad that moves the player when they walk into it.
 */
export function createTeleporter() {
    // Create the main teleporter entity
    const teleporter = engine.addEntity()

    // --- VISUAL SETUP ---
    // Set the position, scale, and shape of the teleporter pad.
    Transform.create(teleporter, {
        position: teleporterStartPosition,
        scale: Vector3.create(1, 0.1, 1)
    })
    MeshRenderer.setCylinder(teleporter, 1, 1) // Using a cylinder for the pad shape
    Material.setPbrMaterial(teleporter, {
        emissiveColor: Color4.create(0, 1, 1), // Cyan glow
        emissiveIntensity: 0.7
    })

    // --- VISUAL INDICATOR ---
    // Create a smaller, spinning ring above the pad to make it more noticeable.
    const indicator = engine.addEntity()
    Transform.create(indicator, {
        position: Vector3.create(0, 0.5, 0), // Position it above the pad
        scale: Vector3.create(0.5, 0.5, 0.5),
        parent: teleporter // Parent it to the main teleporter pad so they move together
    })
    // The SDK does not have a built-in torus primitive, so we use a cylinder.
    // For a true torus, you would use a .glb model.
    MeshRenderer.setCylinder(indicator, 1, 1)
    Material.setPbrMaterial(indicator, {
        emissiveColor: Color4.White(),
        emissiveIntensity: 1.5
    })

    // --- STATE MANAGEMENT FOR COOLDOWN ---
    // This prevents the teleporter from being used repeatedly and causing issues.
    let isTeleporting = false
    const cooldownDuration = 3000 // 3 seconds in milliseconds

    // --- TELEPORT ACTION EFFECT ---
    // This function plays a quick visual effect before teleporting the player.
    function playTeleportEffect() {
        // Brighten the teleporter and make it slightly taller to indicate activation
        Material.setPbrMaterial(teleporter, {
            emissiveColor: Color4.White(),
            emissiveIntensity: 2.0
        })
        const transform = Transform.getMutable(teleporter)
        transform.scale.y = 0.2

        // Set a timer to teleport the player after a short delay
        utils.timers.setTimeout(() => {
            movePlayerTo({ 
                newRelativePosition: teleporterTargetPosition,
                cameraTarget: Vector3.Zero() // Face the scene origin (0,0,0) after teleporting
            })

            // After another short delay, reset the visual state of the teleporter
            utils.timers.setTimeout(() => {
                Material.setPbrMaterial(teleporter, {
                    emissiveColor: Color4.create(0, 1, 1),
                    emissiveIntensity: 0.7
                })
                transform.scale.y = 0.1
            }, 500) // Reset after 0.5 seconds

        }, 200) // Teleport after 0.2 seconds
    }

    // --- TRIGGER LOGIC ---
    // This sets up a trigger area around the teleporter that detects when the player enters.
    utils.triggers.addTrigger(
        teleporter,
        utils.LAYER_1,
        utils.LAYER_1,
        [
            {
                type: 'box',
                scale: Vector3.create(2, 2, 2) // The trigger area is a 2x2x2 meter box
            }
        ],
        () => {
            // This function is the `onCameraEnter` callback, which runs when the player enters the trigger area.
            
            // Check if the teleporter is on cooldown
            if (isTeleporting) return

            console.log("Player entered teleporter trigger area.")
            
            // Start the cooldown to prevent immediate re-triggering
            isTeleporting = true

            // Play the visual effect
            playTeleportEffect()

            // Set a timer to end the cooldown period
            utils.timers.setTimeout(() => {
                isTeleporting = false
            }, cooldownDuration)
        }
    )

    // --- VISUAL EFFECT: PULSING AND SPINNING ANIMATION ---
    // This system runs on every frame to create continuous animations.
    let time = 0
    engine.addSystem((dt) => {
        time += dt * 2

        // Pulse the main pad only if the teleporter is not currently in the middle of a teleport effect
        if (!isTeleporting) {
            const pulse = 1 + Math.sin(time) * 0.1 // Create a gentle pulsing effect
            const transform = Transform.getMutable(teleporter)
            transform.scale.y = 0.1 * pulse
        }

        // Spin the indicator ring continuously
        const indicatorTransform = Transform.getMutable(indicator)
        indicatorTransform.rotation = Quaternion.multiply(indicatorTransform.rotation, Quaternion.fromAngleAxis(dt * 150, Vector3.Up()))
    })
}