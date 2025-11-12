// Polytrack - Polyrhythmic Sequencer
class Polytrack {
    constructor() {
        this.tracks = [
            { steps: 8, pattern: [], sound: 'kick' },
            { steps: 12, pattern: [], sound: 'snare' },
            { steps: 16, pattern: [], sound: 'hihat' },
            { steps: 8, pattern: [], sound: 'clap' }
        ];
        this.tempo = 120;
        this.volume = 0.7;
        this.isPlaying = false;
        this.currentStep = [0, 0, 0, 0];
        this.intervals = [null, null, null, null];
        this.audioContext = null;
        
        this.initAudio();
        this.initUI();
        this.renderGrids();
    }

    initAudio() {
        // Initialize Web Audio API
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    initUI() {
        // Play button
        document.getElementById('playBtn').addEventListener('click', () => {
            this.play();
        });

        // Stop button
        document.getElementById('stopBtn').addEventListener('click', () => {
            this.stop();
        });

        // Clear button
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearAll();
        });

        // Tempo slider
        const tempoSlider = document.getElementById('tempo');
        const tempoValue = document.getElementById('tempoValue');
        tempoSlider.addEventListener('input', (e) => {
            this.tempo = parseInt(e.target.value);
            tempoValue.textContent = this.tempo;
            if (this.isPlaying) {
                this.stop();
                this.play();
            }
        });

        // Volume slider
        const volumeSlider = document.getElementById('volume');
        const volumeValue = document.getElementById('volumeValue');
        volumeSlider.addEventListener('input', (e) => {
            this.volume = parseInt(e.target.value) / 100;
            volumeValue.textContent = e.target.value;
        });

        // Steps selectors
        document.querySelectorAll('.steps-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const trackIndex = parseInt(e.target.dataset.track);
                this.tracks[trackIndex].steps = parseInt(e.target.value);
                this.tracks[trackIndex].pattern = [];
                this.renderGrid(trackIndex);
                if (this.isPlaying) {
                    this.stop();
                    this.play();
                }
            });
        });

        // Sound selectors
        document.querySelectorAll('.sound-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const trackIndex = parseInt(e.target.dataset.track);
                this.tracks[trackIndex].sound = e.target.value;
            });
        });
    }

    renderGrids() {
        for (let i = 0; i < this.tracks.length; i++) {
            this.renderGrid(i);
        }
    }

    renderGrid(trackIndex) {
        const grid = document.getElementById(`grid${trackIndex}`);
        grid.innerHTML = '';
        const steps = this.tracks[trackIndex].steps;

        for (let i = 0; i < steps; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.track = trackIndex;
            cell.dataset.step = i;

            if (this.tracks[trackIndex].pattern.includes(i)) {
                cell.classList.add('active');
            }

            cell.addEventListener('click', () => {
                this.toggleStep(trackIndex, i);
            });

            grid.appendChild(cell);
        }
    }

    toggleStep(trackIndex, stepIndex) {
        const pattern = this.tracks[trackIndex].pattern;
        const index = pattern.indexOf(stepIndex);
        
        if (index > -1) {
            pattern.splice(index, 1);
        } else {
            pattern.push(stepIndex);
        }

        this.renderGrid(trackIndex);
    }

    play() {
        if (this.isPlaying) return;

        // Resume audio context if suspended (browser autoplay policy)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        this.isPlaying = true;
        document.getElementById('playBtn').disabled = true;
        document.getElementById('stopBtn').disabled = false;

        // Start each track with its own timing
        for (let i = 0; i < this.tracks.length; i++) {
            this.playTrack(i);
        }
    }

    playTrack(trackIndex) {
        const track = this.tracks[trackIndex];
        const stepDuration = (60 / this.tempo) * 1000 * (4 / track.steps); // milliseconds per step

        this.intervals[trackIndex] = setInterval(() => {
            const currentStep = this.currentStep[trackIndex];
            
            // Play sound if step is active
            if (track.pattern.includes(currentStep)) {
                this.playSound(track.sound);
                this.visualFeedback(trackIndex, currentStep);
            }

            // Update visual current step indicator
            this.updateCurrentStepVisual(trackIndex, currentStep);

            // Move to next step
            this.currentStep[trackIndex] = (currentStep + 1) % track.steps;
        }, stepDuration);
    }

    stop() {
        if (!this.isPlaying) return;

        this.isPlaying = false;
        document.getElementById('playBtn').disabled = false;
        document.getElementById('stopBtn').disabled = true;

        // Clear all intervals
        for (let i = 0; i < this.intervals.length; i++) {
            if (this.intervals[i]) {
                clearInterval(this.intervals[i]);
                this.intervals[i] = null;
            }
        }

        // Reset current steps
        this.currentStep = [0, 0, 0, 0];

        // Clear visual indicators
        document.querySelectorAll('.cell.current').forEach(cell => {
            cell.classList.remove('current');
        });
    }

    clearAll() {
        this.stop();
        for (let i = 0; i < this.tracks.length; i++) {
            this.tracks[i].pattern = [];
            this.renderGrid(i);
        }
    }

    updateCurrentStepVisual(trackIndex, stepIndex) {
        const grid = document.getElementById(`grid${trackIndex}`);
        const cells = grid.querySelectorAll('.cell');
        
        cells.forEach(cell => cell.classList.remove('current'));
        if (cells[stepIndex]) {
            cells[stepIndex].classList.add('current');
        }
    }

    visualFeedback(trackIndex, stepIndex) {
        const grid = document.getElementById(`grid${trackIndex}`);
        const cells = grid.querySelectorAll('.cell');
        const cell = cells[stepIndex];
        
        if (cell) {
            cell.classList.add('playing');
            setTimeout(() => {
                cell.classList.remove('playing');
            }, 100);
        }
    }

    playSound(soundType) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Different frequencies for different sounds
        const sounds = {
            kick: { freq: 60, type: 'sine', decay: 0.5 },
            snare: { freq: 200, type: 'triangle', decay: 0.2 },
            hihat: { freq: 800, type: 'square', decay: 0.1 },
            clap: { freq: 400, type: 'sawtooth', decay: 0.15 }
        };

        const sound = sounds[soundType] || sounds.kick;

        oscillator.type = sound.type;
        oscillator.frequency.value = sound.freq;

        gainNode.gain.value = this.volume;
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + sound.decay
        );

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + sound.decay);
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Polytrack();
});
