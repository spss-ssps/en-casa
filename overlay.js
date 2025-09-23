document.getElementById('casa').addEventListener('click', () => {
    // Hide overlay
    document.getElementById('overlay').style.display = 'none';

    // Unlock audio context (if needed)
    const silentAudio = new Audio();
    silentAudio.play().catch(() => { });
})