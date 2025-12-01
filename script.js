//your JS code here. If required.
document.addEventListener('DOMContentLoaded', function() {
    // Sound configuration
    const sounds = [
        { name: 'applause', icon: 'fas fa-hands-clapping', color: '#4cc9f0' },
        { name: 'boo', icon: 'fas fa-face-angry', color: '#f72585' },
        { name: 'gasp', icon: 'fas fa-face-surprise', color: '#7209b7' },
        { name: 'tada', icon: 'fas fa-party-horn', color: '#f8961e' },
        { name: 'victory', icon: 'fas fa-trophy', color: '#ffd166' },
        { name: 'wrong', icon: 'fas fa-circle-xmark', color: '#ef233c' }
    ];
    
    // Elements
    const buttonsContainer = document.getElementById('buttons');
    const stopButton = document.getElementById('stop-button');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.getElementById('volume-value');
    const currentSoundElement = document.getElementById('current-sound');
    
    // Audio context and state
    let currentAudio = null;
    let isPlaying = false;
    let currentSoundName = '';
    let volume = 0.7; // Default volume (70%)
    
    // Create sound buttons
    sounds.forEach(sound => {
        const button = document.createElement('button');
        button.className = 'btn';
        button.id = sound.name;
        button.innerHTML = `
            <i class="${sound.icon}"></i>
            <span>${sound.name.charAt(0).toUpperCase() + sound.name.slice(1)}</span>
        `;
        
        // Add click event to play/stop sound
        button.addEventListener('click', () => toggleSound(sound.name, sound.icon));
        
        buttonsContainer.appendChild(button);
    });
    
    // Initialize volume display
    volumeValue.textContent = `${volume * 100}%`;
    
    // Volume slider event
    volumeSlider.addEventListener('input', function() {
        volume = this.value / 100;
        volumeValue.textContent = `${this.value}%`;
        
        // Update volume of currently playing audio
        if (currentAudio) {
            currentAudio.volume = volume;
        }
    });
    
    // Stop button event
    stopButton.addEventListener('click', stopAllSounds);
    
    // Function to toggle sound playback
    function toggleSound(soundName, iconClass) {
        const button = document.getElementById(soundName);
        
        // If this sound is already playing, stop it
        if (currentSoundName === soundName && isPlaying) {
            stopAllSounds();
            return;
        }
        
        // Stop any currently playing sound
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active'));
        }
        
        // Play the selected sound
        playSound(soundName, iconClass);
    }
    
    // Function to play a sound
    function playSound(soundName, iconClass) {
        // Create audio element (assuming sounds are in a 'sounds' folder)
        currentAudio = new Audio(`sounds/${soundName}.mp3`);
        currentAudio.volume = volume;
        
        // Update UI
        currentSoundName = soundName;
        isPlaying = true;
        currentSoundElement.textContent = `Playing: ${soundName.charAt(0).toUpperCase() + soundName.slice(1)}`;
        document.getElementById(soundName).classList.add('active');
        
        // Play the sound
        currentAudio.play();
        
        // When sound ends, update UI
        currentAudio.addEventListener('ended', () => {
            isPlaying = false;
            currentSoundName = '';
            document.getElementById(soundName).classList.remove('active');
            currentSoundElement.textContent = 'No sound playing';
        });
        
        // Handle errors
        currentAudio.addEventListener('error', () => {
            currentSoundElement.textContent = `Error: Could not load ${soundName}.mp3`;
            console.error(`Error loading sound: ${soundName}.mp3`);
            isPlaying = false;
            currentSoundName = '';
            document.getElementById(soundName).classList.remove('active');
        });
    }
    
    // Function to stop all sounds
    function stopAllSounds() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        
        // Reset UI state
        isPlaying = false;
        currentSoundName = '';
        currentSoundElement.textContent = 'No sound playing';
        document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active'));
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Map number keys 1-6 to sounds
        const keyMap = {
            '1': 'applause',
            '2': 'boo',
            '3': 'gasp',
            '4': 'tada',
            '5': 'victory',
            '6': 'wrong'
        };
        
        const soundName = keyMap[event.key];
        if (soundName) {
            const sound = sounds.find(s => s.name === soundName);
            if (sound) {
                toggleSound(soundName, sound.icon);
            }
        }
        
        // Spacebar to stop all sounds
        if (event.code === 'Space') {
            event.preventDefault(); // Prevent space from scrolling page
            stopAllSounds();
        }
    });
    
    // Display keyboard shortcut info
    console.log("Keyboard shortcuts:");
    console.log("1-6: Play sounds 1-6");
    console.log("Space: Stop all sounds");
});