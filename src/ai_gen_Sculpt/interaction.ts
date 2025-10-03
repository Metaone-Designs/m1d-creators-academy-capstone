// Import necessary modules from the SDK
import {
  engine,
  Transform,
  MeshRenderer,
  Material,
  PointerEvents,
  PointerEventType,
  InputAction,
  PointerEventsResult,
  MeshCollider,
  Entity
} from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { togglePlatformDirection } from './platforms'

/**
 * Creates a clickable crystal that toggles the direction of the moving platforms.
 * @param parent - The parent entity to attach the crystal to.
 */
export function createClickableCrystal(parent: Entity) {
  // Create the crystal entity
  const crystal = engine.addEntity()
  Transform.create(crystal, {
    position: Vector3.create(0, 1, -4), // Position it in front of the tree
    scale: Vector3.create(0.5, 1, 0.5), // A small, elongated crystal shape
    parent: parent
  })
  MeshRenderer.setBox(crystal) // Use a box mesh for the crystal
  MeshCollider.setBox(crystal) // Add a collider so the crystal can be clicked
  Material.setPbrMaterial(crystal, {
    albedoColor: Color4.fromHexString('#00FFFF'), // A cyan color
    emissiveColor: Color4.fromHexString('#00FFFF'), // Make it glow
    emissiveIntensity: 2
  })

  // Add a pointer event to the crystal so it can be clicked
  PointerEvents.create(crystal, {
    pointerEvents: [
      {
        eventType: PointerEventType.PET_DOWN, // Trigger on click
        eventInfo: {
          button: InputAction.IA_POINTER, // Use the primary action button
          hoverText: 'Toggle Rotation' // Display this text when hovering over the crystal
        }
      }
    ]
  })

  // A system to handle the click event
  engine.addSystem(() => {
    // Iterate over all entities with a PointerEventsResult component
    for (const [entity] of engine.getEntitiesWith(PointerEventsResult)) {
      const component = PointerEventsResult.get(entity)
      for (const result of component) {
        // Check if the crystal was clicked
        if (
          result.button === InputAction.IA_POINTER &&
          result.state === PointerEventType.PET_DOWN &&
          result.hit?.entityId === crystal
        ) {
          // If so, toggle the direction of the platforms
          togglePlatformDirection()
        }
      }
    }
  })
}