// This script enables audio playback on hover for the #anue image
window.addEventListener('DOMContentLoaded', function () {
    function addHoverFadeAudio(imgId, audioSrc, fadeDuration = 0.5) {
        const img = document.getElementById(imgId);
        if (!img) return;
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const audio = new Audio(audioSrc);
        audio.loop = true;
        audio.preload = 'auto';
        audio.crossOrigin = 'anonymous';
        const track = audioCtx.createMediaElementSource(audio);
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 0;
        track.connect(gainNode).connect(audioCtx.destination);
        audio.play();

        function fadeGain(target) {
            const now = audioCtx.currentTime;
            gainNode.gain.cancelScheduledValues(now);
            gainNode.gain.setValueAtTime(gainNode.gain.value, now);
            gainNode.gain.linearRampToValueAtTime(target, now + fadeDuration);
        }

        img.addEventListener('mouseenter', function () {
            fadeGain(1);
        });
        img.addEventListener('mouseleave', function () {
            fadeGain(0);
        });
    }

    addHoverFadeAudio('anue', 'src/anueAudio_01.mp3', 0.5);
    addHoverFadeAudio('boda', 'src/bodaAudio_01.mp3', 0.5);
});
