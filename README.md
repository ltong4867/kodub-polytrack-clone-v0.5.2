# Polytrack - Polyrhythmic Sequencer

A web-based polyrhythmic sequencer inspired by Kodub's Polytrack. Create complex polyrhythmic patterns by combining tracks with different step counts.

## Features

- **4 Independent Tracks**: Each track can have a different number of steps (4, 8, 12, or 16)
- **Polyrhythmic Patterns**: Create interesting polyrhythms by using different step counts across tracks
- **Multiple Sound Types**: Choose from Kick, Snare, Hi-Hat, and Clap sounds for each track
- **Real-time Playback**: Play and stop patterns with visual feedback
- **Tempo Control**: Adjust BPM from 60 to 200
- **Volume Control**: Adjust the overall volume
- **Interactive Grid**: Click on cells to activate/deactivate steps
- **Visual Feedback**: See which step is currently playing and which cells are active

## How to Use

1. **Open the Application**: Open `index.html` in a modern web browser
2. **Create Patterns**: Click on the grid cells to activate steps (they'll turn purple)
3. **Configure Tracks**: 
   - Select the number of steps for each track (4, 8, 12, or 16)
   - Choose the sound type (Kick, Snare, Hi-Hat, or Clap)
4. **Adjust Settings**:
   - Use the Tempo slider to change the BPM
   - Use the Volume slider to adjust the output level
5. **Play**: Click the Play button to start the sequencer
6. **Stop**: Click the Stop button to pause playback
7. **Clear**: Click the Clear button to remove all active steps

## Polyrhythms

The key feature of Polytrack is the ability to create polyrhythms. For example:
- Track 1 with 8 steps cycles every 8 beats
- Track 2 with 12 steps cycles every 12 beats
- The combined pattern repeats every 24 beats (LCM of 8 and 12)

This creates complex, interesting rhythmic patterns that wouldn't be possible with a traditional sequencer.

## Technology

- Pure HTML, CSS, and JavaScript
- Web Audio API for sound generation
- No external dependencies required
- Works in all modern browsers

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (may require user interaction to start audio)

## License

MIT License