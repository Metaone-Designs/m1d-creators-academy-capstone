// Import necessary modules from the SDK
import {
  engine,
  Transform,
  MeshRenderer,
  MeshCollider,
  Material,
  Schemas,
  Entity
} from '@dcl/sdk/ecs'
import { Color4, Vector3, Quaternion } from '@dcl/sdk/math'
import { MessageBus } from '@dcl/sdk/message-bus'
import * as utils from '@dcl-sdk/utils'

// The maximum number of platforms to create
const MAX_PLATFORMS = 20

// A type to define the state of the platforms for multiplayer synchronization
type PlatformState = {
  positions: Vector3[],
  direction: number
}

// A message bus for communicating platform state changes between players
const platformBus = new MessageBus()

// An array to hold the platform entities
export const platforms: Entity[] = []

// The initial state of the platforms
let platformState: PlatformState = {
  positions: [],
  direction: 1
}

/**
 * Generates a random color.
 * @returns A random Color4 object.
 */
function getRandomColor(): Color4 {
  return Color4.create(Math.random(), Math.random(), Math.random(), 1)
}

/**
 * Changes the color of all platforms to a new random color.
 */
function changePlatformColors() {
  for (const platform of platforms) {
    Material.setPbrMaterial(platform, {
      albedoColor: getRandomColor()
    })
  }
}

/**
 * Creates the moving platforms for the scene.
 * @param parent - The parent entity to attach the platforms to.
 */
export function createMovingPlatforms(parent: Entity) {
  // Create each platform
  for (let i = 0; i < MAX_PLATFORMS; i++) {
    const platform = engine.addEntity()
    Transform.create(platform, {
      position: Vector3.create(0, (17 / MAX_PLATFORMS) * i, 0), // Stagger the initial height of the platforms
      scale: Vector3.create(1.5, 1.5, 1.5), // A uniform scale for the sphere
      parent: parent
    })
    MeshRenderer.setSphere(platform) // Use a sphere mesh for the platforms
    // MeshCollider.setBox(platform) // Collider is commented out
    Material.setPbrMaterial(platform, {
      albedoColor: getRandomColor() // Set an initial random color
    })
    platforms.push(platform) // Add the platform to the platforms array
    platformState.positions.push(Transform.get(platform).position) // Add the platform's position to the state
  }

  // Handle incoming messages to sync the platform state
  platformBus.on('platform_state_change', (newState: PlatformState) => {
    platformState = newState
    for (let i = 0; i < MAX_PLATFORMS; i++) {
      const platform = platforms[i]
      const targetPosition = platformState.positions[i]
      // Use a tween to smoothly move the platforms to their new positions
      utils.tweens.startTranslation(platform, Transform.get(platform).position, targetPosition, 0.5)
    }
  })

  // Start a timer to update the platform positions every frame
  utils.timers.setInterval(updatePlatforms, 1000 / 30) // 30 FPS

  // Start a timer to change the platform colors every 3 seconds
  utils.timers.setInterval(changePlatformColors, 3000)
}

/**
 * Updates the position and rotation of the platforms every frame.
 */
function updatePlatforms() {
  for (let i = 0; i < MAX_PLATFORMS; i++) {
    const platform = platforms[i]
    const transform = Transform.getMutable(platform)
    const newPosition = Vector3.clone(transform.position)

    // Animate the platforms in a spiral pattern
    const angle = (Date.now() / 1000) * 0.2 * platformState.direction
    newPosition.x = 0 + 5 * Math.cos(angle + (i * Math.PI * 2) / MAX_PLATFORMS)
    newPosition.z = 0 + 5 * Math.sin(angle + (i * Math.PI * 2) / MAX_PLATFORMS)
    newPosition.y += 0.005

    // Reset the platform's position when it reaches the top
    if (newPosition.y >= 17) {
      newPosition.y = 0
    }

    transform.position = newPosition // Apply the new position
    transform.rotation = Quaternion.fromEulerDegrees(0, (Date.now() / 10), 0) // Apply a rotation animation
    platformState.positions[i] = newPosition // Update the platform's position in the state
  }

  // Broadcast the new state to other players
  platformBus.emit('platform_state_change', platformState)
}

/**
 * Toggles the direction of the platform's movement.
 */
export function togglePlatformDirection() {
  platformState.direction *= -1
  platformBus.emit('platform_state_change', platformState)
}