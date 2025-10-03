// Import necessary modules from the SDK
import {
  engine,
  Material,
  Entity,
  Schemas
} from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'

// Import the ground and leaves entities from the scenery file
import { ground, leaves } from './scenery'

// Define a component to manage the state of the pulsing animation
export const PulseEffect = engine.defineComponent('PulseEffect', {
  originalColor: Schemas.Color4, // The original color of the entity
  pulseColor: Schemas.Color4, // The color to pulse to
  speed: Schemas.Number, // The speed of the pulse
  t: Schemas.Number // A value from 0 to 1 representing the pulse progress
})

// Store the original colors of the ground and leaves, and the color to pulse to
const groundOriginalColor = Color4.fromHexString('#999999')
const leavesOriginalColor = Color4.fromHexString('#4CAF50')
const pulseColor = Color4.fromHexString('#00FFFF')

/**
 * Creates the pulsing light effects for the ground and leaves.
 */
export function createPulsingLights() {
  // Add the PulseEffect component to the ground entity
  PulseEffect.create(ground, {
    originalColor: groundOriginalColor,
    pulseColor: pulseColor,
    speed: 0.5,
    t: 0
  })

  // Add the PulseEffect component to the leaves entity
  PulseEffect.create(leaves, {
    originalColor: leavesOriginalColor,
    pulseColor: pulseColor,
    speed: 0.5,
    t: 0
  })

  // Add the pulseSystem to the engine, which will run every frame
  engine.addSystem(pulseSystem)
}

/**
 * A system that animates the pulsing light effect.
 * @param dt - The delta time since the last frame.
 */
function pulseSystem(dt: number) {
  // Iterate over all entities with the PulseEffect component
  for (const [entity] of engine.getEntitiesWith(PulseEffect)) {
    const pulse = PulseEffect.getMutable(entity)
    
    // Increment the timer 't' based on the delta time and speed
    pulse.t += dt * pulse.speed
    if (pulse.t > 1) pulse.t = 0 // Loop the animation

    // Use a sine wave to create a smooth back-and-forth pulse
    const pulseFactor = (Math.sin(pulse.t * Math.PI * 2) + 1) / 2

    // Get the entity's material
    const material = Material.getMutable(entity)

    // Ensure we are working with a PBR material
    if (material.material?.$case === 'pbr') {
      // Interpolate the color based on the pulse factor
      const newColor = Color4.lerp(pulse.originalColor, pulse.pulseColor, pulseFactor)
      
      // Update the emissive properties of the material to create the pulsing glow
      material.material.pbr.emissiveColor = newColor
      material.material.pbr.emissiveIntensity = pulseFactor * 2
    }
  }
}