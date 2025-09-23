window.addEventListener('DOMContentLoaded', () => {
    function addHoverFadeAudio(imgId, audioSrc, fadeDuration = 0.5) {
        const img = document.getElementById(imgId);
        if (!img) return;

        // Create the audio immediately and loop it
        const audio = new Audio(audioSrc);
        audio.loop = true;
        audio.volume = 0; // start muted
        audio.play().catch(err => console.log("Autoplay blocked until user gesture:", err));

        let fadeInterval;

        function fade(targetVolume) {
            clearInterval(fadeInterval);
            const step = (targetVolume - audio.volume) / (fadeDuration * 60);

            fadeInterval = setInterval(() => {
                let newVol = audio.volume + step;
                if ((step > 0 && newVol >= targetVolume) || (step < 0 && newVol <= targetVolume)) {
                    newVol = targetVolume;
                    clearInterval(fadeInterval);
                }
                audio.volume = Math.min(1, Math.max(0, newVol));
            }, 1000 / 60);
        }

        img.addEventListener('mouseenter', () => fade(1)); // fade in when hovering
        img.addEventListener('mouseleave', () => fade(0)); // fade out when leaving
    }

    // Example usage for multiple images
    addHoverFadeAudio('anue', 'src/anueAudio_01.mp3', 0.5);
    addHoverFadeAudio('boda', 'src/bodaAudio_01.mp3', 0.5);
})