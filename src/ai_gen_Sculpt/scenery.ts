// Import necessary modules from the SDK
import {
  engine,
  Transform,
  MeshRenderer,
  MeshCollider,
  Material,
  Entity
} from '@dcl/sdk/ecs'
import { Quaternion, Color4, Vector3 } from '@dcl/sdk/math'

// Export these entities so other files can use them
export let ground: Entity
export let leaves: Entity

/**
 * Creates the static scenery for the scene, including the ground and a tree.
 * @param parent - The parent entity to attach the scenery to.
 */
export function createScenery(parent: Entity) {
  // Create the ground entity
  ground = engine.addEntity()
  Transform.create(ground, {
    position: Vector3.create(0, 0, 0), // Positioned at the parent's origin
    scale: Vector3.create(12, 0.1, 12), // A large, flat circular platform
    parent: parent
  })
  MeshRenderer.setSphere(ground) // Use a sphere mesh for the ground
  Material.setPbrMaterial(ground, {
    albedoColor: Color4.fromHexString('#999999') // A grey color
  })

  // Create a parent entity for the tree, to group the trunk and leaves
  const tree = engine.addEntity()
  Transform.create(tree, {
    position: Vector3.create(0, 0, 0), // Positioned at the parent's origin
    parent: parent
  })

  // Create the tree trunk
  const trunk = engine.addEntity()
  Transform.create(trunk, {
    position: Vector3.create(0, 3.75, 0), // Positioned on top of the ground
    scale: Vector3.create(0.4, 7.5, 0.4), // A tall, thin trunk
    parent: tree
  })
  MeshRenderer.setBox(trunk) // Use a box mesh for the trunk
  Material.setPbrMaterial(trunk, {
    albedoColor: Color4.fromHexString('#8B4513') // A brown color
  })

  // Create the tree leaves
  leaves = engine.addEntity()
  Transform.create(leaves, {
    position: Vector3.create(0, 8.5, 0), // Positioned on top of the trunk
    scale: Vector3.create(3, 3, 3), // A large sphere for the leaves
    parent: tree
  })
  MeshRenderer.setSphere(leaves) // Use a sphere mesh for the leaves
  // MeshCollider.setSphere(leaves) // Collider is commented out
  Material.setPbrMaterial(leaves, {
    albedoColor: Color4.fromHexString('#4CAF50') // A green color
  })
}