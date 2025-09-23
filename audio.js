window.addEventListener('DOMContentLoaded', function () {
    function addHoverFadeAudio(imgId, audioSrc, fadeDuration = 0.5) {
        const img = document.getElementById(imgId);
        if (!img) return;

        let audio = null;
        let fadeInterval;

        function fade(targetVolume, stopAfter = false) {
            clearInterval(fadeInterval);
            if (!audio) return;

            const step = (targetVolume - audio.volume) / (fadeDuration * 60); // ~60fps
            fadeInterval = setInterval(() => {
                let newVol = audio.volume + step;
                if ((step > 0 && newVol >= targetVolume) || (step < 0 && newVol <= targetVolume)) {
                    newVol = targetVolume;
                    clearInterval(fadeInterval);
                    if (stopAfter && newVol === 0) {
                        audio.pause();
                        audio.currentTime = 0; // rewind
                        audio = null;
                    }
                }
                audio.volume = Math.min(1, Math.max(0, newVol));
            }, 1000 / 60);
        }

        img.addEventListener('mouseenter', function () {
            if (!audio) {
                audio = new Audio(audioSrc);
                audio.loop = true;
                audio.volume = 0;
                audio.play().catch(err => {
                    console.log("Play blocked until user gesture:", err);
                });
            }
            fade(1);
        });

        img.addEventListener('mouseleave', function () {
            fade(0, true); // fade to 0, then stop and clean up
        });
    }

    addHoverFadeAudio('anue', 'src/anueAudio_01.mp3', 0.5);
    addHoverFadeAudio('boda', 'src/bodaAudio_01.mp3', 0.5);
});