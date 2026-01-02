// Soundbar Application JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const buttonsContainer = document.getElementById('buttons');
    const stopButton = document.getElementById('stop-all');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.getElementById('volume-value');
    const currentSoundDisplay = document.getElementById('current-sound');
    const visualizer = document.getElementById('visualizer');
    const soundCountElement = document.getElementById('sound-count');
    
    // Sound configuration
    const sounds = [
        {
            id: 'applause',
            name: 'Applause',
            icon: 'fas fa-hands-clapping',
            color: '#667eea'
        },
        {
            id: 'boo',
            name: 'Boo',
            icon: 'fas fa-face-angry',
            color: '#ff416c'
        },
        {
            id: 'gasp',
            name: 'Gasp',
            icon: 'fas fa-face-surprise',
            color: '#f093fb'
        },
        {
            id: 'tada',
            name: 'Tada',
            icon: 'fas fa-party-horn',
            color: '#4facfe'
        },
        {
            id: 'victory',
            name: 'Victory',
            icon: 'fas fa-trophy',
            color: '#00f2fe'
        },
        {
            id: 'wrong',
            name: 'Wrong',
            icon: 'fas fa-circle-xmark',
            color: '#ff7e5f'
        }
    ];
    
    // Audio context and variables
    let audioContext;
    let currentAudio = null;
    let isPlaying = false;
    let currentSoundId = null;
    let volume = 0.7; // Default volume (70%)
    
    // Initialize the application
    function init() {
        console.log('Soundbar Application Initializing...');
        
        // Create sound buttons
        createSoundButtons();
        
        // Initialize volume
        updateVolumeDisplay();
        
        // Set up event listeners
        setupEventListeners();
        
        // Update sound count
        soundCountElement.textContent = `${sounds.length} sounds available`;
        
        console.log('Soundbar Application Ready!');
    }
    
    // Create sound buttons dynamically
    function createSoundButtons() {
        buttonsContainer.innerHTML = '';
        
        sounds.forEach(sound => {
            const button = document.createElement('button');
            button.className = 'btn';
            button.id = `btn-${sound.id}`;
            button.dataset.soundId = sound.id;
            button.dataset.soundName = sound.name;
            
            button.innerHTML = `
                <i class="${sound.icon} sound-icon"></i>
                <span>${sound.name}</span>
            `;
            
            // Set button color
            button.style.background = `linear-gradient(135deg, ${sound.color}, ${darkenColor(sound.color, 30)})`;
            
            buttonsContainer.appendChild(button);
        });
        
        console.log(`Created ${sounds.length} sound buttons`);
    }
    
    // Set up all event listeners
    function setupEventListeners() {
        // Sound button click events
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function() {
                const soundId = this.dataset.soundId;
                const soundName = this.dataset.soundName;
                playSound(soundId, soundName, this);
            });
        });
        
        // Stop button click event
        stopButton.addEventListener('click', stopAllSounds);
        
        // Volume slider change event
        volumeSlider.addEventListener('input', function() {
            volume = this.value / 100;
            updateVolumeDisplay();
            
            // Update current audio volume if playing
            if (currentAudio) {
                currentAudio.volume = volume;
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', function(event) {
            // Number keys 1-6 for sounds
            if (event.key >= '1' && event.key <= '6') {
                const index = parseInt(event.key) - 1;
                if (index < sounds.length) {
                    const sound = sounds[index];
                    const button = document.getElementById(`btn-${sound.id}`);
                    if (button) {
                        playSound(sound.id, sound.name, button);
                    }
                }
            }
            
            // Spacebar to stop
            if (event.key === ' ' || event.key === 'Spacebar') {
                event.preventDefault();
                stopAllSounds();
            }
            
            // Escape to stop
            if (event.key === 'Escape') {
                stopAllSounds();
            }
            
            // Arrow keys for volume
            if (event.key === 'ArrowUp') {
                volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 10);
                volumeSlider.dispatchEvent(new Event('input'));
            }
            
            if (event.key === 'ArrowDown') {
                volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 10);
                volumeSlider.dispatchEvent(new Event('input'));
            }
        });
    }
    
    // Play sound function
    function playSound(soundId, soundName, buttonElement) {
        // Stop current sound if playing
        if (isPlaying && currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            
            // Remove active class from previous button
            if (currentSoundId) {
                const prevButton = document.getElementById(`btn-${currentSoundId}`);
                if (prevButton) prevButton.classList.remove('active');
            }
        }
        
        // If clicking the same sound that's playing, stop it
        if (isPlaying && currentSoundId === soundId) {
            stopAllSounds();
            return;
        }
        
        // Create audio element
        const audio = new Audio(`sounds/${soundId}.mp3`);
        
        // Set volume
        audio.volume = volume;
        
        // Play the sound
        audio.play()
            .then(() => {
                // Update state
                currentAudio = audio;
                currentSoundId = soundId;
                isPlaying = true;
                
                // Update UI
                currentSoundDisplay.textContent = soundName;
                currentSoundDisplay.style.color = getComputedStyle(buttonElement).backgroundImage;
                
                // Add active class to button
                buttonElement.classList.add('active');
                
                // Start visualizer
                visualizer.classList.add('playing');
                
                // Update button text to "Stop"
                const span = buttonElement.querySelector('span');
                span.textContent = 'Stop';
                
                console.log(`Playing: ${soundName}`);
                
                // Handle audio end
                audio.onended = function() {
                    stopAllSounds();
                };
                
                // Handle audio error
                audio.onerror = function() {
                    console.error(`Error playing sound: ${soundName}`);
                    currentSoundDisplay.textContent = `Error loading: ${soundName}`;
                    currentSoundDisplay.style.color = '#ff416c';
                    stopAllSounds();
                };
            })
            .catch(error => {
                console.error('Error playing audio:', error);
                currentSoundDisplay.textContent = 'Error playing sound';
                currentSoundDisplay.style.color = '#ff416c';
                
                // Show error message
                alert(`Error playing ${soundName}. Make sure the sound file exists in the "sounds" folder.`);
            });
    }
    
    // Stop all sounds function
    function stopAllSounds() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
        }
        
        // Update state
        isPlaying = false;
        currentSoundId = null;
        
        // Update UI
        currentSoundDisplay.textContent = 'No sound playing';
        currentSoundDisplay.style.color = '#00fff5';
        
        // Stop visualizer
        visualizer.classList.remove('playing');
        
        // Remove active class from all buttons
        document.querySelectorAll('.btn').forEach(button => {
            button.classList.remove('active');
            
            // Reset button text to sound name
            const soundId = button.dataset.soundId;
            const sound = sounds.find(s => s.id === soundId);
            if (sound) {
                const span = button.querySelector('span');
                if (span) span.textContent = sound.name;
            }
        });
        
        console.log('All sounds stopped');
    }
    
    // Update volume display
    function updateVolumeDisplay() {
        volumeValue.textContent = `${parseInt(volume * 100)}%`;
    }
    
    // Helper function to darken a color
    function darkenColor(color, percent) {
        // Convert hex to RGB
        let r = parseInt(color.slice(1, 3), 16);
        let g = parseInt(color.slice(3, 5), 16);
        let b = parseInt(color.slice(5, 7), 16);
        
        // Darken
        r = Math.floor(r * (100 - percent) / 100);
        g = Math.floor(g * (100 - percent) / 100);
        b = Math.floor(b * (100 - percent) / 100);
        
        // Convert back to hex
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    // Test function to check if sound files exist
    function testSoundFiles() {
        console.log('Testing sound files...');
        sounds.forEach(sound => {
            const audio = new Audio();
            audio.src = `sounds/${sound.id}.mp3`;
            
            audio.addEventListener('canplaythrough', () => {
                console.log(`✓ ${sound.name} sound file is accessible`);
            });
            
            audio.addEventListener('error', () => {
                console.warn(`✗ ${sound.name} sound file not found or inaccessible`);
            });
        });
    }
    
    // Initialize visualizer animation
    function initVisualizer() {
        const bars = visualizer.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            bar.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    // Add CSS for active button animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes buttonPulse {
            0%, 100% { box-shadow: 0 0 20px currentColor; }
            50% { box-shadow: 0 0 40px currentColor; }
        }
        
        .btn.active {
            animation: buttonPulse 1.5s infinite;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize everything when DOM is loaded
    init();
    initVisualizer();
    
    // Test sound files after a short delay
    setTimeout(testSoundFiles, 1000);
    
    // Log keyboard shortcuts
    console.log('Keyboard Shortcuts:');
    console.log('• 1-6: Play sounds 1-6');
    console.log('• Space/Escape: Stop all sounds');
    console.log('• Arrow Up/Down: Adjust volume');
    
    // Export functions for debugging
    window.soundbar = {
        playSound,
        stopAllSounds,
        getSounds: () => sounds,
        getCurrentSound: () => currentSoundId
    };
});