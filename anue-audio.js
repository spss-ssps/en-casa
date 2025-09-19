// This script enables audio playback on hover for the #anue image
window.addEventListener('DOMContentLoaded', function () {
    const anueImg = document.getElementById('anue');
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const audio = new Audio('src/anueAudio_01.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audio.crossOrigin = 'anonymous';
    const track = audioCtx.createMediaElementSource(audio);
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0;
    track.connect(gainNode).connect(audioCtx.destination);
    audio.play();

    function fadeGain(target, duration = 0.5) {
        const now = audioCtx.currentTime;
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.linearRampToValueAtTime(target, now + duration);
    }

    anueImg.addEventListener('mouseenter', function () {
        fadeGain(1, 0.5);
    });

    anueImg.addEventListener('mouseleave', function () {
        fadeGain(0, 0.5);
    });
});
