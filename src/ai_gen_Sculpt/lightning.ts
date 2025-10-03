// Import necessary modules from the SDK
import {
  engine,
  Transform,
  MeshRenderer,
  Material,
  Entity
} from '@dcl/sdk/ecs'
import { Vector3, Color4, Quaternion } from '@dcl/sdk/math'
import { platforms } from './platforms'

// An array to hold the lightning bolt entities
const lightningBolts: Entity[] = []
// The source of the lightning, which is the center of the tree's leaves
const lightningCenterPoint = Vector3.create(0, 8.5, 0) 

/**
 * Creates the lightning effects for the scene.
 * @param parent - The parent entity to attach the lightning bolts to.
 */
export function createLightningEffects(parent: Entity) {
  // Create a lightning bolt for each platform
  for (let i = 0; i < platforms.length; i++) {
    const bolt = engine.addEntity()
    Transform.create(bolt, {
      position: lightningCenterPoint, // Set the initial position to the center point
      scale: Vector3.create(0.05, 1, 0.05), // Very thin bolts
      parent: parent
    })
    MeshRenderer.setCylinder(bolt) // Use a cylinder mesh for the bolts

    // Use an emissive material to make the bolts glow brightly
    Material.setPbrMaterial(bolt, {
      emissiveColor: Color4.fromHexString("#00FFFF"), // A bright cyan color
      emissiveIntensity: 5
    })
    lightningBolts.push(bolt) // Add the bolt to the lightningBolts array
  }

  // Add the system that will update the bolts every frame
  engine.addSystem(lightningSystem)
}

/**
 * A system that updates the position, scale, and rotation of the lightning bolts every frame.
 */
function lightningSystem() {
  // Ensure both platforms and bolts have been initialized
  if (platforms.length === 0 || lightningBolts.length === 0) return

  // Iterate over all platforms
  for (let i = 0; i < platforms.length; i++) {
    const platformTransform = Transform.get(platforms[i])
    const boltTransform = Transform.getMutable(lightningBolts[i])

    // Calculate the vector from the lightning's center point to the platform
    const direction = Vector3.subtract(platformTransform.position, lightningCenterPoint)
    const distance = Vector3.length(direction)

    // Set the bolt's length (scale.y) to match the distance
    boltTransform.scale.y = distance

    // Position the bolt in the middle of the center point and the platform
    boltTransform.position = Vector3.lerp(lightningCenterPoint, platformTransform.position, 0.5)

    // Rotate the bolt to point from the center to the platform
    const lookRotation = Quaternion.lookRotation(direction)
    // The cylinder mesh is oriented along the Y axis, so we need to rotate it to align with the direction vector
    const initialRotation = Quaternion.fromEulerDegrees(90, 0, 0)
    // Combine the two rotations
    boltTransform.rotation = Quaternion.multiply(lookRotation, initialRotation)
  }
}