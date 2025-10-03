// Creators Academy Capstone Project - Admin UI
// This file contains the code for a React-based UI that allows authorized users to control video playback.

import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { Entity, VideoPlayer } from '@dcl/sdk/ecs'
import { getPlayer } from '@dcl/sdk/players'

// --- AUTHORIZED USERS ---
// This array contains the wallet addresses of users who are authorized to see the admin UI.
// IMPORTANT: Replace with your own wallet address to test the feature.
const authorizedUsers = [
    '0x21103f779e3e69dcadfc78c0d472ad6cc591fa7b'
];

// Define the props that our UI component will accept.
type ToggleButtonProps = {
    targetEntity: Entity // The entity with the VideoPlayer component
}

/**
 * A UI component that displays a video toggle button only for authorized users.
 * @param {ToggleButtonProps} props - The properties for this component, including the entity to control.
 */
export function VideoToggleButton({ targetEntity }: ToggleButtonProps): ReactEcs.JSX.Element | null {
    // State to track if the user is authorized. Initial state `null` means "loading".
    const [isAuthorized, setAuthorized] = ReactEcs.useState<boolean | null>(null)
    
    // State to track the video's playing status for the button label.
    const [isPlaying, setIsPlaying] = ReactEcs.useState(VideoPlayer.get(targetEntity).playing)

    // This effect runs once when the component is mounted to check the player's authorization status.
    ReactEcs.useEffect(() => {
        async function checkAuthorization() {
            console.log("UI: Checking authorization...");
            try {
                const player = await getPlayer()
                if (player && player.userId) {
                    const currentUser = player.userId.toLowerCase();
                    // Check if the current user's ID is in the authorizedUsers array.
                    if (authorizedUsers.includes(currentUser)) {
                        console.log("UI: Authorization successful!");
                        setAuthorized(true) // If they are on the list, update the state to true.
                    } else {
                        console.log("UI: Authorization failed - User not in list.");
                        setAuthorized(false) // If not on the list, explicitly set to false.
                    }
                } else {
                    console.log("UI: Authorization failed - Could not get player data or userId.");
                    setAuthorized(false);
                }
            } catch (e) {
                console.error("UI: Error getting player data for authorization.", e)
                setAuthorized(false) // Also set to false if there's an error.
            }
        }
        checkAuthorization()
    }, [])

    // If the authorization check is not complete or the user is not authorized, render nothing.
    if (!isAuthorized) {
        return null
    }

    // If the user IS authorized, render the button.
    return (
        <UiEntity
            uiTransform={{
                width: 150,
                height: 40,
                margin: '15px',
                positionType: 'absolute',
                position: { bottom: '1%', right: '1%' } // Position the button in the bottom right corner.
            }}
            uiBackground={{ color: Color4.create(0.2, 0, 0.4, 0.8) }} // Purple background
            uiText={{ 
                value: isPlaying ? 'Stop Video' : 'Start Video', // Dynamically set the button text.
                color: Color4.White(),
                fontSize: 18
            }}
            // When the button is clicked, toggle the video playback.
            onMouseDown={() => {
                const videoPlayer = VideoPlayer.getMutable(targetEntity)
                // Toggle the playing state.
                videoPlayer.playing = !videoPlayer.playing
                // Update the button's label to match the new state.
                setIsPlaying(videoPlayer.playing)
            }}
        />
    )
}